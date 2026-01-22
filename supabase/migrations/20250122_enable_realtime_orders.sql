-- Enable real-time for orders table
-- This allows clients to subscribe to order changes

-- Add orders table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Ensure REPLICA IDENTITY is set for proper real-time updates
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Also enable real-time for notifications table
-- This allows instant notification updates without polling
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Note: The existing notification INSERT policy uses auth.role() = 'service_role'
-- Service role key bypasses RLS entirely, so notifications should be inserting correctly
-- If notifications aren't showing, check:
-- 1. SUPABASE_SERVICE_ROLE_KEY environment variable is set correctly
-- 2. The webhook is successfully reaching the createOrderCompletedNotification function
-- 3. Check server logs for any insert errors
