'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useProduct, useDeleteProduct } from '@/hooks/use-products';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: product, isLoading } = useProduct(id);
  const deleteProduct = useDeleteProduct();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(id);
      setShowDeleteDialog(false);
      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <DashboardLayout title={product?.title || 'Product Details'}>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : product ? (
          <>
            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Images */}
                  <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {product.images && product.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {product.images.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                          >
                            <Image
                              src={img || "/placeholder.svg"}
                              alt={`${product.title} ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="100px"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
                      <p className="mt-2 text-muted-foreground">{product.brand}</p>
                    </div>

                    {/* Price & Rating */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">₹{product.price.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <Badge variant="secondary">{product.discountPercentage}% OFF</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.rating.toFixed(1)} out of 5
                        </span>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Availability</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStockStatus(product.stock).variant}>
                          {getStockStatus(product.stock).label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Category</p>
                        <p className="font-semibold text-foreground">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Brand</p>
                        <p className="font-semibold text-foreground">{product.brand}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Description</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => router.push(`/products/${id}/edit`)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {product?.title}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
