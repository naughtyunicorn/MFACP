import { neon } from '@neondatabase/serverless';

// Create a reusable SQL client
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Helper types for database queries
export type QueryResult<T> = T[];

// User type from database
export interface DBUser {
  id: string;
  email: string;
  email_verified: boolean;
  password_hash: string | null;
  risk_tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_locked: boolean;
  locked_at: Date | null;
  lock_reason: string | null;
  require_reauth: boolean;
  last_password_change: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBSession {
  id: string;
  user_id: string;
  device_id: string | null;
  token: string;
  session_type: 'FULL' | 'RECOVERY' | 'STEP_UP';
  trust_level: 'FULL' | 'REDUCED' | 'ELEVATED';
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  expires_at: Date;
  requires_reauth: boolean;
  last_activity_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DBDevice {
  id: string;
  user_id: string;
  user_agent: string | null;
  ip_address: string | null;
  device_id: string;
  device_type: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'UNKNOWN';
  is_active: boolean;
  last_seen_at: Date;
  trusted_at: Date | null;
  nickname: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBAuthenticator {
  id: string;
  user_id: string;
  type: 'WEBAUTHN' | 'SMART_CARD' | 'TOTP' | 'RECOVERY_CODE';
  name: string;
  is_active: boolean;
  is_backup: boolean;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBWebAuthnCredential {
  id: string;
  user_id: string;
  authenticator_id: string;
  credential_id: string;
  credential_type: string;
  transports: string[];
  aaguid: string | null;
  attestation_type: string | null;
  attestation_fmt: string | null;
  public_key: string;
  name: string;
  is_active: boolean;
  is_backup: boolean;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBSecurityEvent {
  id: string;
  user_id: string | null;
  session_id: string | null;
  event_type: string;
  event_name: string;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  device_id: string | null;
  authenticator_id: string | null;
  risk_score: number;
  risk_factors: string[];
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  failure_reason: string | null;
  created_at: Date;
}

export interface DBRecoveryCodeBatch {
  id: string;
  user_id: string;
  batch_name: string | null;
  codes_generated: number;
  codes_remaining: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBRecoveryCode {
  id: string;
  batch_id: string;
  code_hash: string;
  is_used: boolean;
  used_at: Date | null;
  used_by_device_id: string | null;
  used_by_ip_address: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBTotpSecret {
  id: string;
  user_id: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  name: string;
  is_active: boolean;
  is_backup: boolean;
  last_used_at: Date | null;
  verification_counter: number;
  created_at: Date;
  updated_at: Date;
}
