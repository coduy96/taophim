import { Skeleton } from "@/components/ui/skeleton"

export function ServicesSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col h-full bg-background border border-border/50 rounded-3xl overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-[16/10] relative bg-muted">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex flex-col flex-grow p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
