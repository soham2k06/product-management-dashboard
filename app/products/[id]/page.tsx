import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import ProductDetail from "@/components/products/product-detail";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const params = await props.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) notFound();

  const product = await productService.getProduct(id);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
