import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-5 md:space-y-8 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-7 sm:h-9 w-[140px] sm:w-[200px]" />
          <Skeleton className="h-4 sm:h-5 w-[200px] sm:w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px] sm:w-[150px] rounded-full" />
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="flex gap-1.5 sm:gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 flex-1 sm:flex-none sm:w-[100px] rounded-lg" />
          ))}
        </div>

        {/* Mobile card skeletons */}
        <div className="space-y-2 sm:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 border rounded-2xl">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table skeletons */}
        <div className="hidden sm:block rounded-2xl border overflow-hidden">
          <div className="bg-muted/30 px-4 py-3">
            <Skeleton className="h-4 w-full max-w-[400px]" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-t">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
