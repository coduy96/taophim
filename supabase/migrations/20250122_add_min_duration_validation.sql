-- Add min_duration column to services table for video duration validation
-- This allows admins to set a minimum video duration for each service

ALTER TABLE services
ADD COLUMN IF NOT EXISTS min_duration integer DEFAULT NULL;

-- Add a comment to explain the column
COMMENT ON COLUMN services.min_duration IS 'Minimum video duration in seconds. NULL means no minimum validation (defaults to 1 second).';
