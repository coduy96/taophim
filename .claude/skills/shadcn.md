# /shadcn

Add or customize shadcn/ui components.

## Usage

```
/shadcn add [component-name]
/shadcn customize [component-name] [customization]
```

Examples:
- `/shadcn add accordion`
- `/shadcn customize button add loading state`

## Instructions

### Adding New Components

1. Check available components in the shadcn/ui registry
2. Add via CLI (if available):
   ```bash
   npx shadcn@latest add [component-name]
   ```
3. Components are installed to `src/components/ui/`

### Existing Components (32+)
Located in `src/components/ui/`:
- Layout: `card`, `separator`, `scroll-area`, `sidebar`, `sheet`
- Forms: `button`, `input`, `textarea`, `label`, `checkbox`, `switch`, `select`, `combobox`, `field`, `input-group`
- Feedback: `alert-dialog`, `dialog`, `tooltip`, `popover`, `sonner` (toast)
- Data: `table`, `tabs`, `pagination`, `badge`, `avatar`, `skeleton`, `progress`, `spinner`
- Navigation: `breadcrumb`, `dropdown-menu`

### Component Usage Pattern
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Use cn() for conditional classes
<Button className={cn("base-class", isActive && "active-class")} />

// Card with size variant
<Card size="sm" className="hover:border-primary/20">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Button Variants
```typescript
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>

// As link
<Button asChild>
  <Link href="/path">Navigate</Link>
</Button>
```

### Creating Custom Variants
Use class-variance-authority (cva) pattern:
```typescript
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      custom: "custom-classes",
    },
    size: {
      sm: "small-classes",
      lg: "large-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
})
```

### Icons with Components
```typescript
import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet01Icon } from "@hugeicons/core-free-icons"

<Button>
  <HugeiconsIcon icon={Wallet01Icon} className="mr-2 h-4 w-4" />
  Nạp Xu
</Button>
```
