'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, AlertCircle, Check, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordValid = passwordChecks.length && passwordChecks.lowercase && passwordChecks.uppercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet the requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Start securing your digital identity</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
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
                placeholder="Create a strong password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level
                          ? passwordStrength <= 2
                            ? 'bg-destructive'
                            : passwordStrength <= 3
                            ? 'bg-security-medium'
                            : 'bg-security-low'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-security-low' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${passwordChecks.length ? 'opacity-100' : 'opacity-30'}`} />
                    8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordChecks.uppercase ? 'text-security-low' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${passwordChecks.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                    Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordChecks.lowercase ? 'text-security-low' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${passwordChecks.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                    Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-security-low' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${passwordChecks.number ? 'opacity-100' : 'opacity-30'}`} />
                    Number
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Confirm your password"
              disabled={isLoading}
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-input"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid}
            className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              'Creating account...'
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
