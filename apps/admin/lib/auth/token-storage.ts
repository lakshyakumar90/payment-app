import { setAccessToken } from "../api/access-token";
const STORAGE_KEY = "access_token";

export function isBrowser(): boolean {
    return typeof window !== "undefined";
}

export function persistAccessToken(token: string): void {
    if(isBrowser()) {
        sessionStorage.setItem(STORAGE_KEY, token);
    }
    setAccessToken(token);
}

export function clearStoredAccessToken(): void {
    if(isBrowser()) {
        sessionStorage.removeItem(STORAGE_KEY);
    }
    setAccessToken(null);
}

export function hydrateAccessTokenFromStorage(): void {
    if(!isBrowser()) {
        return;
    }
    const token = sessionStorage.getItem(STORAGE_KEY);
    if(token) {
        setAccessToken(token);
    }
}

export function getStoredAccessToken(): string | null {
    if(!isBrowser()) {
        return null;
    }
    return sessionStorage.getItem(STORAGE_KEY);
}