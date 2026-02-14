-- Step 3 of 3: Drop old unique index after verifying code works with new constraint
-- Only run this AFTER deploying code that uses ON CONFLICT(user_id, date, source)
DROP INDEX IF EXISTS idx_daily_usage_user_date;
