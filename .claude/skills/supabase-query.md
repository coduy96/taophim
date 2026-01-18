# /supabase-query

Help write Supabase queries with proper TypeScript types.

## Usage

```
/supabase-query [describe what you need]
```

Example: `/supabase-query fetch orders with service name for current user`

## Instructions

### Basic Query Patterns

#### Select All
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*')
```

#### Select with Columns
```typescript
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, xu_balance')
```

#### Select with Relations
```typescript
// Foreign key relation (orders -> services)
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    services (id, name, slug)
  `)

// Access: order.services.name
```

#### Filter (WHERE)
```typescript
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId)          // =
  .eq('status', 'pending')        // AND
  .neq('status', 'cancelled')     // !=
  .gt('total_cost', 100)          // >
  .gte('total_cost', 100)         // >=
  .lt('total_cost', 1000)         // <
  .lte('total_cost', 1000)        // <=
  .in('status', ['pending', 'processing'])  // IN
  .is('deleted_at', null)         // IS NULL
  .not('status', 'eq', 'cancelled')  // NOT
```

#### Order & Limit
```typescript
const { data } = await supabase
  .from('orders')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

#### Single Row
```typescript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()  // Returns object, not array
```

#### Count Only
```typescript
const { count } = await supabase
  .from('orders')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
```

### Insert
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    service_id: serviceId,
    total_cost: 100,
    user_inputs: { field: 'value' }
  })
  .select()
  .single()
```

### Update
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ xu_balance: newBalance })
  .eq('id', userId)
  .select()
  .single()
```

### Upsert
```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({ id: userId, full_name: 'New Name' })
  .select()
```

### Delete
```typescript
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', recordId)
```

### Soft Delete Pattern
```typescript
// "Delete" by setting deleted_at
const { error } = await supabase
  .from('services')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', serviceId)

// Query excludes soft-deleted
const { data } = await supabase
  .from('services')
  .select('*')
  .is('deleted_at', null)
```

### Auth Queries
```typescript
// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Get session
const { data: { session } } = await supabase.auth.getSession()
```

### Error Handling
```typescript
const { data, error } = await supabase.from('table').select('*')

if (error) {
  console.error('Query error:', error.message)
  return { error: 'Có lỗi xảy ra' }
}

if (!data || data.length === 0) {
  return { error: 'Không tìm thấy dữ liệu' }
}
```
