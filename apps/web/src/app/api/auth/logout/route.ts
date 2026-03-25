import { NextResponse } from 'next/server';
import { getCurrentUser, deleteSession, clearAuthCookie, logSecurityEvent } from '@/lib/auth';

export async function POST() {
  try {
    const result = await getCurrentUser();
    
    if (result) {
      const { user, session } = result;
      
      // Invalidate session
      await deleteSession(session.token);
      
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
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear the cookie even if there's an error
    try {
      await clearAuthCookie();
    } catch {}
    
    return NextResponse.json({
      message: 'Logged out successfully.',
    });
  }
}
