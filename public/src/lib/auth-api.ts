export async function fetchAuthData(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = '/login'; // Or handle redirect gracefully
      throw new Error('Unauthenticated');
    }
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
