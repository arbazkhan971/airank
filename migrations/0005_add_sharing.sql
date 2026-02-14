-- Add sharing opt-in columns for social stats cards
ALTER TABLE users ADD COLUMN sharing_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN share_slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_share_slug ON users(share_slug) WHERE share_slug IS NOT NULL;
