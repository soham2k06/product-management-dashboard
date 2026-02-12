import { DashboardLayout } from "@/components/layout/dashboard-layout";
import TableSkeleton from "@/components/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <DashboardLayout title="Users">
      <Skeleton className="h-5 w-1/2" />

      <TableSkeleton />
    </DashboardLayout>
  );
}
