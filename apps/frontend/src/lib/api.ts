const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function api<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? 'Something went wrong');
  }

  return data as T;
}
