# /loading-skeleton

Create loading.tsx files with skeleton UI for Next.js routes.

## Usage

```
/loading-skeleton [route-path]
```

Example: `/loading-skeleton dashboard/orders`

## Instructions

### File Location
- Create `loading.tsx` in the route directory
- Example: `src/app/(dashboard)/dashboard/orders/loading.tsx`

### Loading Template
```typescript
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Skeleton Patterns

#### Text Lines
```typescript
<Skeleton className="h-4 w-full" />      // Full width
<Skeleton className="h-4 w-3/4" />       // 75% width
<Skeleton className="h-4 w-1/2" />       // 50% width
```

#### Avatar/Icon
```typescript
<Skeleton className="h-10 w-10 rounded-full" />
<Skeleton className="h-8 w-8 rounded-md" />
```

#### Card
```typescript
<Skeleton className="h-32 w-full rounded-lg" />
```

#### Button
```typescript
<Skeleton className="h-9 w-24 rounded-md" />
```

#### Table Row
```typescript
<div className="flex gap-4">
  <Skeleton className="h-4 w-24" />
  <Skeleton className="h-4 w-32" />
  <Skeleton className="h-4 w-16" />
</div>
```

### Match Page Layout
The skeleton should match the structure of the actual page:
- Same grid layout
- Similar spacing
- Approximate element sizes
- Same container widths

This provides a smooth transition when content loads.
