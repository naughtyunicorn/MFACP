export const config = {
  // Server
  port: parseInt(process.env.PORT || '3015', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/mfa_platform',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-must-be-at-least-32-chars-long',
  
  // WebAuthn
  webauthnRpId: process.env.WEBAUTHN_RP_ID || 'localhost',
  webauthnRpOrigin: process.env.WEBAUTHN_RP_ORIGIN || 'http://localhost:3000',
  webauthnRpName: process.env.WEBAUTHN_RP_NAME || 'MFA Card Platform',
  
  // URLs
  webUrl: process.env.WEB_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  
  // Risk Engine
  riskThresholdHigh: parseInt(process.env.RISK_THRESHOLD_HIGH || '80', 10),
  riskThresholdMedium: parseInt(process.env.RISK_THRESHOLD_MEDIUM || '60', 10),
  maxFailedAttempts: parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10),
  lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15', 10),
  
  // Recovery
  recoveryCodeCount: parseInt(process.env.RECOVERY_CODE_COUNT || '10', 10),
  recoveryCodeLength: parseInt(process.env.RECOVERY_CODE_LENGTH || '8', 10),
  recoverySessionDurationMinutes: parseInt(process.env.RECOVERY_SESSION_DURATION_MINUTES || '30', 10),
  
  // NFC Card
  cardAid: process.env.CARD_AID || 'F000000001',
  cardChallengeTimeoutSeconds: parseInt(process.env.CARD_CHALLENGE_TIMEOUT_SECONDS || '60', 10),
  
  // Email (optional)
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  fromEmail: process.env.FROM_EMAIL || 'noreply@mfacard.com',
};
