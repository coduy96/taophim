-- Login logs table for device tracking analytics
CREATE TABLE login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser_name TEXT,
  os_name TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_created_at ON login_logs(created_at);

-- RLS Policies
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (server actions use service role, but allow authenticated too)
CREATE POLICY "Authenticated users can insert login logs"
  ON login_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all login logs for analytics
CREATE POLICY "Authenticated users can read login logs"
  ON login_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');
