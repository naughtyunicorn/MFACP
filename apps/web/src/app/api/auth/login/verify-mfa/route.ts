import { NextRequest, NextResponse } from 'next/server'
import { getMfaChallenge, deleteMfaChallenge } from '@/lib/redis'
import { createSession, setSessionCookie } from '@/lib/auth'
import { sql, logSecurityEvent } from '@/lib/db'
import * as OTPAuth from 'otpauth'

export async function POST(request: NextRequest) {
  try {
    const { challengeId, code } = await request.json()

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: 'Challenge ID and code are required' },
        { status: 400 }
      )
    }

    // Get the MFA challenge from Redis
    const challenge = await getMfaChallenge(challengeId)
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge expired or invalid' },
        { status: 401 }
      )
    }

    // Get the user's authenticator
    const authenticators = await sql`
      SELECT secret, type FROM authenticators 
      WHERE user_id = ${challenge.userId} 
      AND is_active = true
      LIMIT 1
    `

    if (authenticators.length === 0) {
      return NextResponse.json(
        { error: 'No active authenticator found' },
        { status: 401 }
      )
    }

    const authenticator = authenticators[0]

    // Verify the TOTP code
    const totp = new OTPAuth.TOTP({
      issuer: 'MFACP',
      label: challenge.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: authenticator.secret,
    })

    const delta = totp.validate({ token: code, window: 1 })
    if (delta === null) {
      await logSecurityEvent(
        challenge.userId,
        'mfa_verification_failed',
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || 'unknown',
        { reason: 'Invalid code' }
      )

      return NextResponse.json(
        { error: 'Invalid authentication code' },
        { status: 401 }
      )
    }

    // Delete the challenge from Redis
    await deleteMfaChallenge(challengeId)

    // Get user data
    const users = await sql`
      SELECT id, email, display_name, created_at FROM users WHERE id = ${challenge.userId}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]

    // Create session
    const session = await createSession(
      user.id,
      request.headers.get('user-agent') || 'unknown',
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    // Log security event
    await logSecurityEvent(
      user.id,
      'login_success',
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown',
      { method: 'mfa' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
      },
    })

    setSessionCookie(response, session.token)

    return response
  } catch (error) {
    console.error('MFA verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify MFA' },
      { status: 500 }
    )
  }
}
