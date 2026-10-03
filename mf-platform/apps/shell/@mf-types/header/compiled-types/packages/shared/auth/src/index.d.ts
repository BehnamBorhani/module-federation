import { type AuthUser, type Permission } from '@mf/contracts';
export declare function createMockJwt(user: Omit<AuthUser, 'exp'>, ttlSeconds?: number): string;
export declare function decodeMockJwt(token: string): AuthUser | null;
export declare function authenticate(username: string, password: string): string | null;
export declare class AuthStore {
    private listeners;
    private snapshot;
    constructor();
    getToken(): string | null;
    getUser(): AuthUser | null;
    login(token: string): void;
    logout(): void;
    hasPermission(permission: Permission): boolean;
    subscribe(listener: () => void): () => void;
    captureHashToken(): void;
    private hydrate;
    private notify;
}
export declare function getAuthStore(): AuthStore;
