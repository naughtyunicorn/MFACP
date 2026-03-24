import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { sql, logSecurityEvent } from '@/lib/db'
import * as OTPAuth from 'otpauth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const session = await validateSession(sessionToken)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { secret, code, name } = await request.json()

    if (!secret || !code) {
      return NextResponse.json(
        { error: 'Secret and code are required' },
        { status: 400 }
      )
    }

    // Get user email
    const users = await sql`
      SELECT email FROM users WHERE id = ${session.user_id}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const email = users[0].email

    // Verify the TOTP code
    const totp = new OTPAuth.TOTP({
      issuer: 'MFACP',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })

    const delta = totp.validate({ token: code, window: 1 })
    if (delta === null) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Save the authenticator to the database
    const authenticatorId = crypto.randomUUID()
    const authenticatorName = name || 'Authenticator App'

    await sql`
      INSERT INTO authenticators (id, user_id, type, name, secret, is_active, created_at, last_used_at)
      VALUES (${authenticatorId}, ${session.user_id}, 'totp', ${authenticatorName}, ${secret}, true, NOW(), NOW())
    `

    // Log security event
    await logSecurityEvent(
      session.user_id,
      'authenticator_added',
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown',
      { type: 'totp', name: authenticatorName }
    )

    return NextResponse.json({
      success: true,
      authenticator: {
        id: authenticatorId,
        type: 'totp',
        name: authenticatorName,
      },
    })
  } catch (error) {
    console.error('TOTP verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify TOTP' },
      { status: 500 }
    )
  }
}
