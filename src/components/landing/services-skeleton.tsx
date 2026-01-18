import { Skeleton } from "@/components/ui/skeleton"

export function ServicesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col h-full bg-background border border-border/60 rounded-2xl overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-[16/10] relative bg-muted">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex flex-col flex-grow p-5 space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Price Estimation Skeleton */}
            <div className="p-3 bg-muted/50 rounded-xl space-y-2">
              <Skeleton className="h-3 w-40" />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border/50">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2 w-12 mt-1" />
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border/50">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2 w-12 mt-1" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
