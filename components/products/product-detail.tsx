"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ArrowLeft, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useDeleteProduct } from "@/hooks/use-products";
import { toast } from "sonner";
import ConfirmDelete from "@/components/products/confirm-delete";
import type { Product } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const router = useRouter();

  const [activeImage, setActiveImage] = useState<string>(
    product.thumbnail || product.images?.[0] || "/placeholder.svg",
  );

  const deleteProduct = useDeleteProduct();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
      setShowDeleteDialog(false);
      toast.success("Product deleted successfully");
      router.push("/products");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <DashboardLayout title={product?.title || "Product Details"}>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted shadow-sm">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {product.images?.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {[product.thumbnail, ...product.images]
                  .filter(Boolean)
                  .map((img, idx) => {
                    const isActive = img === activeImage;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img!)}
                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          isActive
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        <Image
                          src={img!}
                          alt={`${product.title} ${idx}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {product.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {product.brand} • {product.category}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}/edit`}>
                        <Edit />
                        Edit
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      variant="destructive"
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Price & Rating */}
            <div className="rounded-2xl border bg-muted/40 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">
                    ₹{product.price.toFixed(2)}
                  </span>

                  {product.discountPercentage > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStockStatus(product.stock).variant}>
                    {getStockStatus(product.stock).label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} units available
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="rounded-2xl border p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Product Information
              </h3>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.stock}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-medium">{product.discountPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDelete
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        productTitle={product?.title}
        isDeleting={deleteProduct.isPending}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
