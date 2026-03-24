import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  riskTier: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  isLocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128).optional(),
});

// Device schemas
export const DeviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  deviceId: z.string(),
  deviceType: z.enum(['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN']),
  isActive: z.boolean(),
  lastSeenAt: z.date(),
  trustedAt: z.date().optional(),
  nickname: z.string().optional(),
});

// Session schemas
export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceId: z.string().optional(),
  token: z.string(),
  sessionType: z.enum(['FULL', 'RECOVERY', 'STEP_UP']),
  trustLevel: z.enum(['FULL', 'REDUCED', 'ELEVATED']),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  isActive: z.boolean(),
  expiresAt: z.date(),
  requiresReauth: z.boolean(),
  lastActivityAt: z.date(),
  createdAt: z.date(),
});

// WebAuthn schemas
export const WebAuthnRegistrationOptionsSchema = z.object({
  challenge: z.string(),
  rp: z.object({
    name: z.string(),
    id: z.string(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
  }),
  pubKeyCredParams: z.array(z.object({
    type: z.string(),
    alg: z.number(),
  })),
  timeout: z.number(),
  attestation: z.string(),
  authenticatorSelection: z.object({
    authenticatorAttachment: z.string().optional(),
    requireResidentKey: z.boolean(),
    userVerification: z.string(),
  }),
});

export const WebAuthnAuthenticationOptionsSchema = z.object({
  challenge: z.string(),
  allowCredentials: z.array(z.object({
    type: z.string(),
    id: z.string(),
    transports: z.array(z.string()).optional(),
  })),
  userVerification: z.string(),
  timeout: z.number(),
  rpId: z.string(),
});

export const WebAuthnRegistrationResponseSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    clientDataJSON: z.string(),
    attestationObject: z.string(),
  }),
  authenticatorAttachment: z.string().optional(),
  clientExtensionResults: z.object({}).optional(),
  type: z.string(),
});

export const WebAuthnAuthenticationResponseSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    clientDataJSON: z.string(),
    authenticatorData: z.string(),
    signature: z.string(),
    userHandle: z.string().optional(),
  }),
  authenticatorAttachment: z.string().optional(),
  clientExtensionResults: z.object({}).optional(),
  type: z.string(),
});

// Card schemas
export const CardEnrollmentOptionsSchema = z.object({
  challenge: z.string(),
  cardAid: z.string(),
  timeout: z.number(),
});

export const CardAuthenticationOptionsSchema = z.object({
  challenge: z.string(),
  cardAid: z.string(),
  timeout: z.number(),
});

export const CardResponseSchema = z.object({
  cardId: z.string(),
  signature: z.string(),
  counter: z.number(),
  publicKey: z.string().optional(),
});

// Recovery schemas
export const RecoveryCodeBatchSchema = z.object({
  id: z.string(),
  batchName: z.string().optional(),
  codesGenerated: z.number(),
  codesRemaining: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export const RecoveryCodeSchema = z.object({
  code: z.string().length(8),
  isUsed: z.boolean(),
  usedAt: z.date().optional(),
});

export const VerifyRecoveryCodeSchema = z.object({
  code: z.string().length(8),
});

export const GenerateRecoveryCodesSchema = z.object({
  batchName: z.string().optional(),
  count: z.number().min(1).max(20).default(10),
});

// TOTP schemas
export const TotpEnrollmentOptionsSchema = z.object({
  secret: z.string(),
  qrCode: z.string(),
  manualEntryKey: z.string(),
  algorithm: z.string(),
  digits: z.number(),
  period: z.number(),
});

export const VerifyTotpSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
});

export const EnrollTotpSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
  name: z.string().min(1).max(100),
});

// API request schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  authMethod: z.enum(['password', 'webauthn', 'card', 'totp', 'recovery']),
  authData: z.any().optional(),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  deviceInfo: z.object({
    userAgent: z.string(),
    ipAddress: z.string(),
    deviceId: z.string(),
    deviceType: z.enum(['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN']),
  }).optional(),
});

export const LogoutRequestSchema = z.object({
  allDevices: z.boolean().default(false),
});

// Security event schemas
export const SecurityEventSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  eventType: z.enum([
    'LOGIN_SUCCESS',
    'LOGIN_FAILURE',
    'LOGOUT',
    'PASSWORD_CHANGE',
    'AUTHENTICATOR_ADDED',
    'AUTHENTICATOR_REMOVED',
    'AUTHENTICATOR_USED',
    'RECOVERY_CODE_GENERATED',
    'RECOVERY_CODE_USED',
    'RECOVERY_REQUESTED',
    'ACCOUNT_LOCKED',
    'ACCOUNT_UNLOCKED',
    'SUSPICIOUS_ACTIVITY',
    'SECURITY_SETTING_CHANGED',
    'DEVICE_REVOKED',
    'SESSION_INVALIDATED',
  ]),
  eventName: z.string(),
  description: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  deviceId: z.string().optional(),
  authenticatorId: z.string().optional(),
  riskScore: z.number(),
  riskFactors: z.array(z.string()),
  status: z.enum(['SUCCESS', 'FAILURE', 'WARNING']),
  failureReason: z.string().optional(),
  createdAt: z.date(),
});

// Risk assessment schemas
export const RiskAssessmentSchema = z.object({
  score: z.number().min(0).max(100),
  tier: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  factors: z.array(z.object({
    type: z.string(),
    description: z.string(),
    weight: z.number(),
    detected: z.boolean(),
  })),
  recommendation: z.enum(['ALLOW', 'STEP_UP', 'DELAY', 'BLOCK']),
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  meta: z.object({
    requestId: z.string().optional(),
    timestamp: z.string().optional(),
    version: z.string().optional(),
  }).optional(),
});

// Utility types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type WebAuthnRegistrationOptions = z.infer<typeof WebAuthnRegistrationOptionsSchema>;
export type WebAuthnAuthenticationOptions = z.infer<typeof WebAuthnAuthenticationOptionsSchema>;
export type WebAuthnRegistrationResponse = z.infer<typeof WebAuthnRegistrationResponseSchema>;
export type WebAuthnAuthenticationResponse = z.infer<typeof WebAuthnAuthenticationResponseSchema>;
export type CardEnrollmentOptions = z.infer<typeof CardEnrollmentOptionsSchema>;
export type CardAuthenticationOptions = z.infer<typeof CardAuthenticationOptionsSchema>;
export type CardResponse = z.infer<typeof CardResponseSchema>;
export type RecoveryCodeBatch = z.infer<typeof RecoveryCodeBatchSchema>;
export type RecoveryCode = z.infer<typeof RecoveryCodeSchema>;
export type VerifyRecoveryCode = z.infer<typeof VerifyRecoveryCodeSchema>;
export type GenerateRecoveryCodes = z.infer<typeof GenerateRecoveryCodesSchema>;
export type TotpEnrollmentOptions = z.infer<typeof TotpEnrollmentOptionsSchema>;
export type VerifyTotp = z.infer<typeof VerifyTotpSchema>;
export type EnrollTotp = z.infer<typeof EnrollTotpSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type SecurityEvent = z.infer<typeof SecurityEventSchema>;
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
