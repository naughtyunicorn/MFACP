import { NextRequest, NextResponse } from 'next/server';
import { validateSession, generateRecoveryCodes, logSecurityEvent } from '@/lib/auth';
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
    
    // Get recovery codes (don't show actual codes, just metadata)
    const recoveryCodes = await sql`
      SELECT id, code, used_at, created_at
      FROM simple_recovery_codes 
      WHERE user_id = ${session.user_id}
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({
      recoveryCodes: recoveryCodes.map((code: { id: string; code: string; used_at: Date | null; created_at: Date }) => ({
        id: code.id,
        // Mask the code, only show first and last 2 characters
        code: code.code.substring(0, 2) + '****' + code.code.substring(code.code.length - 2),
        used: !!code.used_at,
        created_at: code.created_at,
      })),
    });
  } catch (error) {
    console.error('Get recovery codes error:', error);
    return NextResponse.json(
      { error: 'Failed to get recovery codes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Delete existing unused recovery codes
    await sql`
      DELETE FROM simple_recovery_codes WHERE user_id = ${session.user_id}
    `;
    
    // Generate 10 new recovery codes
    const codes = generateRecoveryCodes(10);
    
    // Insert new codes
    for (const code of codes) {
      await sql`
        INSERT INTO simple_recovery_codes (user_id, code)
        VALUES (${session.user_id}, ${code})
      `;
    }
    
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log security event
    await logSecurityEvent(
      'RECOVERY_CODES_GENERATED',
      'Recovery Codes Generated',
      `Generated ${codes.length} new recovery codes`,
      { userId: session.user_id, sessionId: session.id, ipAddress, userAgent, status: 'SUCCESS' }
    );
    
    return NextResponse.json({
      codes,
      message: 'Recovery codes generated successfully. Store these securely - they will not be shown again.',
    });
  } catch (error) {
    console.error('Generate recovery codes error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recovery codes' },
      { status: 500 }
    );
  }
}
