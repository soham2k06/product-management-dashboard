import { z } from "zod";

// Auth Validation
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must be at least 3 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Product Validation
export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be a positive number")
    .refine((val) => val >= 0, "Price cannot be negative"),
  discountPercentage: z
    .number({
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount must be between 0-100")
    .max(100, "Discount must be between 0-100")
    .optional()
    .default(0),
  stock: z
    .number({
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  brand: z
    .string()
    .min(1, "Brand is required")
    .min(2, "Brand must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid URL")
    .min(1, "Thumbnail is required"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .optional()
    .default([]),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// Search Validation
export const searchSchema = z.object({
  query: z.string().optional().default(""),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  category: z.string().optional().default(""),
  sortBy: z
    .enum(["price", "rating", "stock", "title", "none"])
    .optional()
    .default("none"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type SearchParams = z.infer<typeof searchSchema>;

// Settings Validation
export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional().default("system"),
  density: z.enum(["comfortable", "compact"]).optional().default("comfortable"),
  pageSize: z.number().int().min(10).max(100).optional().default(10),
  sidebarCollapsed: z.boolean().optional().default(false),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
