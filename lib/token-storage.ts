import { STORAGE_KEYS } from "@/config/constants";

let accessToken: string | null = null;

const ACCESS_TOKEN = STORAGE_KEYS.ACCESS_TOKEN;
const REFRESH_TOKEN = STORAGE_KEYS.REFRESH_TOKEN;

export const tokenStorage = {
  getAccessToken(): string | null {
    return accessToken ?? localStorage.getItem(ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    accessToken = token;
    localStorage.setItem(ACCESS_TOKEN, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  },

  clear(): void {
    accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  },
};
