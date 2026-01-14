# Business Requirement Document (BRD) - Taophim.com

## 1. Executive Summary

**Taophim.com** is a SaaS platform allowing Vietnamese users to request high-end AI video generation services (Face Swap, Image-to-Video, etc.).
**Strategy:** "Wizard of Oz" MVP.
**Core Concept:** Users submit inputs and pay with virtual credits ("Xu"). An Admin manually fulfills these requests using external tools and uploads the results back to the user.

## 2. User Roles & Permissions

### 2.1. Guest (Visitor)

* Can view the Landing Page and Service Catalog.
* Can view public demo videos/gallery.
* Cannot place orders.

### 2.2. Registered User (End-Customer)

* **Auth:** Sign up/Login via Email or Google (Supabase Auth).
* **Wallet:** Can view balance (Xu) and transaction history.
* **Orders:** Can create orders, view status, and download completed videos.
* **Profile:** Can update basic account info.

### 2.3. Admin (Operator)

* **Service Management:** Can create/edit services and define input requirements (form builder).
* **Order Fulfillment:** Can view "Pending" orders, download user assets, upload final video, and mark orders as "Completed" or "Cancelled".
* **User Management:** Can manually adjust user Xu balances (for support/refunds).

---

## 3. Core Functional Modules

### 3.1. The "Xu" Economy (Wallet System)

* **Currency:** "Xu" (Integer).
* **Top-up Logic:**
* *MVP:* Manual Top-up via QR. User transfers money -> Admin manually credits Xu to user account via Dashboard.


* **Transaction Logic (The "Freeze" Protocol):**
* The system must support a **"Hold/Freeze"** mechanism.
* When an order is placed, Xu is moved from `available_balance` to `frozen_balance`.
* It is **NOT** permanently deducted until the order is successful.



### 3.2. Dynamic Service Engine (The Menu)

* **Flexibility:** The Admin must be able to create new services without code changes.
* **Service Attributes:**
* `name` (e.g., "Ghép mặt Video").
* `price_type`: Fixed (per video) or Variable (per second).
* `price_amount`: The cost in Xu.
* `input_schema`: A JSON structure defining the form fields required.
* *Supported Field Types:* Text Input, File Upload (Image/Video), Dropdown, Toggle.




* **User View:** When a user selects a service, the UI renders the form dynamically based on the `input_schema`.

### 3.3. Order Processing Lifecycle (State Machine)

The order system follows a strict status flow:

1. **PENDING (Chờ xử lý):**
* User submits form.
* System validates validation.
* System moves cost from `available` to `frozen`.
* Order appears in Admin Dashboard.


2. **PROCESSING (Đang thực hiện):**
* Admin clicks "Start".
* User sees "Admin is working on your video".


3. **COMPLETED (Hoàn thành):**
* Admin uploads the result file.
* System permanently deducts the `frozen` Xu (Transaction Record created: "Expense").
* User is notified and can download.


4. **CANCELLED (Đã hủy):**
* Admin rejects order (e.g., "Image too blurry").
* System returns `frozen` Xu back to `available`.
* Admin must provide a `cancellation_reason`.



---

## 4. Data Requirements (Schema Constraints)

### 4.1. Tables (High-Level)

* **`profiles`**: Extends Supabase Auth.
* `id` (PK)
* `full_name`
* `avatar_url`
* `xu_balance` (Integer, default 0)
* `frozen_xu` (Integer, default 0 - used for active orders)


* **`services`**:
* `id` (PK)
* `slug` (Unique)
* `name` (Vietnamese)
* `description`
* `base_cost` (Integer)
* `is_active` (Boolean)
* `form_config` (JSONB - *Critical for dynamic inputs*)


* **`orders`**:
* `id` (PK)
* `user_id` (FK)
* `service_id` (FK)
* `status` (Enum: pending, processing, completed, cancelled)
* `total_cost` (Integer)
* `user_inputs` (JSONB - stores the text prompts/file paths user submitted)
* `admin_output` (JSONB - stores the result video URL)
* `admin_note` (Text - optional feedback)
* `created_at`, `updated_at`


* **`transactions`**:
* `id` (PK)
* `user_id` (FK)
* `amount` (Integer, positive for deposit, negative for spend)
* `type` (Enum: deposit, expense, refund)
* `order_id` (Nullable FK)



### 4.2. Storage (Supabase Storage)

* **Bucket: `order-assets**`
* Folder structure: `/{user_id}/{order_id}/input/` (User uploads)
* Folder structure: `/{user_id}/{order_id}/output/` (Admin uploads)


* **Security:** Only the specific User and Admin can access these folders.

---

## 5. Non-Functional Requirements

### 5.1. Localization

* **Hard Constraint:** All User Interface text MUST be in **Vietnamese**.
* **Date Formats:** DD/MM/YYYY (Vietnamese standard).
* **Currency Display:** Display numbers with dot separators (e.g., "1.000 Xu", not "1,000").

### 5.2. Performance & UX

* **Optimistic UI:** When a user submits an order, immediately show the "Pending" state without waiting for a full page reload.
* **Real-time:** Use Supabase Realtime (optional but recommended) so the User's dashboard updates automatically when Admin changes status to "Completed".

### 5.3. Security

* **Row Level Security (RLS):**
* Users can only see their own Orders and Transactions.
* Admins can see all Orders and Transactions.
* Services are public (readable by all).



---

## 6. Implementation Phases (For AI Coding Context)

* **Phase 1 (Foundation):** Setup Next.js, Supabase Auth, RLS, and basic Layout (Shell).
* **Phase 2 (The Economy):** Create Profile table, Wallet display, and Transaction history.
* **Phase 3 (Service Engine):** Create `services` table and the Dynamic Form renderer component.
* **Phase 4 (Order Loop):** Implement the Submit -> Freeze Xu -> Admin Dashboard -> Upload Result -> Complete flow.
* **Phase 5 (Polish):** UI clean up, Vietnamese copy check, and landing page.

---

### 7. Example Scenarios (Logic Tests)

**Scenario A: Successful Face Swap**

1. User has 100 Xu. Service costs 20 Xu.
2. User submits. `profiles.xu_balance` becomes 80. `profiles.frozen_xu` becomes 20.
3. Admin completes. `frozen_xu` becomes 0. `transactions` logs -20 Xu.

**Scenario B: Rejected Order**

1. User has 100 Xu. Service costs 20 Xu.
2. User submits. `xu_balance`: 80, `frozen_xu`: 20.
3. Admin cancels. `frozen_xu` becomes 0. `xu_balance` becomes 100. (No transaction record needed, or record a "0" cost event).

---