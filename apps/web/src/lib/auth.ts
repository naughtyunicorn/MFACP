import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sql, DBUser, DBSession } from './db';
import { setSession, getSession, deleteSession } from './redis';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this');
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionPayload {
  userId: string;
  sessionId: string;
  email: string;
  trustLevel: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT token generation
export async function generateToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// JWT token verification
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Generate random token
export function generateRandomToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Create user session
export async function createSession(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string,
  deviceId?: string
): Promise<{ token: string; session: DBSession }> {
  const sessionToken = generateRandomToken(64);
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);
  
  // Create session in database
  const [session] = await sql`
    INSERT INTO sessions (user_id, device_id, token, session_type, trust_level, ip_address, user_agent, expires_at)
    VALUES (${userId}, ${deviceId || null}, ${sessionToken}, 'FULL', 'FULL', ${ipAddress || null}, ${userAgent || null}, ${expiresAt.toISOString()})
    RETURNING *
  ` as DBSession[];
  
  // Generate JWT
  const jwtPayload: SessionPayload = {
    userId,
    sessionId: session.id,
    email,
    trustLevel: 'FULL',
  };
  
  const jwt = await generateToken(jwtPayload);
  
  // Store session data in Redis for quick access
  await setSession(sessionToken, {
    ...jwtPayload,
    expiresAt: expiresAt.toISOString(),
  }, SESSION_DURATION);
  
  return { token: jwt, session };
}

// Validate session
export async function validateSession(token: string): Promise<{ user: DBUser; session: DBSession } | null> {
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  // Check session in database
  const [session] = await sql`
    SELECT * FROM sessions 
    WHERE id = ${payload.sessionId} 
    AND is_active = true 
    AND expires_at > NOW()
  ` as DBSession[];
  
  if (!session) return null;
  
  // Get user
  const [user] = await sql`
    SELECT * FROM users WHERE id = ${payload.userId} AND is_locked = false
  ` as DBUser[];
  
  if (!user) return null;
  
  // Update last activity
  await sql`
    UPDATE sessions SET last_activity_at = NOW() WHERE id = ${session.id}
  `;
  
  return { user, session };
}

// Invalidate session
export async function invalidateSession(sessionId: string, token?: string): Promise<void> {
  await sql`
    UPDATE sessions SET is_active = false WHERE id = ${sessionId}
  `;
  
  if (token) {
    await deleteSession(token);
  }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<{ user: DBUser; session: DBSession } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  return validateSession(token);
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
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
  cookieStore.delete('auth_token');
}

// Log security event
export async function logSecurityEvent(
  eventType: string,
  eventName: string,
  description: string,
  options: {
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    authenticatorId?: string;
    riskScore?: number;
    riskFactors?: string[];
    status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
    failureReason?: string;
  } = {}
): Promise<void> {
  await sql`
    INSERT INTO security_events (
      user_id, session_id, event_type, event_name, description,
      ip_address, user_agent, device_id, authenticator_id,
      risk_score, risk_factors, status, failure_reason
    )
    VALUES (
      ${options.userId || null},
      ${options.sessionId || null},
      ${eventType},
      ${eventName},
      ${description},
      ${options.ipAddress || null},
      ${options.userAgent || null},
      ${options.deviceId || null},
      ${options.authenticatorId || null},
      ${options.riskScore || 0},
      ${options.riskFactors || []},
      ${options.status || 'SUCCESS'},
      ${options.failureReason || null}
    )
  `;
}

// Calculate security score
export async function calculateSecurityScore(userId: string): Promise<number> {
  let score = 0;
  
  // Check for active authenticators
  const authenticators = await sql`
    SELECT type FROM authenticators WHERE user_id = ${userId} AND is_active = true
  `;
  
  // Base score for having an account
  score += 20;
  
  // Points for each type of authenticator
  const authTypes = new Set(authenticators.map((a: { type: string }) => a.type));
  
  if (authTypes.has('WEBAUTHN')) score += 30; // Passkey
  if (authTypes.has('SMART_CARD')) score += 20; // NFC Card
  if (authTypes.has('TOTP')) score += 15; // TOTP
  if (authTypes.has('RECOVERY_CODE')) score += 10; // Recovery codes
  
  // Check for multiple devices (trusted)
  const trustedDevices = await sql`
    SELECT COUNT(*) as count FROM devices WHERE user_id = ${userId} AND trusted_at IS NOT NULL
  `;
  
  if (trustedDevices[0]?.count >= 2) score += 5;
  
  return Math.min(100, score);
}
