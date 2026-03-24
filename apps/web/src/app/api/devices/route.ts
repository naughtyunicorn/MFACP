import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, logSecurityEvent } from '@/lib/auth';
import { sql, DBDevice } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } },
        { status: 401 }
      );
    }
    
    const { user } = result;
    
    const devices = await sql`
      SELECT * FROM devices 
      WHERE user_id = ${user.id} AND is_active = true
      ORDER BY last_seen_at DESC
    ` as DBDevice[];
    
    return NextResponse.json({
      success: true,
      data: devices.map(device => ({
        id: device.id,
        deviceId: device.device_id,
        deviceType: device.device_type,
        userAgent: device.user_agent,
        ipAddress: device.ip_address,
        nickname: device.nickname,
        isActive: device.is_active,
        isTrusted: !!device.trusted_at,
        lastSeenAt: device.last_seen_at,
        trustedAt: device.trusted_at,
        createdAt: device.created_at,
      })),
    });
  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } },
        { status: 401 }
      );
    }
    
    const { user, session } = result;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('id');
    
    if (!deviceId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Device ID is required.' } },
        { status: 400 }
      );
    }
    
    // Check if device belongs to user
    const [device] = await sql`
      SELECT * FROM devices WHERE id = ${deviceId} AND user_id = ${user.id}
    ` as DBDevice[];
    
    if (!device) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Device not found.' } },
        { status: 404 }
      );
    }
    
    // Revoke device
    await sql`
      UPDATE devices SET is_active = false WHERE id = ${deviceId}
    `;
    
    // Invalidate all sessions for this device
    await sql`
      UPDATE sessions SET is_active = false WHERE device_id = ${deviceId}
    `;
    
    // Log security event
    await logSecurityEvent(
      'DEVICE_REVOKED',
      'Device Revoked',
      `Device revoked: ${device.nickname || device.device_id}`,
      {
        userId: user.id,
        sessionId: session.id,
        deviceId: device.device_id,
        status: 'SUCCESS',
      }
    );
    
    return NextResponse.json({
      success: true,
      data: { message: 'Device revoked successfully.' },
    });
  } catch (error) {
    console.error('Revoke device error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
