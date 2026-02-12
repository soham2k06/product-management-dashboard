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

const PAGE_SIZES_TO_PREFETCH = [10, 20, 50];
const PAGES_TO_PREFETCH = [0, 1, 2];

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.limit ?? DEFAULT_PAGE_SIZE);
  const searchQuery = searchParams.search ?? "";
  const categoryFilter = searchParams.category ?? "";

  const offset = (page - 1) * pageSize;

  // Required data (priority)
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
    Prefetch by page size + first 3 pages
    Non-blocking
  */

  const prefetchTasks: Promise<unknown>[] = [];

  for (const size of PAGE_SIZES_TO_PREFETCH) {
    for (const pageIndex of PAGES_TO_PREFETCH) {
      const skip = pageIndex * size;

      if (categoryFilter) {
        prefetchTasks.push(
          productService.getProductsByCategory(categoryFilter, size, skip),
        );
      } else {
        prefetchTasks.push(productService.getProducts(searchQuery, size, skip));
      }
    }
  }

  /*
    Prefetch first page of each category
    Only when not filtering
  */
  if (!categoryFilter) {
    for (const category of categories) {
      for (const size of PAGE_SIZES_TO_PREFETCH) {
        prefetchTasks.push(
          productService.getProductsByCategory(category, size, 0),
        );
      }
    }
  }

  /*
  Prefetch 2 pages ahead (based on current page + pageSize)
  Non-blocking
*/
  for (let i = 1; i <= 2; i++) {
    const nextPage = page + i;

    if (nextPage > totalPages) continue;

    const skip = (nextPage - 1) * pageSize;

    if (categoryFilter) {
      prefetchTasks.push(
        productService.getProductsByCategory(categoryFilter, pageSize, skip),
      );
    } else {
      prefetchTasks.push(
        productService.getProducts(searchQuery, pageSize, skip),
      );
    }
  }

  void Promise.all(prefetchTasks);

  return (
    <DashboardLayout title="Products" search>
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
