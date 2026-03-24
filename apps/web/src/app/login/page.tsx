'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, Shield, Smartphone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'passkey' | 'card'>('password');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async (method: string) => {
    setError('');
    
    if (method === 'passkey') {
      // WebAuthn authentication
      if (!email) {
        setError('Please enter email for passkey authentication');
        return;
      }
      
      try {
        const { apiClient } = await import('@/lib/api');
        const result = await apiClient.getWebAuthnRegistrationOptions(email);
        
        if (result.success && result.data) {
          // In a real implementation, you'd use the WebAuthn API here
          console.log('WebAuthn options generated:', result.data);
          setError('WebAuthn authentication is ready - implement browser API');
        } else {
          setError(result.error?.message || 'Failed to prepare WebAuthn authentication');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'WebAuthn setup failed');
      }
    } else if (method === 'card') {
      // NFC card authentication
      console.log('Waiting for NFC card...');
      setError('NFC card authentication not yet implemented');
    } else if (method === 'password') {
      // Password authentication
      if (!email || !password) {
        setError('Please enter email and password');
        return;
      }
      
      try {
        await login(email, password);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      }
    }
  };

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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your MFA Card Platform account</p>
        </div>

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

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Passkey Authentication */}
        {authMethod === 'passkey' && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6 text-center">
              <Key className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Use your passkey</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Authenticate using your fingerprint, face, or device PIN
              </p>
              <button
                onClick={() => handleLogin('passkey')}
                disabled={isLoading}
                className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? 'Authenticating...' : 'Authenticate with Passkey'}
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
                disabled={isLoading}
                className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? 'Waiting for card...' : 'Tap NFC Card'}
              </button>
            </div>
          </div>
        )}

        {/* Password Authentication */}
        {authMethod === 'password' && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter your email"
                  disabled={isLoading}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your password"
                    disabled={isLoading}
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
              disabled={isLoading}
              className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Recovery Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can't access your account?{' '}
            <Link href="/recovery" className="text-primary hover:underline">
              Start recovery
            </Link>
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
