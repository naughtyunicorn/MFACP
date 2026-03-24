'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, Shield, Smartphone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'passkey' | 'card'>('password');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaCode, setMfaCode] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  const handlePasswordLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requiresMfa) {
        setChallengeId(data.challengeId);
        setStep('mfa');
      } else {
        await login(data.user);
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMfaSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code: mfaCode }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'MFA verification failed');
      }

      await login(data.user);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (method: string) => {
    setError('');
    
    if (method === 'passkey') {
      if (!email) {
        setError('Please enter email for passkey authentication');
        return;
      }
      
      try {
        const { apiClient } = await import('@/lib/api');
        const result = await apiClient.getWebAuthnRegistrationOptions(email);
        
        if (result.success && result.data) {
          console.log('WebAuthn options generated:', result.data);
          setError('WebAuthn authentication is ready - implement browser API');
        } else {
          setError(result.error?.message || 'Failed to prepare WebAuthn authentication');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'WebAuthn setup failed');
      }
    } else if (method === 'card') {
      console.log('Waiting for NFC card...');
      setError('NFC card authentication not yet implemented');
    } else if (method === 'password') {
      await handlePasswordLogin();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            {step === 'credentials' ? 'Welcome back' : 'Verify Your Identity'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'credentials' 
              ? 'Sign in to your MFA Card Platform account'
              : 'Enter your authentication code'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <>
            {/* Auth Method Selector */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setAuthMethod('passkey')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    authMethod === 'passkey'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Key className="mb-1 h-4 w-4 mx-auto" />
                  Passkey
                </button>
                <button
                  onClick={() => setAuthMethod('card')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    authMethod === 'card'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smartphone className="mb-1 h-4 w-4 mx-auto" />
                  Card
                </button>
                <button
                  onClick={() => setAuthMethod('password')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    authMethod === 'password'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Lock className="mb-1 h-4 w-4 mx-auto" />
                  Password
                </button>
              </div>
            </div>

            {/* Passkey Authentication */}
            {authMethod === 'passkey' && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-6 text-center">
                  <Key className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Use your passkey</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Authenticate using your fingerprint, face, or device PIN
                  </p>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    onClick={() => handleLogin('passkey')}
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Authenticate with Passkey'}
                  </button>
                </div>
              </div>
            )}

            {/* Card Authentication */}
            {authMethod === 'card' && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-6 text-center">
                  <Smartphone className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Use your NFC card</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Hold your NFC card near your device to authenticate
                  </p>
                  <button
                    onClick={() => handleLogin('card')}
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Waiting for card...' : 'Tap NFC Card'}
                  </button>
                </div>
              </div>
            )}

            {/* Password Authentication */}
            {authMethod === 'password' && (
              <div className="space-y-4 rounded-lg border bg-card p-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-input" />
                    Remember me
                  </label>
                  <Link href="/recovery" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  onClick={() => handleLogin('password')}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* MFA Verification */
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="text-center mb-4">
              <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
            
            <div>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full rounded-lg border border-input bg-background px-3 py-3 text-center font-mono text-2xl tracking-[0.5em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="000000"
                maxLength={6}
                disabled={isSubmitting}
                onKeyDown={(e) => e.key === 'Enter' && mfaCode.length === 6 && handleMfaSubmit()}
              />
            </div>

            <button
              onClick={handleMfaSubmit}
              disabled={isSubmitting || mfaCode.length !== 6}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>

            <button
              onClick={() => {
                setStep('credentials');
                setMfaCode('');
                setChallengeId('');
                setError('');
              }}
              className="w-full rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Recovery Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can&apos;t access your account?{' '}
            <Link href="/recovery" className="text-primary hover:underline">
              Start recovery
            </Link>
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
