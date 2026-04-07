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
  }
};
