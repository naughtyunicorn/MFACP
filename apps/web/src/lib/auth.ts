import bcrypt from 'bcryptjs';
import { sql, DBSession } from './db';
import { NextResponse } from 'next/server';

const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

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
  userAgent?: string,
  ipAddress?: string
): Promise<{ token: string; session: DBSession }> {
  const sessionToken = generateRandomToken(64);
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);
  
  // Create session in database
  const sessions = await sql`
    INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at, is_active)
    VALUES (${userId}, ${sessionToken}, ${ipAddress || null}, ${userAgent || null}, ${expiresAt.toISOString()}, true)
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
    UPDATE sessions SET updated_at = NOW() WHERE id = ${session.id}
  `;
  
  return session;
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  await sql`
    UPDATE sessions SET is_active = false WHERE token = ${token}
  `;
}

// Set session cookie on response
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

// Clear session cookie
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
