"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { AuthCredentials, AuthResponse } from "@/types";
import { AxiosError } from "axios";

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setTokens,
    initialize,
    logout: logoutStore,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      return authService.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      const { accessToken, refreshToken, ...userData } = data;
      setTokens(accessToken, refreshToken);
      setUser(userData);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Login failed:", error);
    },
  });

  // Logout function
  const logout = useCallback(() => {
    logoutStore();
    router.push("/login");
  }, [router, logoutStore]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Methods
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,

    // Status
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
