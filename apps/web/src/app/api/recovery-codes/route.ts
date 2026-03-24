import { NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, logSecurityEvent, generateRandomToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// Generate a readable recovery code
function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  const segments = 4;
  const segmentLength = 4;
  const parts: string[] = [];
  
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      segment += chars[randomIndex];
    }
    parts.push(segment);
  }
  
  return parts.join('-');
}

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
    
    // Get active recovery code batches with remaining count
    const batches = await sql`
      SELECT id, batch_name, codes_generated, codes_remaining, created_at
      FROM recovery_code_batches 
      WHERE user_id = ${user.id} AND is_active = true
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({
      success: true,
      data: {
        batches: batches.map((batch: any) => ({
          id: batch.id,
          batchName: batch.batch_name,
          codesGenerated: batch.codes_generated,
          codesRemaining: batch.codes_remaining,
          createdAt: batch.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Get recovery codes error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } },
        { status: 401 }
      );
    }
    
    const { user, session } = result;
    
    // Deactivate existing batches
    await sql`
      UPDATE recovery_code_batches SET is_active = false WHERE user_id = ${user.id}
    `;
    
    // Generate 10 new recovery codes
    const codes: string[] = [];
    const codeHashes: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      const code = generateRecoveryCode();
      const hash = await hashPassword(code);
      codes.push(code);
      codeHashes.push(hash);
    }
    
    // Create new batch
    const [batch] = await sql`
      INSERT INTO recovery_code_batches (user_id, batch_name, codes_generated, codes_remaining)
      VALUES (${user.id}, ${`Recovery Codes - ${new Date().toLocaleDateString()}`}, 10, 10)
      RETURNING *
    `;
    
    // Insert individual codes
    for (const hash of codeHashes) {
      await sql`
        INSERT INTO recovery_codes (batch_id, code_hash)
        VALUES (${batch.id}, ${hash})
      `;
    }
    
    // Create authenticator record if not exists
    const existingAuth = await sql`
      SELECT id FROM authenticators 
      WHERE user_id = ${user.id} AND type = 'RECOVERY_CODE' AND is_active = true
    `;
    
    if (existingAuth.length === 0) {
      await sql`
        INSERT INTO authenticators (user_id, type, name, is_backup)
        VALUES (${user.id}, 'RECOVERY_CODE', 'Recovery Codes', true)
      `;
    }
    
    // Log security event
    await logSecurityEvent(
      'RECOVERY_CODE_GENERATED',
      'Recovery Codes Generated',
      `New recovery codes generated for user`,
      {
        userId: user.id,
        sessionId: session.id,
        status: 'SUCCESS',
      }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        codes,
        batchId: batch.id,
        message: 'Recovery codes generated successfully. Store these securely - they will not be shown again.',
      },
    });
  } catch (error) {
    console.error('Generate recovery codes error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
