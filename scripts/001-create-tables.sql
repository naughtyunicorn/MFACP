-- MFA Card Platform Database Schema
-- Creates all tables for the authentication platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
DO $$ BEGIN
    CREATE TYPE risk_tier AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_type AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE authenticator_type AS ENUM ('WEBAUTHN', 'SMART_CARD', 'TOTP', 'RECOVERY_CODE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_type AS ENUM ('FULL', 'RECOVERY', 'STEP_UP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trust_level AS ENUM ('FULL', 'REDUCED', 'ELEVATED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recovery_reason AS ENUM ('LOST_DEVICE', 'LOST_PHONE', 'LOST_CARD', 'FORGOT_PASSWORD', 'COMPROMISED_ACCOUNT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recovery_status AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE security_event_type AS ENUM (
        'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'PASSWORD_CHANGE',
        'AUTHENTICATOR_ADDED', 'AUTHENTICATOR_REMOVED', 'AUTHENTICATOR_USED',
        'RECOVERY_CODE_GENERATED', 'RECOVERY_CODE_USED', 'RECOVERY_REQUESTED',
        'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'SUSPICIOUS_ACTIVITY',
        'SECURITY_SETTING_CHANGED', 'DEVICE_REVOKED', 'SESSION_INVALIDATED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('SUCCESS', 'FAILURE', 'WARNING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    password_hash TEXT,
    risk_tier risk_tier DEFAULT 'LOW',
    is_locked BOOLEAN DEFAULT false,
    locked_at TIMESTAMP,
    lock_reason TEXT,
    require_reauth BOOLEAN DEFAULT true,
    last_password_change TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address TEXT,
    device_id TEXT NOT NULL,
    device_type device_type DEFAULT 'UNKNOWN',
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMP DEFAULT NOW(),
    trusted_at TIMESTAMP,
    nickname TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);

-- Authenticators table
CREATE TABLE IF NOT EXISTS authenticators (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type authenticator_type NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_backup BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- WebAuthn credentials table
CREATE TABLE IF NOT EXISTS webauthn_credentials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    authenticator_id TEXT UNIQUE NOT NULL,
    credential_id TEXT NOT NULL,
    credential_type TEXT DEFAULT 'public-key',
    transports TEXT[],
    aaguid TEXT,
    attestation_type TEXT,
    attestation_fmt TEXT,
    public_key TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_backup BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, credential_id)
);

-- Smart cards table
CREATE TABLE IF NOT EXISTS smart_cards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id TEXT UNIQUE NOT NULL,
    card_aid TEXT NOT NULL,
    public_key TEXT NOT NULL,
    card_version TEXT,
    manufacturer TEXT,
    serial_number TEXT,
    is_active BOOLEAN DEFAULT true,
    is_backup BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP,
    usage_counter INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TOTP secrets table
CREATE TABLE IF NOT EXISTS totp_secrets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    algorithm TEXT DEFAULT 'SHA1',
    digits INT DEFAULT 6,
    period INT DEFAULT 30,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_backup BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP,
    verification_counter INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recovery code batches table
CREATE TABLE IF NOT EXISTS recovery_code_batches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    batch_name TEXT,
    codes_generated INT DEFAULT 0,
    codes_remaining INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recovery codes table
CREATE TABLE IF NOT EXISTS recovery_codes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    batch_id TEXT NOT NULL REFERENCES recovery_code_batches(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    used_by_device_id TEXT,
    used_by_ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recovery requests table
CREATE TABLE IF NOT EXISTS recovery_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    reason recovery_reason NOT NULL,
    contact_email TEXT NOT NULL,
    additional_info TEXT,
    status recovery_status DEFAULT 'PENDING',
    approved_at TIMESTAMP,
    denied_at TIMESTAMP,
    denied_reason TEXT,
    processed_by TEXT,
    processing_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT REFERENCES devices(id),
    token TEXT UNIQUE NOT NULL,
    session_type session_type DEFAULT 'FULL',
    trust_level trust_level DEFAULT 'FULL',
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    requires_reauth BOOLEAN DEFAULT false,
    last_activity_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Security events table
CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT,
    event_type security_event_type NOT NULL,
    event_name TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    device_id TEXT,
    authenticator_id TEXT,
    risk_score INT DEFAULT 0,
    risk_factors TEXT[],
    status event_status DEFAULT 'SUCCESS',
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_authenticators_user_id ON authenticators(user_id);
CREATE INDEX IF NOT EXISTS idx_webauthn_user_id ON webauthn_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_cards_user_id ON smart_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_totp_user_id ON totp_secrets(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_batches_user_id ON recovery_code_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_codes_batch_id ON recovery_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_recovery_requests_user_id ON recovery_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;
