import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProductForm } from "@/components/products/product-form";
import { Product } from "@/types";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage(props: EditProductPageProps) {
  const params = await props.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) notFound();

  const product = await productService.getProduct(id);

  if (!product) notFound();

  const categories = await productService.getCategories();

  return (
    <DashboardLayout title={product?.title || "Edit Product"}>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update product information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} categories={categories} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
