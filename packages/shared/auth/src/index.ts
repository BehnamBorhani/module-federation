import {
  DEMO_USERS,
  MF_EVENTS,
  type AuthUser,
  type Permission,
} from '@mf/contracts';

const TOKEN_KEY = 'mf.auth.token';
const WINDOW_KEY = '__MF_AUTH__';

type AuthWindow = Window & {
  [WINDOW_KEY]?: AuthStore;
};

function encodeSegment(value: unknown): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decodeSegment<T>(segment: string): T | null {
  try {
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    return JSON.parse(atob(padded + pad)) as T;
  } catch {
    return null;
  }
}

export function createMockJwt(
  user: Omit<AuthUser, 'exp'>,
  ttlSeconds = 60 * 60,
): string {
  const header = { alg: 'none', typ: 'JWT' };
  const payload: AuthUser = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return `${encodeSegment(header)}.${encodeSegment(payload)}.mock`;
}

export function decodeMockJwt(token: string): AuthUser | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = decodeSegment<AuthUser>(parts[1]);
  if (!payload?.sub || !Array.isArray(payload.permissions)) return null;
  return payload;
}

export function authenticate(username: string, password: string): string | null {
  const account = DEMO_USERS.find(
    (user) => user.username === username && user.password === password,
  );
  if (!account) return null;
  return createMockJwt({
    sub: account.username,
    name: account.name,
    permissions: account.permissions,
  });
}

export class AuthStore {
  private listeners = new Set<() => void>();
  private snapshot: AuthUser | null = null;

  constructor() {
    this.hydrate();
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this.snapshot;
  }

  login(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    this.hydrate();
    this.notify();
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.snapshot = null;
    this.notify();
  }

  hasPermission(permission: Permission): boolean {
    return this.snapshot?.permissions.includes(permission) ?? false;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  captureHashToken(): void {
    if (!window.location.hash.includes('access_token=')) return;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const token = params.get('access_token');
    if (token) {
      this.login(token);
      history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }

  private hydrate(): void {
    const token = this.getToken();
    if (!token) {
      this.snapshot = null;
      return;
    }
    const payload = decodeMockJwt(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(TOKEN_KEY);
      this.snapshot = null;
      return;
    }
    this.snapshot = payload;
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
    window.dispatchEvent(
      new CustomEvent(MF_EVENTS.AUTH_CHANGED, { detail: this.snapshot }),
    );
  }
}

export function getAuthStore(): AuthStore {
  const host = window as AuthWindow;
  if (!host[WINDOW_KEY]) {
    host[WINDOW_KEY] = new AuthStore();
  }
  return host[WINDOW_KEY];
}
