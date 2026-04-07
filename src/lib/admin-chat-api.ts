class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {}
    throw new ApiError(message, res.status);
  }
  return res.json();
}

export const adminChatApi = {
  baseUrl: '/api/admin/chat',

  getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Authorization': `Bearer ${token ?? ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  },

  async getConversations() {
    const res = await fetch(this.baseUrl, { headers: this.getHeaders() });
    return handleResponse(res);
  },

  async getAgents() {
    const res = await fetch(`${this.baseUrl}/agents`, { headers: this.getHeaders() });
    return handleResponse(res);
  },

  async createAgent(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${this.baseUrl}/agents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getConversation(id: number) {
    const res = await fetch(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    return handleResponse(res);
  },

  async sendMessage(id: number, message: string) {
    const res = await fetch(`${this.baseUrl}/${id}/message`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message })
    });
    return handleResponse(res);
  },

  async assignChat(id: number, agentId?: number) {
    const res = await fetch(`${this.baseUrl}/${id}/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ agent_id: agentId })
    });
    return handleResponse(res);
  },

  async transferChat(id: number, agentId: number, reason: string) {
    const res = await fetch(`${this.baseUrl}/${id}/transfer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ agent_id: agentId, reason })
    });
    return handleResponse(res);
  },

  async closeChat(id: number) {
    const res = await fetch(`${this.baseUrl}/${id}/close`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return handleResponse(res);
  }
};
