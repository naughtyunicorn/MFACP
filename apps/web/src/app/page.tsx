import Link from 'next/link';
import { Shield, Key, Smartphone, Lock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MFA Card Platform</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Sign In
              </Link>
              <Link href="/register" className="auth-button bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Shield className="h-4 w-4" />
              Enterprise-Grade Security
            </div>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Never Get Locked Out Again
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Multi-device authentication platform combining passkeys, NFC smart cards, and distributed trust. 
            Your security, your control, no single point of failure.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
            <Link href="/register" className="auth-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/demo" className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Distributed Trust Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No single device can be the only path into or out of your account
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="security-card low p-6 rounded-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-security-low/10">
              <Key className="h-6 w-6 text-security-low" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Passkeys</h3>
            <p className="text-sm text-muted-foreground">
              Primary authentication using WebAuthn. Passwordless, phishing-resistant, and built into modern devices.
            </p>
          </div>
          
          <div className="security-card medium p-6 rounded-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-security-medium/10">
              <Smartphone className="h-6 w-6 text-security-medium" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">NFC Smart Cards</h3>
            <p className="text-sm text-muted-foreground">
              Credit-card shaped security keys for physical authentication and step-up verification.
            </p>
          </div>
          
          <div className="security-card high p-6 rounded-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-security-high/10">
              <Lock className="h-6 w-6 text-security-high" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Recovery Codes</h3>
            <p className="text-sm text-muted-foreground">
              Offline backup codes for emergency access when all devices are unavailable.
            </p>
          </div>
          
          <div className="security-card p-6 rounded-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Risk Engine</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent security monitoring and adaptive authentication based on risk assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Security by Design</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with zero-trust principles and enterprise security standards
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-primary">0</div>
              <h3 className="mb-2 text-lg font-semibold">Single Points of Failure</h3>
              <p className="text-sm text-muted-foreground">
                Distributed trust means no single device compromise can lock you out
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-primary">256-bit</div>
              <h3 className="mb-2 text-lg font-semibold">Encryption</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption for all authentication data and communications
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-primary">24/7</div>
              <h3 className="mb-2 text-lg font-semibold">Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Continuous security event monitoring and real-time threat detection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Secure Your Digital Life?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users who never worry about account lockouts again.
          </p>
          <Link href="/register" className="auth-button bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">MFA Card Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MFA Card Platform. Enterprise-grade authentication for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
