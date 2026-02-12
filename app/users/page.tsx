import { DashboardLayout } from "@/components/layout/dashboard-layout";
import UserTable from "@/components/users/user-table";
import { DEFAULT_PAGE_SIZE } from "@/config/constants";
import { userService } from "@/services/user.service";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    limit?: string;
  }>;
}

const PAGE_SIZES_TO_PREFETCH = [10, 20, 50];

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.limit ?? DEFAULT_PAGE_SIZE);
  const searchQuery = searchParams.search ?? "";

  const offset = (page - 1) * pageSize;

  // Required data (priority)
  const { users, total } = await userService.getUsers(
    searchQuery,
    pageSize,
    offset,
  );

  const totalPages = Math.ceil(total / pageSize);

  /*
    Hybrid Prefetch Strategy:
    1. Prefetch first 2 pages for all page sizes
    2. Prefetch 2 pages ahead dynamically
  */

  const prefetchTasks: Promise<unknown>[] = [];
  const seen = new Set<string>();

  const addPrefetch = (size: number, targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages) return;

    const key = `${size}-${targetPage}`;
    if (seen.has(key)) return;

    seen.add(key);

    const skip = (targetPage - 1) * size;

    prefetchTasks.push(userService.getUsers(searchQuery, size, skip));
  };

  // 1️⃣ Default warm start (first 2 pages for all sizes)
  for (const size of PAGE_SIZES_TO_PREFETCH) {
    addPrefetch(size, 1);
    addPrefetch(size, 2);
  }

  // 2️⃣ Dynamic forward prefetch (current + next 2)
  addPrefetch(pageSize, page + 1);
  addPrefetch(pageSize, page + 2);

  void Promise.all(prefetchTasks);

  return (
    <DashboardLayout title="Users" search={searchQuery}>
      <UserTable
        users={users}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
