import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, logSecurityEvent } from '@/lib/auth';
import { sql, DBAuthenticator, DBWebAuthnCredential, DBTotpSecret } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      );
    }
    
    const { user } = result;
    
    // Get all authenticators
    const authenticators = await sql`
      SELECT * FROM authenticators 
      WHERE user_id = ${user.id} AND is_active = true
      ORDER BY created_at DESC
    ` as DBAuthenticator[];
    
    // Get WebAuthn credentials details
    const webauthnCredentials = await sql`
      SELECT * FROM webauthn_credentials 
      WHERE user_id = ${user.id} AND is_active = true
    ` as DBWebAuthnCredential[];
    
    // Get TOTP secrets details (excluding the secret itself)
    const totpSecrets = await sql`
      SELECT id, user_id, name, algorithm, digits, period, is_active, is_backup, last_used_at, created_at 
      FROM totp_secrets 
      WHERE user_id = ${user.id} AND is_active = true
    ` as DBTotpSecret[];
    
    // Get recovery code count
    const recoveryCodes = await sql`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN used_at IS NULL THEN 1 ELSE 0 END) as unused
      FROM simple_recovery_codes 
      WHERE user_id = ${user.id}
    `;
    
    return NextResponse.json({
      authenticators: authenticators.map(auth => ({
        id: auth.id,
        type: auth.type,
        name: auth.name,
        isActive: auth.is_active,
        isBackup: auth.is_backup,
        lastUsedAt: auth.last_used_at,
        createdAt: auth.created_at,
      })),
      webauthn: webauthnCredentials.map(cred => ({
        id: cred.id,
        name: cred.name,
        credentialId: cred.credential_id,
        transports: cred.transports,
        isBackup: cred.is_backup,
        lastUsedAt: cred.last_used_at,
        createdAt: cred.created_at,
      })),
      totp: totpSecrets.map(totp => ({
        id: totp.id,
        name: totp.name,
        algorithm: totp.algorithm,
        digits: totp.digits,
        period: totp.period,
        isBackup: totp.is_backup,
        lastUsedAt: totp.last_used_at,
        createdAt: totp.created_at,
      })),
      recoveryCodes: {
        total: Number(recoveryCodes[0]?.total || 0),
        unused: Number(recoveryCodes[0]?.unused || 0),
      },
    });
  } catch (error) {
    console.error('Get authenticators error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      );
    }
    
    const { user, session } = result;
    const { searchParams } = new URL(request.url);
    const authenticatorId = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!authenticatorId || !type) {
      return NextResponse.json(
        { error: 'Authenticator ID and type are required.' },
        { status: 400 }
      );
    }
    
    // Check active authenticator count (must have at least one)
    const activeCount = await sql`
      SELECT COUNT(*) as count FROM authenticators 
      WHERE user_id = ${user.id} AND is_active = true
    `;
    
    if (Number(activeCount[0]?.count) <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove your last authenticator. Add another method first.' },
        { status: 400 }
      );
    }
    
    let name = 'Authenticator';
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Deactivate based on type
    if (type === 'webauthn') {
      const creds = await sql`
        SELECT name FROM webauthn_credentials WHERE id = ${authenticatorId} AND user_id = ${user.id}
      `;
      name = creds[0]?.name || 'Passkey';
      
      await sql`
        UPDATE webauthn_credentials SET is_active = false, updated_at = NOW() WHERE id = ${authenticatorId} AND user_id = ${user.id}
      `;
    } else if (type === 'totp') {
      const totps = await sql`
        SELECT name FROM totp_secrets WHERE id = ${authenticatorId} AND user_id = ${user.id}
      `;
      name = totps[0]?.name || 'TOTP';
      
      await sql`
        UPDATE totp_secrets SET is_active = false, updated_at = NOW() WHERE id = ${authenticatorId} AND user_id = ${user.id}
      `;
    }
    
    // Update authenticators table
    await sql`
      UPDATE authenticators SET is_active = false, updated_at = NOW()
      WHERE user_id = ${user.id} AND id = ${authenticatorId}
    `;
    
    // Log security event
    await logSecurityEvent(
      'AUTHENTICATOR_REMOVED',
      'Authenticator Removed',
      `Authenticator removed: ${name}`,
      {
        userId: user.id,
        sessionId: session.id,
        authenticatorId,
        ipAddress,
        userAgent,
        status: 'SUCCESS',
      }
    );
    
    return NextResponse.json({
      message: 'Authenticator removed successfully.',
    });
  } catch (error) {
    console.error('Remove authenticator error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
