"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "@/lib/chat-api";
import { usePathname } from "next/navigation";

type ChatStatus = "waiting" | "assigned" | "active" | "transferred" | "closed";

type Message = {
  id: number;
  sender_type: "customer" | "agent" | "system";
  message: string;
  created_at: string;
};

type Conversation = {
  id: number;
  session_id: string;
  status: ChatStatus;
  messages: Message[];
  assigned_agent_id?: number | null;
  assigned_agent?: { name: string } | null;
};

// Tiny beep using Web Audio API — no external files needed
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* ignore if audio blocked */ }
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return formatTime(iso);
}

export function LiveChatWidget() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"home" | "form" | "chat">("home");
  const [sessionId, setSessionId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadId, setLastReadId] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessageCount = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session ID from localStorage
  useEffect(() => {
    let sid = localStorage.getItem("pw_chat_session");
    if (!sid) {
      sid = `sid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("pw_chat_session", sid);
    }
    setSessionId(sid);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length]);

  // When opening widget, check for existing session
  useEffect(() => {
    if (!open || view !== "home" || !sessionId) return;
    chatApi.getHistory(sessionId).then((res) => {
      if (res.conversation?.messages?.length > 0) {
        setConversation(res.conversation);
        setView("chat");
        // Count unread (agent messages newer than last read)
        const agentMsgs = res.conversation.messages.filter(
          (m: Message) => m.sender_type === "agent" && m.id > lastReadId
        );
        setUnreadCount(agentMsgs.length);
      }
    }).catch(() => {});
  }, [open, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Smart polling — slower when closed, faster when chatting
  const fetchHistory = useCallback(async () => {
    if (!sessionId || view !== "chat") return;
    try {
      const res = await chatApi.getHistory(sessionId);
      if (!res.conversation) return;

      const msgs: Message[] = res.conversation.messages ?? [];
      const newCount = msgs.length;

      // Play sound + count unread if new agent messages arrived
      if (newCount > prevMessageCount.current) {
        const newMsgs = msgs.slice(prevMessageCount.current);
        const hasNewAgentMsg = newMsgs.some((m) => m.sender_type === "agent");
        if (hasNewAgentMsg) {
          playNotificationSound();
          if (!open) {
            const newAgentCount = newMsgs.filter((m) => m.sender_type === "agent").length;
            setUnreadCount((u) => u + newAgentCount);
          }
        }
      }
      prevMessageCount.current = newCount;

      // Auto-read when chat is open
      if (open && view === "chat" && msgs.length > 0) {
        const lastId = msgs[msgs.length - 1]?.id ?? 0;
        if (lastId > lastReadId) {
          setLastReadId(lastId);
          setUnreadCount(0);
          chatApi.markRead(sessionId).catch(() => {});
        }
      }

      setConversation(res.conversation);
      setError(null);
      setRetryCount(0);
    } catch {
      setRetryCount((r) => r + 1);
      if (retryCount >= 5) setError("Connection lost. Retrying…");
    }
  }, [sessionId, view, open, lastReadId, retryCount]);

  useEffect(() => {
    if (!sessionId) return;
    if (view !== "chat") return;

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    fetchHistory(); // immediate fetch on view change
    const interval = open ? 3000 : 8000;
    pollIntervalRef.current = setInterval(fetchHistory, interval);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [sessionId, view, open, fetchHistory]);

  // Focus input when switching to chat view
  useEffect(() => {
    if (view === "chat" && open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [view, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await chatApi.initChat({ session_id: sessionId, name, email });
      setConversation(res.conversation);
      if (issue.trim()) {
        await chatApi.sendMessage(sessionId, issue);
        const updated = await chatApi.getHistory(sessionId);
        if (updated.conversation) setConversation(updated.conversation);
      }
      prevMessageCount.current = res.conversation?.messages?.length ?? 0;
      setView("chat");
    } catch {
      setError("Failed to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId || sending) return;

    const textToSend = inputText;
    setInputText("");
    setSending(true);

    // Optimistic UI
    if (conversation) {
      const tempMsg: Message = {
        id: Date.now(),
        sender_type: "customer",
        message: textToSend,
        created_at: new Date().toISOString(),
      };
      setConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, tempMsg] } : prev
      );
    }

    try {
      await chatApi.sendMessage(sessionId, textToSend);
      const updated = await chatApi.getHistory(sessionId);
      if (updated.conversation) {
        setConversation(updated.conversation);
        prevMessageCount.current = updated.conversation.messages?.length ?? 0;
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    const newSid = `sid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("pw_chat_session", newSid);
    setSessionId(newSid);
    setConversation(null);
    setName("");
    setEmail("");
    setIssue("");
    prevMessageCount.current = 0;
    setView("form");
  };

  // Don't render on admin pages
  if (pathname?.startsWith("/admin")) return null;

  // ─── Home View ───────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div className="p-6 flex-1 bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-red text-white flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-lg shadow-brand-red/20">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Hi there! 👋</h3>
        <p className="text-sm text-gray-500">How can we help you today?</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => setView("form")}
          className="w-full bg-brand-red text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-brand-red/20 hover:bg-red-700 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Start Live Chat
          </div>
          <svg className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <a href="/dashboard/orders"
          className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Track My Order
        </a>
        <a href="/contact"
          className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Read FAQs
        </a>
      </div>
    </div>
  );

  // ─── Form View ───────────────────────────────────────────────────────────────
  const renderForm = () => (
    <div className="p-6 flex-1 flex flex-col bg-white">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setView("home")} className="text-gray-400 hover:text-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-bold text-gray-900">Start a conversation</h3>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleStartChat} className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name <span className="text-brand-red">*</span></label>
          <input
            required type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-200 pb-2 pt-1 text-sm focus:outline-none focus:border-brand-red transition-colors"
            placeholder="Nimal Perera"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email <span className="text-brand-red">*</span></label>
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-200 pb-2 pt-1 text-sm focus:outline-none focus:border-brand-red transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">How can we help? <span className="text-gray-400">(optional)</span></label>
          <textarea
            value={issue} onChange={(e) => setIssue(e.target.value)}
            className="w-full border-b border-gray-200 pb-2 pt-1 text-sm focus:outline-none focus:border-brand-red transition-colors resize-none"
            rows={2} placeholder="Describe your issue…"
          />
        </div>
        <button
          disabled={loading} type="submit"
          className="w-full bg-brand-red text-white py-3 mt-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting…</>
          ) : "Connect with Agent"}
        </button>
      </form>
    </div>
  );

  // ─── Chat View ───────────────────────────────────────────────────────────────
  const renderChat = () => {
    const isClosed = conversation?.status === "closed";
    const isWaiting = conversation?.status === "waiting";
    const agentName = conversation?.assigned_agent?.name ?? "Agent";

    // Show typing indicator when: waiting or last message was from customer and status is active
    const messages = conversation?.messages ?? [];
    const lastMsg = messages[messages.length - 1];
    const showTyping = isWaiting ||
      (conversation?.status === "active" && lastMsg?.sender_type === "customer");

    return (
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-100 p-3 shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isClosed ? "bg-gray-400" :
              isWaiting ? "bg-yellow-400 animate-pulse" :
              "bg-green-500"
            }`} />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Print Works Support</h3>
              <p className="text-[11px] text-gray-500">
                {isClosed ? "Chat ended" :
                 isWaiting ? "Finding an available agent…" :
                 `Chatting with ${agentName}`}
              </p>
            </div>
          </div>
          {!isClosed && (
            <button
              onClick={handleNewChat}
              className="text-[11px] font-semibold text-gray-400 hover:text-brand-red transition-colors px-2 py-1 rounded"
              title="Start new chat"
            >
              New chat
            </button>
          )}
        </div>

        {/* Error bar */}
        {error && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Date separator */}
          <div className="text-center my-2">
            <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">Today</span>
          </div>

          {messages.map((msg) => {
            if (msg.sender_type === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.message}</span>
                </div>
              );
            }

            const isCustomer = msg.sender_type === "customer";
            return (
              <div key={msg.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"} group`}>
                {!isCustomer && (
                  <div className="w-6 h-6 rounded-full bg-brand-red text-white flex shrink-0 items-center justify-center text-[10px] font-bold mr-2 mt-auto">
                    PW
                  </div>
                )}
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isCustomer
                      ? "bg-brand-red text-white rounded-br-sm"
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"
                  }`}>
                    {msg.message}
                  </div>
                  <span className={`text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isCustomer ? "text-right" : "text-left"}`}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {showTyping && !isClosed && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-brand-red text-white flex shrink-0 items-center justify-center text-[10px] font-bold mr-2">PW</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 p-3 shrink-0">
          {isClosed ? (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 font-medium">Chat ended.</p>
              <button onClick={handleNewChat} className="mt-2 text-xs font-bold text-brand-red hover:underline">
                Start new chat
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isWaiting ? "Agent is joining…" : "Type a message…"}
                disabled={isWaiting}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending || isWaiting}
                className="w-9 h-9 flex items-center justify-center bg-brand-red text-white rounded-full disabled:opacity-50 transition-all hover:bg-red-700 active:scale-95"
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3" suppressHydrationWarning>
      {/* Widget Window */}
      {open && (
        <div className="flex flex-col w-[360px] h-[580px] max-h-[82vh] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-nav-dark px-5 py-4 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between text-white">
              <div>
                <h2 className="font-bold text-lg leading-tight">PrintWorks Support</h2>
                <p className="text-xs text-gray-300 opacity-80 mt-0.5">We typically reply in a few minutes</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          {view === "home" && renderHome()}
          {view === "form" && renderForm()}
          {view === "chat" && renderChat()}
        </div>
      )}

      {/* FAB Toggle */}
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="relative w-14 h-14 bg-brand-red hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-brand-red/30 transition-all hover:scale-105 active:scale-95"
        aria-label="Live Chat"
      >
        {/* Unread badge */}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-[10px] font-black px-1 shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
