-- Add missing columns for the frontend

-- Add display_name to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add secret column to authenticators for TOTP
ALTER TABLE authenticators ADD COLUMN IF NOT EXISTS secret TEXT;

-- Create a simpler recovery_codes table that maps directly to users
-- This is in addition to the batch-based recovery codes
CREATE TABLE IF NOT EXISTS simple_recovery_codes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simple_recovery_codes_user_id ON simple_recovery_codes(user_id);

-- Rename for easier API access (if doesn't exist already)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recovery_codes_simple'
    ) THEN
        -- Create view alias
        CREATE OR REPLACE VIEW recovery_codes_v AS 
        SELECT id, user_id, code, used_at, created_at FROM simple_recovery_codes;
    END IF;
END $$;
