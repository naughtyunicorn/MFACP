'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RecoveryPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/recovery-codes/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify email')
      }

      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/recovery-codes/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: recoveryCode }),
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid recovery code')
      }

      setStep('success')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Account Recovery</h1>
          <p className="text-muted-foreground mt-2">
            {step === 'email' && 'Enter your email to begin recovery'}
            {step === 'code' && 'Enter one of your recovery codes'}
            {step === 'success' && 'Recovery successful!'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['email', 'code', 'success'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : ['email', 'code', 'success'].indexOf(step) > i
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 mx-1 ${
                    ['email', 'code', 'success'].indexOf(step) > i
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                  Recovery Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-mono text-center text-lg tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="XXXX-XXXX-XXXX"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter one of the recovery codes you saved when setting up your account
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Recover Account'}
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
              >
                Back
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Recovery Successful</h3>
              <p className="text-muted-foreground text-sm">
                Redirecting you to the dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Remember your credentials?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
