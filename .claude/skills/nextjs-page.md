# /nextjs-page

Create a new Next.js App Router page following project conventions.

## Usage

```
/nextjs-page [route-path] [description]
```

Example: `/nextjs-page dashboard/analytics Analytics dashboard page`

## Instructions

When creating a new page, follow these conventions:

### File Location
- Place in `src/app/` following the route structure
- Use route groups: `(auth)` for auth pages, `(dashboard)` for protected pages, `admin` for admin pages
- Create `page.tsx` for the main page component
- Create `loading.tsx` for loading states (use Skeleton components)

### Server Component Pattern (Default)
```typescript
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
// Import UI components from @/components/ui/
// Import icons from @hugeicons/core-free-icons

export default async function PageName() {
  const supabase = await createClient()

  // Auth check for protected pages
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch data
  const { data } = await supabase.from('table').select('*')

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Page content */}
    </div>
  )
}
```

### Client Component Pattern (When needed)
```typescript
"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
```

### UI Guidelines
- All user-facing text in Vietnamese
- Use "Xu" for credits, "Đơn hàng" for orders
- Use shadcn/ui components from `@/components/ui/`
- Use `cn()` from `@/lib/utils` for conditional classes
- Icons: Use HugeIcons from `@hugeicons/core-free-icons`
- Date format: `toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })`
- Number format: `new Intl.NumberFormat('vi-VN').format(amount)`

### Status Labels (for orders)
```typescript
const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-yellow-500/10 text-yellow-600" },
  processing: { label: "Đang thực hiện", className: "bg-blue-500/10 text-blue-600" },
  completed: { label: "Hoàn thành", className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Đã hủy", className: "bg-red-500/10 text-red-600" },
}
```
