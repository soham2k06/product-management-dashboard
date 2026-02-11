// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  PRODUCTS: {
    LIST: "/products",
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    CATEGORY: "/products/category",
    DETAIL: "/products",
    ADD: "/products/add",
    UPDATE: "/products",
    DELETE: "/products",
  },
  USERS: {
    LIST: "/users",
    SEARCH: "/users/search",
    DETAIL: "/users",
  },
};

// Query Keys for React Query
export const QUERY_KEYS = {
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (page: number, limit: number) =>
      [...QUERY_KEYS.PRODUCTS.ALL, "list", page, limit] as const,
    SEARCH: (query: string) =>
      [...QUERY_KEYS.PRODUCTS.ALL, "search", query] as const,
    BY_CATEGORY: (category: string) =>
      [...QUERY_KEYS.PRODUCTS.ALL, "category", category] as const,
    CATEGORIES: ["products", "categories"] as const,
    DETAIL: (id: number) => [...QUERY_KEYS.PRODUCTS.ALL, "detail", id] as const,
  },
  USERS: {
    ALL: ["users"] as const,
    LIST: (page: number, limit: number) =>
      [...QUERY_KEYS.USERS.ALL, "list", page, limit] as const,
    SEARCH: (query: string) =>
      [...QUERY_KEYS.USERS.ALL, "search", query] as const,
    DETAIL: (id: number) => [...QUERY_KEYS.USERS.ALL, "detail", id] as const,
  },
  DASHBOARD: {
    STATS: ["dashboard", "stats"] as const,
  },
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  REMEMBER_USERNAME: "remember_username",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  THEME: "theme",
  PAGE_SIZE: "page_size",
  DENSITY: "table_density",
};

// Token refresh timing (in minutes)
export const TOKEN_REFRESH_THRESHOLD = 2; // Refresh token 2 minutes before expiry
