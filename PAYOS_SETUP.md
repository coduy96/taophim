# PayOS Integration Setup

## 1. Database Setup
Run the following SQL in your Supabase SQL Editor to create the necessary tables and functions:

```sql
-- Create payment_requests table
create table if not exists payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  amount int not null,
  payos_order_code bigint not null unique,
  status text not null check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table payment_requests enable row level security;
create policy "Users can view their own payment requests" on payment_requests for select using (auth.uid() = user_id);

-- Helper function for atomic balance update
create or replace function increment_xu(p_user_id uuid, p_amount int)
returns void as $$
begin
  update profiles
  set xu_balance = xu_balance + p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;
```

(This script is also available at `supabase/migrations/20240115_add_payment_requests.sql`)

## 2. Environment Variables & Secrets

### Local Development (.env.local)
Add these for the Next.js app (used for creating payment links):
```env
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key
```

### Supabase Edge Function Secrets
You must set these secrets for the `payos-webhook` function to work. Run these commands in your terminal (using Supabase CLI) or set them in the Supabase Dashboard > Edge Functions > payos-webhook > Secrets.

```bash
supabase secrets set PAYOS_CLIENT_ID=your_client_id
supabase secrets set PAYOS_API_KEY=your_api_key
supabase secrets set PAYOS_CHECKSUM_KEY=your_checksum_key
supabase secrets set SUPABASE_URL=your_project_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Webhook Configuration
1. Go to [PayOS Dashboard](https://my.payos.vn/).
2. Set the **Webhook URL** to your Supabase Edge Function URL:
   `https://qzshnmpjubqpaqdcisky.supabase.co/functions/v1/payos-webhook`
3. Verify the Webhook connection.

## 4. Testing
1. Go to `/dashboard/wallet`.
2. Enter an amount (e.g., 2000 or 10000).
3. Click "Nạp ngay".
4. The PayOS payment form should appear.
5. Complete payment (or use test card if in sandbox).
6. Verify your "Xu" balance increases.
