-- Add duration_config column to services table
-- This column stores flexible duration selection modes for video generation services:
-- - 'fixed': Predefined choices (e.g., 3s, 5s, 10s)
-- - 'range': Free selection within min/max (e.g., 3-60 seconds)
-- - 'video_based': Auto-detect from uploaded video
-- - null: Legacy mode (current behavior, 1-300s free input)

ALTER TABLE services ADD COLUMN IF NOT EXISTS duration_config JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN services.duration_config IS 'JSONB config for duration selection mode. Modes: fixed (options array), range (min/max/step), video_based (source_field_id). Null = legacy free input.';
