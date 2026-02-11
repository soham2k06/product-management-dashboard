import { AxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Auth Types
export interface AuthCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface TokenRefreshPayload {
  refreshToken: string;
  expiresInMins?: number;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Product Types
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  meta?: ProductMeta;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  returnPolicy?: string;
  minimumOrderQuantity?: number;
}

export interface Category {
  name: string;
  slug: string;
  url: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: number;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  phone: string;
  bloodGroup?: string;
  image: string;
  company?: {
    department: string;
    name: string;
    title: string;
    address?: {
      address: string;
      city: string;
      state: string;
      stateCode?: string;
      postalCode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  address?: {
    address: string;
    city: string;
    state: string;
    stateCode?: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    country: string;
  };
}

export interface UsersListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// API Response Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Upload Types
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  lowStockItems: number;
  averagePrice: number;
  averageRating: number;
  categoriesCount: number;
}
