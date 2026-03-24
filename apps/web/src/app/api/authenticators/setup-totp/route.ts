import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { sql } from '@/lib/db'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

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

    // Generate a new TOTP secret
    const secret = new OTPAuth.Secret({ size: 20 })

    // Create the TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'MFACP',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    })

    // Generate the otpauth URI
    const uri = totp.toString()

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(uri, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    // Store the secret temporarily (will be saved permanently after verification)
    // For now, we return it to the client to be verified
    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      uri: uri,
    })
  } catch (error) {
    console.error('TOTP setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup TOTP' },
      { status: 500 }
    )
  }
}
