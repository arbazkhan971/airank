-- Add optional expiry to API tokens (NULL = never expires, for backward compat)
ALTER TABLE api_tokens ADD COLUMN expires_at TEXT;
