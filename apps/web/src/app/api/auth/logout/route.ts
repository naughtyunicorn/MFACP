import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, invalidateSession, clearAuthCookie, logSecurityEvent } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (result) {
      const { user, session } = result;
      
      // Invalidate session
      await invalidateSession(session.id, session.token);
      
      // Log security event
      await logSecurityEvent(
        'LOGOUT',
        'User Logout',
        `User logged out: ${user.email}`,
        {
          userId: user.id,
          sessionId: session.id,
          status: 'SUCCESS',
        }
      );
    }
    
    // Clear auth cookie
    await clearAuthCookie();
    
    return NextResponse.json({
      success: true,
      data: { message: 'Logged out successfully.' },
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear the cookie even if there's an error
    await clearAuthCookie();
    
    return NextResponse.json({
      success: true,
      data: { message: 'Logged out successfully.' },
    });
  }
}
