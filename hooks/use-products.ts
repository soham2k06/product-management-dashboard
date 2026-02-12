"use client";

import { useMutation } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { CreateProductPayload } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      productService.createProduct(data),
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateProductPayload>;
    }) => productService.updateProduct(id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Update product error:", error);
      toast.error("Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    },
  });
};
