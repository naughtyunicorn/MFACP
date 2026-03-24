import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql, DBUser } from '@/lib/db';
import { hashPassword, createSession, setAuthCookie, logSecurityEvent } from '@/lib/auth';
import { checkRateLimit } from '@/lib/redis';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting
    const rateLimit = await checkRateLimit(`register:${ipAddress}`, 5, 3600);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMITED', message: 'Too many registration attempts. Please try again later.' } },
        { status: 429 }
      );
    }
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `;
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' } },
        { status: 400 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const [user] = await sql`
      INSERT INTO users (email, password_hash, last_password_change)
      VALUES (${email.toLowerCase()}, ${passwordHash}, NOW())
      RETURNING *
    ` as DBUser[];
    
    // Create session
    const { token, session } = await createSession(
      user.id,
      user.email,
      ipAddress,
      userAgent
    );
    
    // Set auth cookie
    await setAuthCookie(token);
    
    // Log security event
    await logSecurityEvent(
      'LOGIN_SUCCESS',
      'User Registration',
      `New user registered: ${email}`,
      {
        userId: user.id,
        sessionId: session.id,
        ipAddress,
        userAgent,
        status: 'SUCCESS',
      }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.email_verified,
          riskTier: user.risk_tier,
          createdAt: user.created_at,
        },
        session: {
          id: session.id,
          token,
          sessionType: session.session_type,
          trustLevel: session.trust_level,
          expiresAt: session.expires_at,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } },
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
