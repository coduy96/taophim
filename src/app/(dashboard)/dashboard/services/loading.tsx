import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ServicesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-full md:w-[300px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full overflow-hidden p-0 gap-0 border-border/50 bg-card/50">
            <div className="aspect-video relative bg-muted/20">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="mt-auto pt-2 flex items-center justify-between">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
