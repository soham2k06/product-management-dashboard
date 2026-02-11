"use client";

import { Category, Product } from "@/types";
import { ProductTable } from "./product-table";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQueryParams } from "@/hooks/use-query-params";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  category: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function ProductList({
  products,
  categories,
  category,
  page,
  pageSize,
  total,
  totalPages,
}: ProductListProps) {
  const router = useRouter();

  const { updateQueryParams } = useQueryParams();

  const [isPending, startTransition] = useTransition();
  const [paginationDirection, setPaginationDirection] = useState<
    "prev" | "next" | null
  >(null);

  const selectedCategory =
    typeof category === "string" && category.length > 0 ? category : "all";

  function handleSelectCategory(val: string) {
    startTransition(() => {
      updateQueryParams({
        category: val === "all" ? null : val,
        page: 1,
        search: null,
      });
    });
  }

  function handleSelectPageSize(val: string) {
    startTransition(() => {
      updateQueryParams({ limit: Number(val), page: 1 });
    });
  }

  function prevPage() {
    setPaginationDirection("prev");
    startTransition(() => {
      updateQueryParams({ page: page - 1 });
    });
  }

  function nextPage() {
    setPaginationDirection("next");
    startTransition(() => {
      updateQueryParams({ page: page + 1 });
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Select value={selectedCategory} onValueChange={handleSelectCategory}>
            <SelectTrigger className="w-full md:w-48">
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

          <Select value={String(pageSize)} onValueChange={handleSelectPageSize}>
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

        <Button
          onClick={() => router.push("/products/new")}
          className="w-full md:w-auto"
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {products.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
        {Math.min(page * pageSize, total)} of {total} products
      </div>

      {/* Table */}
      <ProductTable products={products} />

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
              onClick={prevPage}
              disabled={
                page === 1 || (isPending && paginationDirection === "prev")
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={
                page === totalPages ||
                (isPending && paginationDirection === "next")
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductList;
