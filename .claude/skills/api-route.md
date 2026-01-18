# /api-route

Create a new Next.js API Route following project conventions.

## Usage

```
/api-route [route-path] [description]
```

Example: `/api-route webhooks/payos PayOS webhook handler`

## Instructions

### File Location
- Place in `src/app/api/[route]/route.ts`
- Example: `src/app/api/webhooks/payos/route.ts`

### API Route Template
```typescript
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Auth check (if needed)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { field1, field2 } = body

    // Validate input
    if (!field1) {
      return NextResponse.json({ error: "Missing required field" }, { status: 400 })
    }

    // Database operation
    const { data, error } = await supabase
      .from('table')
      .insert({ field1, field2 })
      .select()
      .single()

    if (error) {
      console.error("DB Error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error: unknown) {
    console.error("API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Similar pattern for GET requests
  const { searchParams } = new URL(request.url)
  const param = searchParams.get('param')

  // ... logic

  return NextResponse.json({ data })
}
```

### With Route Params
```typescript
// src/app/api/orders/[id]/route.ts

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // ... fetch order by id
}
```

### Webhook Handler (no auth)
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Verify webhook signature
    // ... verification logic

    // Process webhook
    // ... processing logic

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
```

### Conventions
- Use NextResponse.json() for all responses
- Always wrap in try-catch
- Return appropriate HTTP status codes
- Log errors with console.error for debugging
- API responses in English (internal), UI text in Vietnamese
