'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductForm } from '@/components/products/product-form';
import { useCreateProduct } from '@/hooks/use-products';
import { CreateProductFormData } from '@/lib/validations';

export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: CreateProductFormData) => {
    await createProduct.mutateAsync(data);
    router.push('/products');
  };

  return (
    <DashboardLayout title="Add Product">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>
              Add a new product to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              onSubmit={handleSubmit}
              isLoading={createProduct.isPending}
              error={createProduct.error}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
