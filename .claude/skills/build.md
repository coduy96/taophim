# /build

Run the build and fix any TypeScript or build errors.

## Usage

```
/build
```

## Instructions

### Build Commands
```bash
# Type checking only (faster)
npx tsc --noEmit

# Full production build
npm run build

# Lint check
npm run lint
```

### Workflow

1. Run `npx tsc --noEmit` first to catch type errors
2. If type errors found:
   - Read each error carefully
   - Fix errors one by one
   - Re-run type check after each fix
3. Run `npm run build` for full production build
4. Fix any remaining build errors

### Common Error Fixes

#### Missing Types
```typescript
// Add explicit types
const data: Order[] = response.data ?? []

// Handle null/undefined
const value = data?.field ?? 'default'
```

#### Import Errors
```typescript
// Check import paths
import { Component } from "@/components/component" // not ./components

// Verify exports
export function Component() { } // named export
```

#### Type Mismatches
```typescript
// Use type assertions carefully
const status = data.status as OrderStatus

// Or narrow the type
if (data.status === 'pending') { }
```

#### Async Server Components
```typescript
// Server components can be async
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### After Build Success
- Verify the app works visually (no test framework configured)
- Check browser console for runtime errors
