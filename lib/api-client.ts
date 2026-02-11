import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "@/config/constants";
import { TokenRefreshPayload, TokenRefreshResponse } from "@/types";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<{ message: string }>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            : null;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const payload: TokenRefreshPayload = {
          refreshToken,
          expiresInMins: 1,
        };

        const response = await axios.post<TokenRefreshResponse>(
          `${API_BASE_URL}/auth/refresh`,
          payload,
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth data and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          // Redirect to login page
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
