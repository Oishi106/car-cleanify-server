export const apiFetch = async (endpoint, options = {}, session = null) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (session?.user?.backendToken) {
    headers.Authorization = `Bearer ${session.user.backendToken}`;
  }

  // Network error handle করা
  let res;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Network error — server unreachable');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};