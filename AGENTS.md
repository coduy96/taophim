# Agent Guidelines for taophim

This document provides instructions and context for AI agents operating in this repository.

## 1. Project Overview
- **Product:** Taophim.com - An AI Video Generation SaaS for the Vietnamese market.
- **Core Mechanism:** "Wizard of Oz" MVP. Users submit requests (Face Swap, Image-to-Video) which are fulfilled **manually** by an Admin, not via direct API automation.
- **Target Market:** Vietnam 🇻🇳. **All user-facing content, UI text, labels, and messages must be in Vietnamese.**
- **Framework:** Next.js 16.1.1 (App Router) with React 19.
- **Language:** TypeScript 5.
- **Styling:** Tailwind CSS 4, shadcn/ui (Radix Vega style).
- **State/Data:** Supabase Client (`@supabase/supabase-js`).

## 2. Business Domain & Application Logic (CRITICAL)

### Core Entities
1.  **Services (Dịch vụ):**
    - Dynamic services defined by the Admin (e.g., "Face Swap", "Text to Video").
    - **Schema:** Includes `name`, `base_cost` (in Xu), `cover_image`, and a JSON-based `input_schema` that defines what the user must provide (file uploads, text prompts, toggles).
2.  **Orders (Đơn hàng):**
    - Represents a user's request for a Service.
    - **Lifecycle Statuses:**
        - `PENDING` (Chờ xử lý): User submitted, Xu is frozen.
        - `PROCESSING` (Đang thực hiện): Admin has started working.
        - `COMPLETED` (Hoàn thành): Admin uploaded result, Xu is deducted.
        - `CANCELLED` (Đã hủy): Admin rejected (bad input), Xu is refunded.
3.  **Wallet & "Xu" System:**
    - **Currency:** "Xu" (virtual credits).
    - **Transactions:** Must support "Freezing" (Tạm giữ) logic. When an order is placed, Xu is *not* immediately deleted but moved to a "Locked" state until the order is `COMPLETED`.

### Operational Workflows
- **User Flow:**
    1. Select Service -> View dynamic form based on `input_schema`.
    2. Upload Files/Fill Text -> Submit.
    3. System validates balance -> Locks Xu -> Creates Order.
    4. User waits for notification (Order status change).
    5. User downloads final video from Order History.
- **Admin Flow (The "Human API"):**
    1. View `PENDING` orders -> Click "Start" (Status -> `PROCESSING`).
    2. Download User's source assets.
    3. Generate video externally (e.g., using Runway/Pika/Kling).
    4. Upload Result Video to the Order -> Mark `COMPLETED`.
    5. *Alternative:* If input is bad, Mark `CANCELLED` (Xu auto-refunds).

## 3. Build & lint Commands
Run these commands from the project root.

- **Development Server:** `npm run dev`
- **Production Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type Check:** `npx tsc --noEmit`
- **Testing:** *No testing framework is currently configured.*

## 4. Code Style & Conventions

### General
- **Formatting:** Use Prettier defaults. 2 spaces for indentation.
- **Semicolons:** Omit semicolons where possible.
- **Localization:** - All UI text (buttons, headers, error messages, placeholders) **MUST** be in Vietnamese.
  - Variable names and code comments should remain in English for maintainability.
  - **Terminology:** Always use "Xu" for credits, "Đơn hàng" for Orders.
- **Components:**
  - **MANDATORY:** Always use `shadcn/ui` components (`@/components/ui/...`) for UI elements.
  - Use `export function ComponentName() { ... }` syntax.
  - Place components in `src/components`. Reusable UI components go in `src/components/ui`.
  - Filenames should be `kebab-case.tsx`.
- **Directives:** Use `"use client"` at the top of files only when necessary.

### Imports
- Use the `@` alias for imports from `src`.
- **Order:**
  1. Standard library & external packages.
  2. Absolute imports (using `@/...`).
  3. Relative imports (`./...`).

### Styling (Tailwind + shadcn)
- **Consistency:** STRICTLY follow the existing design system config in `src/app/globals.css`.
- **Utility:** Use the `cn()` utility from `@/lib/utils` for conditional class merging.

### Types
- Use TypeScript interfaces or types for component props.
- Avoid `any`. Use strict typing.
- **Supabase Types:** Use generated types from Supabase CLI where possible to ensure database schema alignment.

### Error Handling
- Use `try/catch` blocks for async operations (Supabase calls).
- Display user-friendly error messages in Vietnamese via Toasts (`sonner` or `toast`).

## 5. Architecture & Structure
- `src/app/(auth)/`: Authentication related pages (login, register).
- `src/app/(dashboard)/`: Protected routes for User/Admin dashboard.
- `src/components/ui/`: Atomic design components.
- `src/lib/`: Utility functions and Supabase client.

## 6. Agent Behavior Rules
- **Safety First:** Do not commit secrets (API keys, etc.) to git.
- **Convention over Configuration:** Follow existing patterns.
- **Visual verification:** Since there are no tests, ask the user to visually verify critical flows (e.g., "Check if the Xu balance updates correctly after order submission").