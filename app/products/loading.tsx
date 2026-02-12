import { DashboardLayout } from "@/components/layout/dashboard-layout";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <DashboardLayout title="Products" search>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-8 w-full md:w-48" />
          <Skeleton className="h-8 w-full md:w-40" />
        </div>

        <Button asChild>
          <Link href="/products/new">
            <Plus className="size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Skeleton className="h-5 w-1/2" />

      <TableSkeleton />
    </DashboardLayout>
  );
}
