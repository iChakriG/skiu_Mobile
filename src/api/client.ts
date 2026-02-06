import { Platform } from 'react-native';

const rawBase =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

// On Android emulator, localhost is the emulator itself. Use 10.0.2.2 to reach the host machine.
const API_BASE =
  Platform.OS === 'android' &&
  (rawBase.includes('localhost') || rawBase.includes('127.0.0.1'))
    ? rawBase.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2')
    : rawBase;

export function getBaseUrl(): string {
  return API_BASE;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object;
  userId?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, userId } = options;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { error?: string }).error || res.statusText;
    throw new Error(message);
  }
  return data as T;
}
