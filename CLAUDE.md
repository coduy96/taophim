# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Taophim.com** is an AI Video Generation SaaS for the Vietnamese market using a "Wizard of Oz" MVP approach. Users submit requests which Admins manually fulfill using external tools.

**Critical:** All user-facing text must be in Vietnamese. Use "Xu" for credits, "Đơn hàng" for orders.

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router) with React 19
- **Language:** TypeScript 5 (strict mode)
- **Database:** Supabase (PostgreSQL) with Supabase Auth
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix components)
- **Icons:** Hugeicons (@hugeicons/react)
- **Payments:** PayOS (@payos/node) for Vietnamese QR/VNPAY

## Commands

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint
npx tsc --noEmit    # Type checking

# Supabase
npx supabase gen types typescript --local  # Regenerate database types
```

**Note:** No testing framework is configured. Visual verification is required.

## Architecture

### Route Groups
- `src/app/(auth)/` - Login, register, OAuth callbacks
- `src/app/(dashboard)/` - Protected user routes (dashboard, orders, wallet, settings)
- `src/app/admin/` - Admin panel (no RLS protection yet)
- `src/app/api/` - API routes (PayOS payment links)

### Key Directories
- `src/components/ui/` - shadcn/ui atomic components (32+ files)
- `src/components/admin/` - Admin-specific components
- `src/components/landing/` - Landing page components
- `src/lib/supabase/` - Supabase client configurations (client.ts, server.ts, middleware.ts)
- `src/types/database.types.ts` - Auto-generated Supabase types

### Supabase Client Usage
- **Server Components:** Use `createClient()` from `@/lib/supabase/server`
- **Client Components:** Use `createClient()` from `@/lib/supabase/client`
- **Middleware:** `src/middleware.ts` handles session refresh

## Business Logic: The "Xu" Economy

### Order Lifecycle (State Machine)
1. **PENDING:** User submits → Xu frozen (`xu_balance - cost`, `frozen_xu + cost`)
2. **PROCESSING:** Admin clicks "Start"
3. **COMPLETED:** Admin uploads result → `frozen_xu` deducted permanently
4. **CANCELLED:** Admin rejects → Xu refunded to `xu_balance`

### Core Tables
- `profiles` - User data with `xu_balance` and `frozen_xu`
- `services` - Dynamic services with `input_schema` (JSONB) for form fields
- `orders` - User requests with `user_inputs` and `admin_output` (JSONB)
- `transactions` - Audit trail for deposits, expenses, refunds
- `payment_requests` - PayOS integration tracking

### Soft Deletion
Services use `deleted_at` for soft deletion. Always filter out soft-deleted items in queries.

## Code Conventions

### UI Components
- **Always** use shadcn/ui components from `@/components/ui/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `"use client"` directive only when necessary

### File Naming
- Components: `kebab-case.tsx`
- Export syntax: `export function ComponentName() { ... }`

### Imports
```typescript
// 1. External packages
// 2. Absolute imports (@/...)
// 3. Relative imports (./...)
```

### Localization
- All UI text in Vietnamese
- Date format: DD/MM/YYYY
- Currency: "1.000 Xu" (dot separator)
- Code/comments in English

## Key Reference Files

- `AGENTS.md` - Detailed agent guidelines and conventions
- `BUSINESS_REQUIREMENT.MD` - Complete BRD with entity definitions
- `src/types/database.types.ts` - Database schema types
- `src/components/service-order-form.tsx` - Dynamic form builder example
- `src/app/(auth)/actions.ts` - Server actions pattern

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYOS_CLIENT_ID=
PAYOS_API_KEY=
PAYOS_CHECKSUM_KEY=
```
