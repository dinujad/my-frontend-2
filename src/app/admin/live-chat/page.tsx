"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { adminChatApi } from "@/lib/admin-chat-api";
import { useRouter } from "next/navigation";

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
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  assigned_agent?: string;
  unread_count?: number;
  last_activity_at: string;
  snippet?: string;
  messages?: Message[];
};

type Agent = { id: number; name: string; email: string; role: string };

function playAlert() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.12].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.2, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.2);
    });
  } catch { /* blocked */ }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return formatTime(iso);
  return new Date(iso).toLocaleDateString();
}

export default function AdminLiveChat() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [canManageAgents, setCanManageAgents] = useState(false);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [transferMode, setTransferMode] = useState(false);
  const [transferReason, setTransferReason] = useState("");
  const [transferAgentId, setTransferAgentId] = useState<number | "">("");

  const [filter, setFilter] = useState<"all" | "waiting" | "active" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({ name: "", email: "", password: "" });
  const [addingAgent, setAddingAgent] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevWaitingCount = useRef(0);
  const prevQueueLength = useRef(0);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // Init
  useEffect(() => {
    const name = localStorage.getItem("user_name") || "";
    const role = localStorage.getItem("user_role") || "";
    setAgentName(name);
    setCanManageAgents(role === "admin" || role === "super_admin");
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch queue
  const fetchQueue = useCallback(async () => {
    try {
      const data: Conversation[] = await adminChatApi.getConversations();
      setConversations(data);
      setApiError(null);

      const waitingCount = data.filter((c) => c.status === "waiting").length;
      const totalCount = data.length;

      // Notify on new waiting chats
      if (waitingCount > prevWaitingCount.current) {
        if (soundEnabled) playAlert();
        if (Notification.permission === "granted") {
          new Notification("PrintWorks Support", {
            body: `${waitingCount} customer(s) waiting for support`,
            icon: "/favicon.ico",
          });
        }
      }
      prevWaitingCount.current = waitingCount;
      prevQueueLength.current = totalCount;
    } catch (e: any) {
      if (e?.status === 401) router.push("/admin/login");
      else setApiError(e?.message || "Failed to load chats");
    } finally {
      setLoadingQueue(false);
    }
  }, [router, soundEnabled]);

  // Queue polling (5s)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/admin/login"); return; }
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue, router]);

  // Active chat polling (2.5s when chat open)
  useEffect(() => {
    if (!activeChatId) return;
    let isCancelled = false;

    const fetchChat = async () => {
      try {
        const data: Conversation = await adminChatApi.getConversation(activeChatId);
        if (!isCancelled) setActiveChat(data);
      } catch (e: any) {
        if (e?.status === 401) router.push("/admin/login");
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 2500);
    return () => { isCancelled = true; clearInterval(interval); };
  }, [activeChatId, router]);

  // Fetch agents once
  useEffect(() => {
    adminChatApi.getAgents().then(setAgents).catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  // Focus input when chat becomes active
  useEffect(() => {
    if (activeChat?.status === "active") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeChat?.status]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId || sending) return;
    const msg = inputText;
    setInputText("");
    setSending(true);
    try {
      await adminChatApi.sendMessage(activeChatId, msg);
      const data = await adminChatApi.getConversation(activeChatId);
      setActiveChat(data);
    } catch {
      // restore on failure
      setInputText(msg);
    } finally {
      setSending(false);
    }
  };

  const handleClaim = async () => {
    if (!activeChatId) return;
    try {
      await adminChatApi.assignChat(activeChatId);
      const data = await adminChatApi.getConversation(activeChatId);
      setActiveChat(data);
    } catch { }
  };

  const handleTransfer = async () => {
    if (!activeChatId || !transferAgentId || !transferReason) return;
    try {
      await adminChatApi.transferChat(activeChatId, Number(transferAgentId), transferReason);
      setTransferMode(false);
      const data = await adminChatApi.getConversation(activeChatId);
      setActiveChat(data);
    } catch { }
  };

  const handleClose = async () => {
    if (!activeChatId) return;
    if (!confirm("Are you sure you want to close this chat?")) return;
    try {
      await adminChatApi.closeChat(activeChatId);
      const data = await adminChatApi.getConversation(activeChatId);
      setActiveChat(data);
    } catch { }
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAgent(true);
    try {
      await adminChatApi.createAgent(newAgentForm);
      const updated = await adminChatApi.getAgents();
      setAgents(updated);
      setShowAddAgent(false);
      setNewAgentForm({ name: "", email: "", password: "" });
    } catch (e: any) {
      alert(e.message || "Failed to add agent.");
    } finally {
      setAddingAgent(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    router.push("/admin/login");
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter =
      filter === "all" ? true :
      filter === "waiting" ? c.status === "waiting" :
      filter === "active" ? ["active", "assigned", "transferred"].includes(c.status) :
      c.status === "closed";

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      c.customer_name.toLowerCase().includes(q) ||
      (c.customer_email ?? "").toLowerCase().includes(q) ||
      (c.snippet ?? "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count ?? 0), 0);
  const waitingCount = conversations.filter((c) => c.status === "waiting").length;

  const statusDot = (status: ChatStatus) => {
    const cls = {
      waiting: "bg-yellow-400 animate-pulse",
      active: "bg-green-500",
      assigned: "bg-green-500",
      transferred: "bg-blue-500",
      closed: "bg-gray-400",
    }[status] ?? "bg-gray-400";
    return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${cls}`} />;
  };

  return (
    <div className="flex h-screen w-full font-sans bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex-col hidden md:flex z-50">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 bg-gray-950 font-bold text-xl tracking-tight shrink-0 gap-2">
          <img src="/logo.png" alt="PrintWorks" className="h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span>Print<span className="text-brand-red">Works</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {/* Back to main admin */}
            <a
              href={`${BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <i className="bi bi-speedometer2 text-lg w-6 text-center" /> Dashboard
            </a>

            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-brand-red text-white">
              <i className="bi bi-chat-dots text-lg w-6 text-center" />
              <span className="flex-1">Live Chat</span>
              {totalUnread > 0 && (
                <span className="min-w-[20px] h-5 rounded-full bg-white text-brand-red flex items-center justify-center text-[10px] font-black px-1">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
              {totalUnread === 0 && waitingCount > 0 && (
                <span className="min-w-[20px] h-5 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-[10px] font-black px-1">
                  {waitingCount}
                </span>
              )}
            </div>

            {canManageAgents && (
              <button
                onClick={() => setShowAddAgent(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <i className="bi bi-person-plus text-lg w-6 text-center" /> Add Agent
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 bg-gray-950 shrink-0 space-y-1">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <i className={`bi ${soundEnabled ? "bi-volume-up" : "bi-volume-mute"} text-lg w-6 text-center`} />
            {soundEnabled ? "Sound On" : "Sound Off"}
          </button>

          {agentName && (
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-red flex items-center justify-center text-white text-xs font-bold shrink-0">
                {agentName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{agentName}</p>
                <p className="text-gray-500 text-[10px]">Support Agent</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <i className="bi bi-box-arrow-left text-lg w-6 text-center" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex h-screen overflow-hidden">
        {/* Chat UI */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100 p-4 md:p-6">
          <div className="flex-1 flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-0">

            {/* Queue Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 shrink-0">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-800">Live Chats</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {waitingCount > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                        {waitingCount} waiting
                      </span>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats…"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-1 flex-wrap">
                  {(["all", "waiting", "active", "closed"] as const).map((f) => {
                    const count =
                      f === "all" ? conversations.length :
                      f === "waiting" ? conversations.filter((c) => c.status === "waiting").length :
                      f === "active" ? conversations.filter((c) => ["active", "assigned", "transferred"].includes(c.status)).length :
                      conversations.filter((c) => c.status === "closed").length;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${filter === f ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {f}
                        {count > 0 && (
                          <span className={`text-[10px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 ${
                            filter === f
                              ? f === "waiting" ? "bg-yellow-400 text-gray-900" : "bg-white/20 text-white"
                              : f === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-600"
                          }`}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loadingQueue && (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Loading chats…</p>
                  </div>
                )}
                {!loadingQueue && apiError && (
                  <div className="m-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                    <p className="font-bold mb-1">Error</p>
                    <p>{apiError}</p>
                    <button
                      onClick={() => { setApiError(null); setLoadingQueue(true); fetchQueue(); }}
                      className="mt-2 text-red-700 underline font-semibold"
                    >Retry</button>
                  </div>
                )}
                {!loadingQueue && !apiError && filteredConversations.length === 0 && (
                  <div className="text-center text-sm text-gray-400 py-12">
                    <i className="bi bi-chat-square text-4xl opacity-30 block mb-2" />
                    No chats found
                  </div>
                )}
                {filteredConversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setActiveChat(null); setTransferMode(false); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border ${
                      activeChatId === chat.id
                        ? "bg-white border-brand-red shadow-sm"
                        : "bg-transparent border-transparent hover:bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {statusDot(chat.status)}
                        <span className="font-bold text-gray-800 text-sm truncate">{chat.customer_name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">{formatRelative(chat.last_activity_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate pl-3.5">{chat.snippet || "Started a new session"}</p>
                    <div className="flex justify-between items-center pl-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        chat.status === "waiting" ? "bg-yellow-100 text-yellow-700" :
                        chat.status === "active" || chat.status === "assigned" ? "bg-green-100 text-green-700" :
                        chat.status === "transferred" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {chat.status}
                      </span>
                      {(chat.unread_count ?? 0) > 0 && (
                        <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-black">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            {activeChat ? (
              <div className="flex-1 flex overflow-hidden">
                {/* Messages */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm shrink-0">
                        {activeChat.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{activeChat.customer_name}</h3>
                        <p className="text-xs text-gray-500">{activeChat.customer_email || "No email"}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      activeChat.status === "waiting" ? "bg-yellow-100 text-yellow-700" :
                      activeChat.status === "closed" ? "bg-gray-100 text-gray-500" :
                      activeChat.status === "transferred" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {activeChat.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                    {/* Date separator */}
                    <div className="flex justify-center">
                      <span className="text-[11px] text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {activeChat.messages?.map((msg) => {
                      if (msg.sender_type === "system") {
                        return (
                          <div key={msg.id} className="flex justify-center my-3">
                            <span className="text-[11px] font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{msg.message}</span>
                          </div>
                        );
                      }
                      const isAgent = msg.sender_type === "agent";
                      return (
                        <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"} group`}>
                          {!isAgent && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex shrink-0 items-center justify-center text-xs font-bold mr-2 mt-auto text-gray-600">
                              {activeChat.customer_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5 max-w-[70%]">
                            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              isAgent
                                ? "bg-gray-800 text-white rounded-br-sm"
                                : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <span className={`text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isAgent ? "text-right" : "text-left"}`}>
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    {activeChat.status === "waiting" ? (
                      <div className="text-center py-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm text-amber-700 mb-3 font-medium">Customer is waiting in queue</p>
                        <button
                          onClick={handleClaim}
                          className="bg-brand-red text-white py-2 px-6 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-sm shadow-brand-red/20"
                        >
                          Claim & Start Chat
                        </button>
                      </div>
                    ) : activeChat.status === "closed" ? (
                      <div className="text-center py-3 text-sm text-gray-500 font-medium bg-gray-50 rounded-xl border border-gray-200">
                        Chat is closed.
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                        <textarea
                          ref={inputRef}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Type your reply… (Enter to send, Shift+Enter for newline)"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-gray-400 resize-none h-14 leading-relaxed"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!inputText.trim() || sending}
                          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors h-14 flex items-center gap-2 shrink-0"
                        >
                          {sending ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <i className="bi bi-send-fill" />
                          )}
                          Send
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Right Panel */}
                <div className="w-60 border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto">
                  {/* Customer Info */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Customer Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Name</p>
                        <p className="text-sm font-semibold text-gray-800">{activeChat.customer_name}</p>
                      </div>
                      {activeChat.customer_email && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Email</p>
                          <p className="text-sm text-gray-700 break-all">{activeChat.customer_email}</p>
                        </div>
                      )}
                      {activeChat.customer_phone && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Phone</p>
                          <p className="text-sm text-gray-700">{activeChat.customer_phone}</p>
                        </div>
                      )}
                      {activeChat.assigned_agent && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Assigned To</p>
                          <p className="text-sm text-gray-700">{activeChat.assigned_agent}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {activeChat.status !== "closed" && (
                    <div className="p-4 space-y-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Actions</h4>

                      {!transferMode ? (
                        <button
                          onClick={() => setTransferMode(true)}
                          className="w-full text-left px-3 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2 border border-transparent hover:border-blue-100"
                        >
                          <i className="bi bi-arrow-left-right" /> Transfer Chat
                        </button>
                      ) : (
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 space-y-2">
                          <h5 className="text-xs font-bold text-blue-800">Transfer to Agent</h5>
                          <select
                            value={transferAgentId}
                            onChange={(e) => setTransferAgentId(Number(e.target.value))}
                            className="w-full text-sm bg-white border border-blue-200 rounded-lg p-2 focus:outline-none focus:border-blue-400"
                          >
                            <option value="">Select agent…</option>
                            {agents.map((a) => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                          <textarea
                            placeholder="Reason for transfer…"
                            value={transferReason}
                            onChange={(e) => setTransferReason(e.target.value)}
                            className="w-full text-sm bg-white border border-blue-200 rounded-lg p-2 focus:outline-none focus:border-blue-400 resize-none text-[12px]"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setTransferMode(false)} className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button
                              onClick={handleTransfer}
                              disabled={!transferAgentId || !transferReason}
                              className="flex-1 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >Transfer</button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleClose}
                        className="w-full text-left px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 border border-transparent hover:border-red-100"
                      >
                        <i className="bi bi-x-circle" /> Close Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-400">
                <i className="bi bi-chat-square-dots text-6xl opacity-20 mb-4" />
                <p className="font-semibold text-lg text-gray-500">No chat selected</p>
                <p className="text-sm mt-1 text-gray-400">Select a conversation to start replying</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && canManageAgents && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => setShowAddAgent(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="bi bi-person-plus text-brand-red" /> Add Live Chat Agent
            </h3>
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                <input
                  required type="text" value={newAgentForm.name}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                  placeholder="Agent Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input
                  required type="email" value={newAgentForm.email}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                  placeholder="agent@printworks.lk"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input
                  required minLength={8} type="password" value={newAgentForm.password}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                  placeholder="Min 8 characters"
                />
              </div>
              <button
                disabled={addingAgent} type="submit"
                className="w-full bg-brand-red text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingAgent ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding…</>
                ) : "Create Agent"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
