import { Redis } from '@upstash/redis';

// Create Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Key prefixes for different data types
export const REDIS_KEYS = {
  SESSION: 'session:',
  WEBAUTHN_CHALLENGE: 'webauthn_challenge:',
  RATE_LIMIT: 'rate_limit:',
  PASSWORD_RESET: 'password_reset:',
  EMAIL_VERIFICATION: 'email_verification:',
  RECOVERY_TOKEN: 'recovery_token:',
} as const;

// Session management
export async function setSession(token: string, sessionData: object, expiresInSeconds: number = 86400) {
  await redis.set(`${REDIS_KEYS.SESSION}${token}`, JSON.stringify(sessionData), { ex: expiresInSeconds });
}

export async function getSession(token: string) {
  const data = await redis.get(`${REDIS_KEYS.SESSION}${token}`);
  return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
}

export async function deleteSession(token: string) {
  await redis.del(`${REDIS_KEYS.SESSION}${token}`);
}

// WebAuthn challenge management
export async function setWebAuthnChallenge(identifier: string, challenge: string, expiresInSeconds: number = 300) {
  await redis.set(`${REDIS_KEYS.WEBAUTHN_CHALLENGE}${identifier}`, challenge, { ex: expiresInSeconds });
}

export async function getWebAuthnChallenge(identifier: string): Promise<string | null> {
  const challenge = await redis.get(`${REDIS_KEYS.WEBAUTHN_CHALLENGE}${identifier}`);
  return challenge as string | null;
}

export async function deleteWebAuthnChallenge(identifier: string) {
  await redis.del(`${REDIS_KEYS.WEBAUTHN_CHALLENGE}${identifier}`);
}

// Rate limiting
export async function checkRateLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const fullKey = `${REDIS_KEYS.RATE_LIMIT}${key}`;
  const current = await redis.incr(fullKey);
  
  if (current === 1) {
    await redis.expire(fullKey, windowSeconds);
  }
  
  const ttl = await redis.ttl(fullKey);
  
  return {
    allowed: current <= maxAttempts,
    remaining: Math.max(0, maxAttempts - current),
    resetIn: ttl > 0 ? ttl : windowSeconds,
  };
}

// Password reset tokens
export async function setPasswordResetToken(token: string, userId: string, expiresInSeconds: number = 3600) {
  await redis.set(`${REDIS_KEYS.PASSWORD_RESET}${token}`, userId, { ex: expiresInSeconds });
}

export async function getPasswordResetToken(token: string): Promise<string | null> {
  return await redis.get(`${REDIS_KEYS.PASSWORD_RESET}${token}`) as string | null;
}

export async function deletePasswordResetToken(token: string) {
  await redis.del(`${REDIS_KEYS.PASSWORD_RESET}${token}`);
}

// Email verification tokens
export async function setEmailVerificationToken(token: string, userId: string, expiresInSeconds: number = 86400) {
  await redis.set(`${REDIS_KEYS.EMAIL_VERIFICATION}${token}`, userId, { ex: expiresInSeconds });
}

export async function getEmailVerificationToken(token: string): Promise<string | null> {
  return await redis.get(`${REDIS_KEYS.EMAIL_VERIFICATION}${token}`) as string | null;
}

export async function deleteEmailVerificationToken(token: string) {
  await redis.del(`${REDIS_KEYS.EMAIL_VERIFICATION}${token}`);
}

// Recovery session tokens
export async function setRecoveryToken(token: string, data: object, expiresInSeconds: number = 1800) {
  await redis.set(`${REDIS_KEYS.RECOVERY_TOKEN}${token}`, JSON.stringify(data), { ex: expiresInSeconds });
}

export async function getRecoveryToken(token: string) {
  const data = await redis.get(`${REDIS_KEYS.RECOVERY_TOKEN}${token}`);
  return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
}

export async function deleteRecoveryToken(token: string) {
  await redis.del(`${REDIS_KEYS.RECOVERY_TOKEN}${token}`);
}
