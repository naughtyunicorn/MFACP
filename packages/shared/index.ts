// User and authentication types
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  riskTier: RiskTier;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  deviceId: string;
  deviceType: DeviceType;
  isActive: boolean;
  lastSeenAt: Date;
  trustedAt?: Date;
  nickname?: string;
}

export interface Authenticator {
  id: string;
  userId: string;
  type: AuthenticatorType;
  name: string;
  isActive: boolean;
  isBackup: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
}

export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string;
  credentialType: string;
  transports: string[];
  publicKey: string;
  name: string;
  isActive: boolean;
  isBackup: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
}

export interface SmartCard {
  id: string;
  userId: string;
  cardId: string;
  cardAid: string;
  publicKey: string;
  cardVersion?: string;
  manufacturer?: string;
  serialNumber?: string;
  isActive: boolean;
  isBackup: boolean;
  lastUsedAt?: Date;
  usageCounter: number;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  deviceId?: string;
  token: string;
  sessionType: SessionType;
  trustLevel: TrustLevel;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  requiresReauth: boolean;
  lastActivityAt: Date;
  createdAt: Date;
}

export interface SecurityEvent {
  id: string;
  userId?: string;
  sessionId?: string;
  eventType: SecurityEventType;
  eventName: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  authenticatorId?: string;
  riskScore: number;
  riskFactors: string[];
  status: EventStatus;
  failureReason?: string;
  createdAt: Date;
}

// Enums
export enum RiskTier {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  UNKNOWN = 'UNKNOWN'
}

export enum AuthenticatorType {
  WEBAUTHN = 'WEBAUTHN',
  SMART_CARD = 'SMART_CARD',
  TOTP = 'TOTP',
  RECOVERY_CODE = 'RECOVERY_CODE'
}

export enum SessionType {
  FULL = 'FULL',
  RECOVERY = 'RECOVERY',
  STEP_UP = 'STEP_UP'
}

export enum TrustLevel {
  FULL = 'FULL',
  REDUCED = 'REDUCED',
  ELEVATED = 'ELEVATED'
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  AUTHENTICATOR_ADDED = 'AUTHENTICATOR_ADDED',
  AUTHENTICATOR_REMOVED = 'AUTHENTICATOR_REMOVED',
  AUTHENTICATOR_USED = 'AUTHENTICATOR_USED',
  RECOVERY_CODE_GENERATED = 'RECOVERY_CODE_GENERATED',
  RECOVERY_CODE_USED = 'RECOVERY_CODE_USED',
  RECOVERY_REQUESTED = 'RECOVERY_REQUESTED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SECURITY_SETTING_CHANGED = 'SECURITY_SETTING_CHANGED',
  DEVICE_REVOKED = 'DEVICE_REVOKED',
  SESSION_INVALIDATED = 'SESSION_INVALIDATED'
}

export enum EventStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  WARNING = 'WARNING'
}

// API Request/Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId?: string;
    timestamp?: string;
    version?: string;
  };
}

export interface AuthResponse {
  user: User;
  session: Session;
  requiresReauth?: boolean;
}

export interface WebAuthnRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout: number;
  attestation: string;
  authenticatorSelection: {
    authenticatorAttachment?: string;
    requireResidentKey: boolean;
    userVerification: string;
  };
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  allowCredentials: Array<{
    type: string;
    id: string;
    transports?: string[];
  }>;
  userVerification: string;
  timeout: number;
  rpId: string;
}

export interface CardEnrollmentOptions {
  challenge: string;
  cardAid: string;
  timeout: number;
}

export interface CardAuthenticationOptions {
  challenge: string;
  cardAid: string;
  timeout: number;
}

export interface RecoveryCodeBatch {
  id: string;
  batchName?: string;
  codesGenerated: number;
  codesRemaining: number;
  isActive: boolean;
  createdAt: Date;
}

export interface RecoveryCode {
  code: string; // Plain text for user display
  isUsed: boolean;
  usedAt?: Date;
}

export interface TotpEnrollmentOptions {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
  algorithm: string;
  digits: number;
  period: number;
}

// Risk assessment
export interface RiskAssessment {
  score: number;
  tier: RiskTier;
  factors: RiskFactor[];
  recommendation: RiskRecommendation;
}

export interface RiskFactor {
  type: string;
  description: string;
  weight: number;
  detected: boolean;
}

export enum RiskRecommendation {
  ALLOW = 'ALLOW',
  STEP_UP = 'STEP_UP',
  DELAY = 'DELAY',
  BLOCK = 'BLOCK'
}

// NFC Card APDU types
export interface ApduCommand {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: Buffer;
  le?: number;
}

export interface ApduResponse {
  data: Buffer;
  sw1: number;
  sw2: number;
  status: number;
}

export interface CardChallenge {
  challenge: string;
  timestamp: number;
  expiresAt: number;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',
  
  // WebAuthn errors
  WEBAUTHN_NOT_SUPPORTED = 'WEBAUTHN_NOT_SUPPORTED',
  WEBAUTHN_INVALID_RESPONSE = 'WEBAUTHN_INVALID_RESPONSE',
  WEBAUTHN_CREDENTIAL_EXCLUDED = 'WEBAUTHN_CREDENTIAL_EXCLUDED',
  
  // Card errors
  CARD_NOT_FOUND = 'CARD_NOT_FOUND',
  CARD_INVALID_RESPONSE = 'CARD_INVALID_RESPONSE',
  CARD_TIMEOUT = 'CARD_TIMEOUT',
  
  // Recovery errors
  RECOVERY_CODE_INVALID = 'RECOVERY_CODE_INVALID',
  RECOVERY_CODE_USED = 'RECOVERY_CODE_USED',
  RECOVERY_PENDING = 'RECOVERY_PENDING',
  
  // TOTP errors
  TOTP_INVALID = 'TOTP_INVALID',
  TOTP_RATE_LIMITED = 'TOTP_RATE_LIMITED',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// Validation schemas
export * from './schemas';
