import { NextRequest, NextResponse } from 'next/server';
import { validateSession, deleteSession, logSecurityEvent } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user data
    const users = await sql`
      SELECT id, email, display_name, created_at, updated_at
      FROM users WHERE id = ${session.user_id}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0] as { id: string; email: string; display_name: string | null; created_at: Date; updated_at: Date };

    // Check if user has MFA enabled
    const authenticators = await sql`
      SELECT COUNT(*) as count FROM authenticators 
      WHERE user_id = ${user.id} AND is_active = true
    `;

    const hasMfa = Number(authenticators[0]?.count || 0) > 0;

    // Get device count
    const devices = await sql`
      SELECT COUNT(*) as count FROM devices 
      WHERE user_id = ${user.id} AND is_active = true
    `;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        has_mfa: hasMfa,
      },
      session: {
        id: session.id,
        expires_at: session.expires_at,
      },
      stats: {
        device_count: Number(devices[0]?.count || 0),
        authenticator_count: Number(authenticators[0]?.count || 0),
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const userId = session.user_id;
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log the account deletion event before deleting
    await logSecurityEvent(
      'ACCOUNT_DELETED',
      'Account Deleted',
      `User account deleted`,
      { userId, ipAddress, userAgent, status: 'SUCCESS' }
    );

    // Delete all user data
    await sql`DELETE FROM simple_recovery_codes WHERE user_id = ${userId}`;
    await sql`DELETE FROM recovery_codes WHERE batch_id IN (SELECT id FROM recovery_code_batches WHERE user_id = ${userId})`;
    await sql`DELETE FROM recovery_code_batches WHERE user_id = ${userId}`;
    await sql`DELETE FROM totp_secrets WHERE user_id = ${userId}`;
    await sql`DELETE FROM webauthn_credentials WHERE user_id = ${userId}`;
    await sql`DELETE FROM authenticators WHERE user_id = ${userId}`;
    await sql`DELETE FROM devices WHERE user_id = ${userId}`;
    await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
    await sql`DELETE FROM security_events WHERE user_id = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;

    // Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
