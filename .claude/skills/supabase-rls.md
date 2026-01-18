# /supabase-rls

Create Row Level Security (RLS) policies for Supabase tables.

## Usage

```
/supabase-rls [table-name] [policy-type]
```

Example: `/supabase-rls orders user-crud`

## Instructions

### Common RLS Patterns

#### User Can CRUD Own Data
```sql
-- Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY "Users can view own data"
  ON public.table_name FOR SELECT
  USING (auth.uid() = user_id);

-- Insert policy
CREATE POLICY "Users can create own data"
  ON public.table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update policy
CREATE POLICY "Users can update own data"
  ON public.table_name FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete policy
CREATE POLICY "Users can delete own data"
  ON public.table_name FOR DELETE
  USING (auth.uid() = user_id);
```

#### Public Read, Auth Write
```sql
CREATE POLICY "Anyone can read"
  ON public.table_name FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON public.table_name FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

#### Admin Only Access
```sql
-- Requires is_admin column on profiles or a separate admin check
CREATE POLICY "Admins can do anything"
  ON public.table_name FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

#### Service Role Bypass (for server operations)
```sql
-- Service role always bypasses RLS by default
-- No policy needed, use service role key for admin operations
```

#### Soft Delete Filter
```sql
CREATE POLICY "Users can view non-deleted own data"
  ON public.table_name FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);
```

### Existing Table Policies

#### profiles
- Users can view and update their own profile
- Profiles auto-created via trigger on auth.users insert

#### orders
- Users can view their own orders
- Users can create orders (with Xu check)
- Only admins can update order status

#### services
- Anyone can view active services
- Only admins can create/update/delete

### Debugging RLS
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- List policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### After Adding Policies
Run security advisor: `mcp__supabase__get_advisors` with type "security"
