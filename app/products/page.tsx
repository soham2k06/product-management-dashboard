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

  const offset = (page - 1) * pageSize;

  // Required data
  const [categories, baseData] = await Promise.all([
    productService.getCategories(),
    categoryFilter
      ? productService.getProductsByCategory(categoryFilter, pageSize, offset)
      : productService.getProducts(searchQuery, pageSize, offset),
  ]);

  const products = baseData.products;
  const total = baseData.total;
  const totalPages = Math.ceil(total / pageSize);

  /*
    Hybrid Prefetch Strategy
    - Always prefetch first 3 pages
    - Prefetch next 2 pages dynamically
  */

  const pagesToPrefetch = new Set<number>();

  // Always warm first 3
  [1, 2, 3].forEach((p) => {
    if (p !== page && p <= totalPages) {
      pagesToPrefetch.add(p);
    }
  });

  // Prefetch next 2 dynamically
  [page + 1, page + 2].forEach((p) => {
    if (p <= totalPages) {
      pagesToPrefetch.add(p);
    }
  });

  const prefetchTasks = Array.from(pagesToPrefetch).map((p) => {
    const nextOffset = (p - 1) * pageSize;

    return categoryFilter
      ? productService.getProductsByCategory(
          categoryFilter,
          pageSize,
          nextOffset,
        )
      : productService.getProducts(searchQuery, pageSize, nextOffset);
  });

  void Promise.all(prefetchTasks);

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
