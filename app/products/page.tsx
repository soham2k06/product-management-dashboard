import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ProductList from "@/components/products/product-list";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import { productService } from "@/services/product.service";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    limit?: string;
  }>;
};

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.limit ?? DEFAULT_PAGE_SIZE);
  const searchQuery = searchParams.search ?? "";
  const categoryFilter = searchParams.category ?? "";

  const [categories, data] = await Promise.all([
    productService.getCategories(),
    productService.getProducts(searchQuery, pageSize, (page - 1) * pageSize),
  ]);

  const productsByCategory = categoryFilter
    ? await productService.getProductsByCategory(
        categoryFilter,
        pageSize,
        (page - 1) * pageSize,
      )
    : null;

  const dataToUse = productsByCategory || data;

  const products = dataToUse.products;
  const total = dataToUse.total;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <DashboardLayout title="Products" search={searchQuery}>
      <ProductList
        products={products}
        categories={categories}
        category={categoryFilter}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
