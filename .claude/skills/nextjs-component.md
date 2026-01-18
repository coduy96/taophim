# /nextjs-component

Create a new React component following project conventions.

## Usage

```
/nextjs-component [component-name] [description]
```

Example: `/nextjs-component user-avatar User avatar with fallback`

## Instructions

### File Naming & Location
- Use kebab-case for filenames: `user-avatar.tsx`
- Place in appropriate directory:
  - `src/components/ui/` - Reusable atomic components (shadcn-style)
  - `src/components/admin/` - Admin-specific components
  - `src/components/landing/` - Landing page components
  - `src/components/` - Shared feature components
  - `src/app/**/` - Route-specific components (co-located)

### Component Template (Server Component)
```typescript
import { cn } from "@/lib/utils"
// Import other dependencies

interface ComponentNameProps {
  className?: string
  // other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  )
}
```

### Client Component Template
```typescript
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ComponentNameProps {
  className?: string
}

export function ComponentName({ className }: ComponentNameProps) {
  const [state, setState] = useState()

  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  )
}
```

### Conventions
- Export syntax: `export function ComponentName() { ... }` (named export)
- Use `"use client"` directive only when necessary (state, effects, event handlers)
- Use `cn()` from `@/lib/utils` for class merging
- Use shadcn/ui components from `@/components/ui/`
- Icons: Import from `@hugeicons/core-free-icons`, wrap with `<HugeiconsIcon icon={IconName} />`
- All UI text in Vietnamese
- Avoid creating new files unless necessary - prefer editing existing ones
