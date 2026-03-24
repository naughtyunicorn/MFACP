import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const users = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (users.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ success: true })
    }

    // Check if user has any unused recovery codes
    const codes = await sql`
      SELECT id FROM recovery_codes 
      WHERE user_id = ${users[0].id} 
      AND used_at IS NULL
      LIMIT 1
    `

    if (codes.length === 0) {
      return NextResponse.json(
        { error: 'No recovery codes available for this account' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recovery email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  }
}
