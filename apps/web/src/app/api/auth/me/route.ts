import { NextResponse } from 'next/server';
import { getCurrentUser, calculateSecurityScore } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } },
        { status: 401 }
      );
    }
    
    const { user, session } = result;
    
    // Calculate security score
    const securityScore = await calculateSecurityScore(user.id);
    
    // Get authenticator counts
    const authenticators = await sql`
      SELECT type, COUNT(*) as count FROM authenticators 
      WHERE user_id = ${user.id} AND is_active = true 
      GROUP BY type
    `;
    
    // Get trusted devices count
    const devices = await sql`
      SELECT COUNT(*) as count FROM devices 
      WHERE user_id = ${user.id} AND is_active = true
    `;
    
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
          sessionType: session.session_type,
          trustLevel: session.trust_level,
          expiresAt: session.expires_at,
          requiresReauth: session.requires_reauth,
        },
        security: {
          score: securityScore,
          authenticators: authenticators.reduce((acc: Record<string, number>, auth: { type: string; count: number }) => {
            acc[auth.type.toLowerCase()] = Number(auth.count);
            return acc;
          }, {}),
          deviceCount: Number(devices[0]?.count || 0),
        },
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
