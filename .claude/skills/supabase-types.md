# /supabase-types

Regenerate TypeScript types from Supabase database schema.

## Usage

```
/supabase-types
```

## Instructions

### Generate Types Command
Run this command to regenerate types from your local Supabase instance:

```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

Or from remote project:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### When to Regenerate
- After creating/modifying database migrations
- After changing table schemas
- After adding/modifying enums
- After changing RLS policies that affect return types

### Type Usage Pattern
```typescript
import { Database } from '@/types/database.types'

// Table row type
type Order = Database['public']['Tables']['orders']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

// Insert type (for creating records)
type OrderInsert = Database['public']['Tables']['orders']['Insert']

// Update type (for updating records)
type OrderUpdate = Database['public']['Tables']['orders']['Update']

// Enum types
type OrderStatus = Database['public']['Enums']['order_status']
```

### With Supabase Client
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient() // Already typed with Database

// Queries are fully typed
const { data: orders } = await supabase
  .from('orders')
  .select('*, services(name)')
  .eq('status', 'pending')
```

### Current Schema Tables
- `profiles` - User profiles with `xu_balance`, `frozen_xu`
- `services` - Service definitions with `input_schema` (JSONB)
- `orders` - User orders with `user_inputs`, `admin_output` (JSONB)
- `transactions` - Xu transaction audit trail
- `payment_requests` - PayOS payment tracking

### Current Enums
- `order_status`: 'pending' | 'processing' | 'completed' | 'cancelled'
