# /server-action

Create a new Next.js Server Action following project conventions.

## Usage

```
/server-action [action-name] [description]
```

Example: `/server-action create-order Create a new order with Xu deduction`

## Instructions

### File Location
- Place in `actions.ts` file within the relevant route directory
- Example: `src/app/(dashboard)/dashboard/orders/actions.ts`

### Server Action Template
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function actionName(formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Vui lòng đăng nhập' }
  }

  // Extract and validate form data
  const field = formData.get('field') as string
  if (!field) {
    return { error: 'Thiếu thông tin bắt buộc' }
  }

  // Database operation
  const { data, error } = await supabase
    .from('table')
    .insert({ field })
    .select()
    .single()

  if (error) {
    console.error('Action error:', error)
    return { error: 'Có lỗi xảy ra, vui lòng thử lại' }
  }

  // Revalidate and optionally redirect
  revalidatePath('/path')
  redirect('/success-page')

  // Or return success
  return { success: true, data }
}
```

### With Object Input (alternative pattern)
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

interface ActionInput {
  field1: string
  field2: number
}

export async function actionName(input: ActionInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ... action logic

  return { success: true }
}
```

### Conventions
- Always start with `'use server'` directive
- Always check authentication
- Return `{ error: string }` for errors (Vietnamese messages)
- Return `{ success: true, data? }` for success
- Use `revalidatePath()` to refresh cached data
- Use `redirect()` for navigation after mutations
- Handle Xu economy: freeze Xu on order creation, refund on cancellation
