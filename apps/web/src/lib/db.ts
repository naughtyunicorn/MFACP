import { neon } from '@neondatabase/serverless';

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!);

// Helper types for database queries
export type QueryResult<T> = T[];

// User type from database
export interface DBUser {
  id: string;
  email: string;
  display_name: string | null;
  password_hash: string | null;
  is_locked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBSession {
  id: string;
  user_id: string;
  token: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DBDevice {
  id: string;
  user_id: string;
  user_agent: string | null;
  ip_address: string | null;
  device_type: string;
  is_active: boolean;
  last_seen_at: Date;
  nickname: string | null;
  created_at: Date;
}

export interface DBAuthenticator {
  id: string;
  user_id: string;
  type: string;
  name: string;
  secret: string | null;
  is_active: boolean;
  last_used_at: Date | null;
  created_at: Date;
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
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

// Log security event helper function
export async function logSecurityEvent(
  userId: string,
  eventType: string,
  ipAddress: string,
  userAgent: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await sql`
    INSERT INTO security_events (user_id, event_type, ip_address, user_agent, metadata)
    VALUES (${userId}, ${eventType}, ${ipAddress}, ${userAgent}, ${JSON.stringify(metadata)})
  `;
}
