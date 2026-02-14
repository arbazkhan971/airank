-- Step 1 of 3: Add source column for multi-machine tracking
-- Old unique index (user_id, date) is kept alive during transition
ALTER TABLE daily_usage ADD COLUMN source TEXT NOT NULL DEFAULT 'default';

-- New unique constraint: one entry per user per date per source
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_usage_user_date_source ON daily_usage(user_id, date, source);
