"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
import ProductTableHeader from "./product-table/product-table-header";
import { prefetchProduct } from "@/app/products/actions";

interface ProductTableProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export type SortKey = "price" | "rating" | "stock" | "title";
type SortDirection = "asc" | "desc";
export type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};

export function ProductTable({ products, setProducts }: ProductTableProps) {
  const router = useRouter();
  const [density] = useLocalStorage<"comfortable" | "compact">(
    STORAGE_KEYS.DENSITY,
    "comfortable",
  );

  const prefetched = useRef(false);

  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allSelected = useMemo(
    () => products.length > 0 && selectedIds.length === products.length,
    [products, selectedIds],
  );

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(products.map((p) => p.id));
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleProductAction = (product: Product, action: "view" | "edit") => {
    if (action === "view") router.push(`/products/${product.id}`);
    else if (action === "edit") router.push(`/products/${product.id}/edit`);
  };

  const handleMouseEnter = async (id: number) => {
    if (prefetched.current) return;

    prefetched.current = true;

    // Warm RSC route
    router.prefetch(`/products/${id}`);

    // Warm server cache
    prefetchProduct(id);
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

  const sortedProducts = useMemo(() => {
    if (!sortConfig) return products;

    const sorted = [...products].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aVal: number | string = a[key];
      let bVal: number | string = b[key];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  // Single delete mutation with optimistic update
  const { mutate: deleteProductMutate, isPending: isDeleting } =
    useDeleteProduct();

  const handleDeleteSingle = (id: number) => {
    const prevProducts = [...products];
    setProducts(products.filter((p) => p.id !== id));
    deleteProductMutate(id, {
      onError: () => {
        // rollback on error
        setProducts(prevProducts);
      },
      onSuccess: () => {
        setDeleteProductId(null);
        setSelectedIds((prev) => prev.filter((pid) => pid !== id));
      },
    });
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const prevProducts = [...products];
    setProducts(products.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]); // Clear selection immediately

    // Loop through each ID and call mutate
    selectedIds.forEach((id) => {
      deleteProductMutate(id, {
        onError: () => {
          // rollback if any fail
          setProducts(prevProducts);
        },
      });
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="fixed bottom-4 right-4 z-50">
        {selectedIds.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      <Table>
        <ProductTableHeader
          density={density}
          allSelected={allSelected}
          toggleSelectAll={toggleSelectAll}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />

        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow
                key={product.id}
                className={cn({
                  "[&>td]:p-4": density === "comfortable",
                  "[&>td]:p-1": density === "compact",
                })}
                onClick={() => handleProductAction(product, "view")}
                onMouseEnter={() => handleMouseEnter(product.id)}
              >
                <TableCell className="text-center">
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
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
          if (deleteProductId) handleDeleteSingle(deleteProductId);
        }}
      />
    </div>
  );
}
