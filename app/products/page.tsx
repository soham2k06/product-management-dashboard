"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProductTable } from "@/components/products/product-table";
import {
  useProducts,
  useProductSearch,
  useCategories,
  useDeleteProduct,
} from "@/hooks/use-products";
import { Product } from "@/types";
import { DEFAULT_PAGE_SIZE, STORAGE_KEYS } from "@/config/constants";
import ConfirmDelete from "@/components/products/confirm-delete";

export default function ProductsPage() {
  const router = useRouter();

  const globalPageSize =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.PAGE_SIZE)
      : null;

  // State from URL
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(Number(globalPageSize) || DEFAULT_PAGE_SIZE),
  );

  // Fetch data based on query
  const { data: productsData, isLoading: productsLoading } = useProducts(
    page,
    pageSize,
  );
  const { data: searchData, isLoading: searchLoading } =
    useProductSearch(searchQuery);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Determine which data to display
  const displayData = searchQuery ? searchData : productsData;
  const products = displayData?.products || [];
  const total = displayData?.total || 0;
  const isLoading = productsLoading || searchLoading;

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  return (
    <DashboardLayout
      title="Products"
      search={searchQuery}
      onSearch={handleSearch}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Category Filter */}

            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full md:w-48"
                disabled={categoriesLoading}
              >
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                console.log(Number(val));
                setPageSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Product Button */}
          <Button
            onClick={() => router.push("/products/new")}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 size-4" />
            Add Product
          </Button>
        </div>

        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          Showing {products.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} products
        </div>

        {/* Table */}
        <ProductTable products={products} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
