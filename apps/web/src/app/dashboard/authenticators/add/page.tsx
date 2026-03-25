'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Key, Smartphone, ArrowLeft, Check, AlertCircle, Copy, RefreshCw } from 'lucide-react';

type AuthType = 'passkey' | 'totp' | null;

export default function AddAuthenticatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<AuthType>(null);
  const [step, setStep] = useState<'select' | 'setup' | 'verify'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // TOTP state
  const [totpSecret, setTotpSecret] = useState('');
  const [totpQrCode, setTotpQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authenticatorName, setAuthenticatorName] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'passkey' || type === 'totp') {
      setSelectedType(type);
      setStep('setup');
      if (type === 'totp') {
        initializeTotpSetup();
      }
    }
  }, [searchParams]);

  const initializeTotpSetup = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/authenticators/setup-totp', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.ok) {
        setTotpSecret(data.secret);
        setTotpQrCode(data.qrCode);
      } else {
        setError(data.error || 'Failed to initialize TOTP setup');
      }
    } catch (err) {
      setError('Failed to initialize TOTP setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectType = (type: AuthType) => {
    setSelectedType(type);
    setStep('setup');
    setError('');
    
    if (type === 'totp') {
      initializeTotpSetup();
    }
  };

  const handlePasskeySetup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would use the WebAuthn API
      // For now, show a message that this requires browser support
      setError('Passkey registration requires browser WebAuthn support. Please ensure you have a compatible device.');
    } catch (err) {
      setError('Failed to set up passkey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/authenticators/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          secret: totpSecret,
          code: verificationCode,
          name: authenticatorName || 'Authenticator App',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/dashboard/authenticators');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(totpSecret);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/authenticators"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Authenticators
        </Link>
        <h1 className="text-2xl font-bold">Add Authenticator</h1>
        <p className="text-muted-foreground">
          {step === 'select' && 'Choose an authentication method to add'}
          {step === 'setup' && selectedType === 'passkey' && 'Set up a passkey for passwordless login'}
          {step === 'setup' && selectedType === 'totp' && 'Set up an authenticator app'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step: Select Type */}
      {step === 'select' && (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => handleSelectType('passkey')}
            className="flex flex-col items-center p-6 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Key className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Passkey</h3>
            <p className="text-sm text-muted-foreground text-center">
              Use your device&apos;s biometrics or PIN for secure, passwordless authentication
            </p>
            <span className="mt-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Recommended
            </span>
          </button>

          <button
            onClick={() => handleSelectType('totp')}
            className="flex flex-col items-center p-6 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-security-medium/10 mb-4">
              <Smartphone className="h-7 w-7 text-security-medium" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Authenticator App</h3>
            <p className="text-sm text-muted-foreground text-center">
              Use an app like Google Authenticator or Authy for time-based codes
            </p>
            <span className="mt-4 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              Works Offline
            </span>
          </button>
        </div>
      )}

      {/* Step: Setup Passkey */}
      {step === 'setup' && selectedType === 'passkey' && (
        <div className="rounded-lg border bg-card p-6">
          <div className="text-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Register a Passkey</h2>
            <p className="text-muted-foreground">
              Your device will prompt you to verify your identity using Face ID, Touch ID, Windows Hello, or your device PIN.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Requirements:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-security-low" />
                A device with biometric or PIN authentication
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-security-low" />
                A supported browser (Chrome, Safari, Edge, Firefox)
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-security-low" />
                Secure context (HTTPS)
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('select')}
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Back
            </button>
            <button
              onClick={handlePasskeySetup}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Setting up...' : 'Register Passkey'}
            </button>
          </div>
        </div>
      )}

      {/* Step: Setup TOTP */}
      {step === 'setup' && selectedType === 'totp' && (
        <div className="rounded-lg border bg-card p-6">
          {isLoading && !totpQrCode ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
                <p className="text-muted-foreground">
                  Open your authenticator app and scan this QR code
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                {totpQrCode && (
                  <div className="p-4 bg-white rounded-lg">
                    <img src={totpQrCode} alt="TOTP QR Code" width={200} height={200} />
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Or enter this code manually:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded-lg font-mono text-sm break-all">
                    {totpSecret}
                  </code>
                  <button
                    onClick={copySecretToClipboard}
                    className="p-2 rounded-lg hover:bg-accent"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Authenticator Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={authenticatorName}
                  onChange={(e) => setAuthenticatorName(e.target.value)}
                  placeholder="e.g., Personal Phone"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              {/* Verification Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Enter verification code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full rounded-lg border border-input bg-background px-3 py-3 text-center font-mono text-xl tracking-[0.5em]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('select');
                    setTotpSecret('');
                    setTotpQrCode('');
                    setVerificationCode('');
                  }}
                  className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Back
                </button>
                <button
                  onClick={handleTotpVerify}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify and Add'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Supported Apps */}
      {step === 'setup' && selectedType === 'totp' && (
        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-3">Recommended Authenticator Apps</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <span>Google Authenticator</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <span>Authy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <span>1Password</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <span>Microsoft Authenticator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
