import { neon } from '@neondatabase/serverless';

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!);

// Helper types for database queries
export type QueryResult<T> = T[];

// Re-export types from auth for convenience
export type { DBUser, DBSession } from './auth';

export interface DBDevice {
  id: string;
  user_id: string;
  device_id: string;
  user_agent: string | null;
  ip_address: string | null;
  device_type: string;
  nickname: string | null;
  is_active: boolean;
  trusted_at: Date | null;
  last_seen_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DBAuthenticator {
  id: string;
  user_id: string;
  type: string;
  name: string;
  secret: string | null;
  is_active: boolean;
  is_backup: boolean;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBRecoveryCode {
  id: string;
  user_id: string;
  code: string;
  used_at: Date | null;
  created_at: Date;
}

export interface DBSecurityEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_name: string;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_id: string | null;
  session_id: string | null;
  authenticator_id: string | null;
  status: string;
  failure_reason: string | null;
  risk_score: number;
  risk_factors: string[] | null;
  created_at: Date;
}

export interface DBWebAuthnCredential {
  id: string;
  user_id: string;
  authenticator_id: string | null;
  credential_id: string;
  credential_type: string;
  public_key: string;
  name: string;
  transports: string[] | null;
  aaguid: string | null;
  attestation_type: string | null;
  attestation_fmt: string | null;
  is_active: boolean;
  is_backup: boolean;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DBTotpSecret {
  id: string;
  user_id: string;
  secret: string;
  name: string;
  algorithm: string;
  digits: number;
  period: number;
  is_active: boolean;
  is_backup: boolean;
  verification_counter: number;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
