import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql, DBUser } from '@/lib/db';
import { verifyPassword, createSession, setAuthCookie, logSecurityEvent } from '@/lib/auth';
import { checkRateLimit } from '@/lib/redis';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting
    const rateLimit = await checkRateLimit(`login:${email.toLowerCase()}`, 5, 900);
    if (!rateLimit.allowed) {
      await logSecurityEvent(
        'LOGIN_FAILURE',
        'Rate Limited Login Attempt',
        `Login rate limited for: ${email}`,
        { ipAddress, userAgent, status: 'FAILURE', failureReason: 'Rate limited' }
      );
      
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again later.' } },
        { status: 429 }
      );
    }
    
    // Find user
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    ` as DBUser[];
    
    if (!user) {
      await logSecurityEvent(
        'LOGIN_FAILURE',
        'Failed Login Attempt',
        `Login attempt for non-existent user: ${email}`,
        { ipAddress, userAgent, status: 'FAILURE', failureReason: 'User not found' }
      );
      
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }
    
    // Check if account is locked
    if (user.is_locked) {
      await logSecurityEvent(
        'LOGIN_FAILURE',
        'Locked Account Login Attempt',
        `Login attempt on locked account: ${email}`,
        { userId: user.id, ipAddress, userAgent, status: 'FAILURE', failureReason: 'Account locked' }
      );
      
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_LOCKED', message: 'This account has been locked. Please contact support.' } },
        { status: 403 }
      );
    }
    
    // Check password
    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_PASSWORD', message: 'This account uses passwordless authentication. Please use a passkey.' } },
        { status: 400 }
      );
    }
    
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      await logSecurityEvent(
        'LOGIN_FAILURE',
        'Failed Login Attempt',
        `Invalid password for user: ${email}`,
        { userId: user.id, ipAddress, userAgent, status: 'FAILURE', failureReason: 'Invalid password' }
      );
      
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }
    
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
      'Successful Login',
      `User logged in: ${email}`,
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
          isLocked: user.is_locked,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        session: {
          id: session.id,
          token,
          sessionType: session.session_type,
          trustLevel: session.trust_level,
          expiresAt: session.expires_at,
          requiresReauth: session.requires_reauth,
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
    
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
