const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string;
};

export async function apiRequest<TResponse>(path: string, options: ApiRequestOptions = {}): Promise<TResponse> {
  const { body, token, headers, ...init } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const payload = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? 'API request failed', response.status, payload);
  }

  return payload as TResponse;
}

export const api = {
  get: <TResponse>(path: string, token?: string) => apiRequest<TResponse>(path, { method: 'GET', token }),
  post: <TResponse>(path: string, body?: unknown, token?: string) =>
    apiRequest<TResponse>(path, { method: 'POST', body, token }),
  patch: <TResponse>(path: string, body?: unknown, token?: string) =>
    apiRequest<TResponse>(path, { method: 'PATCH', body, token }),
  delete: <TResponse>(path: string, token?: string) => apiRequest<TResponse>(path, { method: 'DELETE', token }),
};
