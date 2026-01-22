-- FAL.ai Job Tracking Table
-- Used to map FAL request IDs to orders for webhook processing

CREATE TABLE fal_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  fal_request_id TEXT NOT NULL UNIQUE,
  model_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for fast lookup by fal_request_id (used by webhook)
CREATE INDEX idx_fal_jobs_request_id ON fal_jobs(fal_request_id);

-- Index for looking up jobs by order
CREATE INDEX idx_fal_jobs_order_id ON fal_jobs(order_id);

-- RLS Policies
ALTER TABLE fal_jobs ENABLE ROW LEVEL SECURITY;

-- Users can view their own fal jobs (through order ownership)
CREATE POLICY "Users can view their own fal jobs"
  ON fal_jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = fal_jobs.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Service role can do everything (for webhook processing)
CREATE POLICY "Service role can manage fal jobs"
  ON fal_jobs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
