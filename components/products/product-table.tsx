"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/config/constants";
import { useLocalStorage } from "@/hooks/use-debounce";
import { useDeleteProduct } from "@/hooks/use-products";
import ConfirmDelete from "./confirm-delete";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  const [density] = useLocalStorage<"comfortable" | "compact">(
    STORAGE_KEYS.DENSITY,
    "comfortable",
  );

  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allSelected = useMemo(
    () => products.length > 0 && selectedIds.length === products.length,
    [products, selectedIds],
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleProductAction = (product: Product, action: "view" | "edit") => {
    switch (action) {
      case "view":
        router.push(`/products/${product.id}`);
        break;
      case "edit":
        router.push(`/products/${product.id}/edit`);
        break;
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow
            className={cn({
              "[&>th]:px-4": density === "comfortable",
              "[&>th]:px-1": density === "compact",
            })}
          >
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className={cn({
                  "[&>td]:p-4": density === "comfortable",
                  "[&>td]:p-1": density === "compact",
                })}
                onClick={() => handleProductAction(product, "view")}
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  <span className="font-medium">{product.title}</span>
                </TableCell>
                <TableCell>{product.brand ?? "-"}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  ₹{product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell className="text-center">
                  {product.rating.toFixed(1)}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductAction(product, "edit");
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProductId(product.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDelete
        open={deleteProductId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteProductId(null);
        }}
        productTitle={`#${deleteProductId}`}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (deleteProductId) {
            deleteProduct(deleteProductId, {
              onSuccess: () => {
                setDeleteProductId(null);
              },
            });
          }
        }}
      />
    </div>
  );
}
