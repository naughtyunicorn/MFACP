import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sql } from './db';

const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Types
export interface DBUser {
  id: string;
  email: string;
  display_name: string | null;
  password_hash: string | null;
  email_verified: boolean;
  is_locked: boolean;
  lock_reason: string | null;
  risk_tier: string;
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
  ip_address: string | null;
  user_agent: string | null;
  session_type: string;
  trust_level: string;
  is_active: boolean;
  requires_reauth: boolean;
  expires_at: Date;
  last_activity_at: Date;
  created_at: Date;
  updated_at: Date;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate random token
export function generateRandomToken(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Generate recovery codes
export function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = `${generateRandomToken(4)}-${generateRandomToken(4)}-${generateRandomToken(4)}`.toUpperCase();
    codes.push(code);
  }
  return codes;
}

// Create user session
export async function createSession(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ token: string; session: DBSession }> {
  const sessionToken = generateRandomToken(64);
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);
  
  const sessions = await sql`
    INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at, is_active, session_type, trust_level)
    VALUES (${userId}, ${sessionToken}, ${ipAddress || null}, ${userAgent || null}, ${expiresAt.toISOString()}, true, 'standard', 'verified')
    RETURNING *
  `;
  
  const session = sessions[0] as DBSession;
  
  return { token: sessionToken, session };
}

// Validate session from token
export async function validateSession(token: string): Promise<DBSession | null> {
  if (!token) return null;
  
  const sessions = await sql`
    SELECT * FROM sessions 
    WHERE token = ${token}
    AND is_active = true 
    AND expires_at > NOW()
  `;
  
  if (sessions.length === 0) return null;
  
  const session = sessions[0] as DBSession;
  
  // Update last activity
  await sql`
    UPDATE sessions SET last_activity_at = NOW(), updated_at = NOW() WHERE id = ${session.id}
  `;
  
  return session;
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  await sql`
    UPDATE sessions SET is_active = false, updated_at = NOW() WHERE token = ${token}
  `;
}

// Get current user from cookies
export async function getCurrentUser(): Promise<{ user: DBUser; session: DBSession } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  
  if (!sessionToken) return null;
  
  const session = await validateSession(sessionToken);
  if (!session) return null;
  
  const users = await sql`
    SELECT * FROM users WHERE id = ${session.user_id}
  `;
  
  if (users.length === 0) return null;
  
  return { user: users[0] as DBUser, session };
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Log security event
export async function logSecurityEvent(
  eventType: string,
  eventName: string,
  description: string,
  metadata: {
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    authenticatorId?: string;
    status?: string;
    failureReason?: string;
    riskScore?: number;
  } = {}
): Promise<void> {
  await sql`
    INSERT INTO security_events (
      user_id, event_type, event_name, description, ip_address, user_agent, 
      device_id, session_id, authenticator_id, status, failure_reason, risk_score
    )
    VALUES (
      ${metadata.userId || null}, 
      ${eventType}, 
      ${eventName}, 
      ${description}, 
      ${metadata.ipAddress || null}, 
      ${metadata.userAgent || null},
      ${metadata.deviceId || null},
      ${metadata.sessionId || null},
      ${metadata.authenticatorId || null},
      ${metadata.status || 'SUCCESS'},
      ${metadata.failureReason || null},
      ${metadata.riskScore || 0}
    )
  `;
}
