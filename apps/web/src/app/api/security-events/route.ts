import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sql, DBSecurityEvent } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } },
        { status: 401 }
      );
    }
    
    const { user } = result;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const eventType = searchParams.get('type');
    
    let events: DBSecurityEvent[];
    
    if (eventType) {
      events = await sql`
        SELECT * FROM security_events 
        WHERE user_id = ${user.id} AND event_type = ${eventType}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as DBSecurityEvent[];
    } else {
      events = await sql`
        SELECT * FROM security_events 
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as DBSecurityEvent[];
    }
    
    // Get total count
    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM security_events WHERE user_id = ${user.id}
    ` as [{ count: number }];
    
    return NextResponse.json({
      success: true,
      data: {
        events: events.map(event => ({
          id: event.id,
          eventType: event.event_type,
          eventName: event.event_name,
          description: event.description,
          ipAddress: event.ip_address,
          userAgent: event.user_agent,
          deviceId: event.device_id,
          riskScore: event.risk_score,
          riskFactors: event.risk_factors,
          status: event.status,
          failureReason: event.failure_reason,
          createdAt: event.created_at,
        })),
        pagination: {
          total: Number(count),
          limit,
          offset,
          hasMore: offset + events.length < Number(count),
        },
      },
    });
  } catch (error) {
    console.error('Get security events error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
