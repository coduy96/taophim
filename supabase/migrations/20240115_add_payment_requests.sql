-- Create payment_requests table to track PayOS payments
create table if not exists payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  amount int not null,
  payos_order_code bigint not null unique,
  status text not null check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table payment_requests enable row level security;

create policy "Users can view their own payment requests"
  on payment_requests for select
  using (auth.uid() = user_id);

-- Function to safely increment xu balance
create or replace function increment_xu(p_user_id uuid, p_amount int)
returns void as $$
begin
  update profiles
  set xu_balance = xu_balance + p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;
