# /supabase-migration

Create a new Supabase database migration.

## Usage

```
/supabase-migration [migration-name] [description]
```

Example: `/supabase-migration add-referral-system Add referral codes and tracking`

## Instructions

### Using MCP Tool (Recommended)
Use the Supabase MCP `apply_migration` tool to apply migrations directly:

```
mcp__supabase__apply_migration
  project_id: "your-project-id"
  name: "migration_name_in_snake_case"
  query: "SQL statements here"
```

### Migration SQL Patterns

#### Create Table
```sql
CREATE TABLE public.table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON public.table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON public.table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_table_name_updated_at
  BEFORE UPDATE ON public.table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Add Column
```sql
ALTER TABLE public.table_name
ADD COLUMN new_column TEXT DEFAULT 'value';
```

#### Create Enum
```sql
CREATE TYPE public.status_type AS ENUM ('active', 'inactive', 'pending');
```

#### Add to Existing Enum
```sql
ALTER TYPE public.order_status ADD VALUE 'refunded';
```

#### Create Index
```sql
CREATE INDEX idx_orders_user_status
ON public.orders(user_id, status);
```

#### Soft Delete Pattern
```sql
ALTER TABLE public.table_name
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Update queries to filter: WHERE deleted_at IS NULL
```

### Conventions
- Use snake_case for table and column names
- Always enable RLS on new tables
- Include created_at and updated_at timestamps
- Use UUID for primary keys
- Reference auth.users(id) for user foreign keys
- Add appropriate indexes for query patterns
- Consider soft delete for important data

### After Migration
Regenerate types with `/supabase-types`
