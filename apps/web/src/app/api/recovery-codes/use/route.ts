import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createSession, setSessionCookie } from '@/lib/auth'
import { logSecurityEvent } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and recovery code are required' },
        { status: 400 }
      )
    }

    // Find the user
    const users = await sql`
      SELECT id, display_name, email FROM users WHERE email = ${email.toLowerCase()}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or recovery code' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Find and validate the recovery code
    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const codes = await sql`
      SELECT id, code FROM recovery_codes 
      WHERE user_id = ${user.id} 
      AND used_at IS NULL
    `

    const validCode = codes.find((c: { id: string; code: string }) => {
      const storedCode = c.code.toUpperCase().replace(/[^A-Z0-9]/g, '')
      return storedCode === normalizedCode
    })

    if (!validCode) {
      await logSecurityEvent(
        user.id,
        'recovery_failed',
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || 'unknown',
        { reason: 'Invalid recovery code' }
      )

      return NextResponse.json(
        { error: 'Invalid email or recovery code' },
        { status: 401 }
      )
    }

    // Mark the recovery code as used
    await sql`
      UPDATE recovery_codes 
      SET used_at = NOW() 
      WHERE id = ${validCode.id}
    `

    // Create a session for the user
    const session = await createSession(
      user.id,
      request.headers.get('user-agent') || 'unknown',
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    // Log the security event
    await logSecurityEvent(
      user.id,
      'recovery_success',
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown',
      { method: 'recovery_code' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
      },
    })

    setSessionCookie(response, session.token)

    return response
  } catch (error) {
    console.error('Recovery code usage error:', error)
    return NextResponse.json(
      { error: 'Failed to use recovery code' },
      { status: 500 }
    )
  }
}
