import { DashboardLayout } from "@/components/layout/dashboard-layout";

function Loading() {
  return (
    <DashboardLayout title="Product Details">
      <div className="space-y-6">
        {/* Back button */}
        <div className="mb-4 h-9 w-24 animate-pulse rounded-md bg-muted" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square animate-pulse rounded-2xl border bg-muted shadow-sm" />

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-20 shrink-0 animate-pulse rounded-xl border bg-muted"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title + menu */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
            </div>

            {/* Price & Rating */}
            <div className="rounded-2xl border bg-muted/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <div className="h-10 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="rounded-2xl border p-5 space-y-4">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />

              <div className="grid grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border p-5 space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-10/12 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Loading;
