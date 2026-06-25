export const chatApi = {
  baseUrl: '/api/v1',

  async initChat(payload: { session_id: string; name?: string; email?: string; phone?: string; order_id?: string }) {
    const res = await fetch(`${this.baseUrl}/chat/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to init chat');
    return res.json();
  },

  async getHistory(sessionId: string) {
    const res = await fetch(`${this.baseUrl}/chat/${encodeURIComponent(sessionId)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to get chat history');
    return res.json();
  },

  async sendMessage(sessionId: string, message: string) {
    const res = await fetch(`${this.baseUrl}/chat/${encodeURIComponent(sessionId)}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async markRead(sessionId: string) {
    await fetch(`${this.baseUrl}/chat/${encodeURIComponent(sessionId)}/read`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
  },

  async getAgentStatus(): Promise<{ agents_online: boolean; online_count: number }> {
    const res = await fetch(`${this.baseUrl}/chat/agent-status`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return { agents_online: true, online_count: 0 };
    return res.json();
  },

  async askAssistant(message: string, history: { role: 'user' | 'assistant'; content: string }[] = []) {
    const res = await fetch(`${this.baseUrl}/chat/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok && !json?.reply) {
      throw new Error('Failed to get AI help');
    }
    return json;
  }
};
