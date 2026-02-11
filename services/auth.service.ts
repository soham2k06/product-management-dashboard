import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import {
  AuthCredentials,
  AuthResponse,
  TokenRefreshPayload,
  TokenRefreshResponse,
} from "@/types";

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const payload = {
      ...credentials,
      expiresInMins: credentials.expiresInMins || 1,
    };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return response.data;
  },

  refresh: async (
    payload: TokenRefreshPayload,
  ): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post<TokenRefreshResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      {
        ...payload,
        expiresInMins: payload.expiresInMins || 1,
      },
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
      // Continue logout even if API call fails
    }
  },
};
