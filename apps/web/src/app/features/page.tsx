'use client';

import Link from 'next/link';
import { 
  Shield, 
  Key, 
  Fingerprint, 
  CreditCard, 
  RefreshCw, 
  Zap,
  Lock,
  Activity,
  Smartphone,
  Globe,
  Server,
  Bell,
  Eye,
  CheckCircle2,
  ArrowRight,
  Layers,
  Clock,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">MFA Card</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/features" className="text-sm font-medium text-foreground">Features</Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</Link>
              <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Powerful Features for
              <span className="text-primary"> Modern Security</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to secure your digital identity without compromising on usability. 
              Built for individuals and teams who take security seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Passkeys */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
                <Fingerprint className="h-4 w-4" />
                Primary Authentication
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Passkey Authentication</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Say goodbye to passwords forever. Passkeys use your device's built-in biometrics 
                for the most secure and convenient authentication experience.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Fingerprint, text: 'Biometric authentication (Face ID, Touch ID, Windows Hello)' },
                  { icon: ShieldCheck, text: 'Phishing-resistant by design' },
                  { icon: Zap, text: 'Sign in 3x faster than passwords' },
                  { icon: Globe, text: 'Works across all your devices' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-3xl p-8 lg:p-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 mx-auto mb-8">
                <Fingerprint className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Touch to Authenticate</h3>
                <p className="text-muted-foreground mb-6">Use your fingerprint or face to sign in securely</p>
                <div className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Authentication Complete
                </div>
              </div>
            </div>
          </div>

          {/* NFC Cards */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="order-2 lg:order-1 bg-card border rounded-3xl p-8 lg:p-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100 mx-auto mb-8">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Tap Your Card</h3>
                <p className="text-muted-foreground mb-6">Physical security key in your wallet</p>
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-100" />
                  <div className="w-3 h-3 rounded-full bg-blue-300 animate-pulse delay-200" />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
                <CreditCard className="h-4 w-4" />
                Physical Security
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">NFC Smart Cards</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Credit-card sized security keys that fit in your wallet. Perfect for step-up 
                authentication and scenarios where biometrics aren't available.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: CreditCard, text: 'Slim credit card form factor' },
                  { icon: Lock, text: 'Hardware-backed cryptographic security' },
                  { icon: Smartphone, text: 'Works with any NFC-enabled device' },
                  { icon: RefreshCw, text: 'No batteries, lasts forever' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Codes */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 mb-6">
                <Key className="h-4 w-4" />
                Emergency Access
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Recovery Codes</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Generate one-time backup codes that work when all else fails. Print them, 
                store them in a safe, and never worry about losing access.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Key, text: '10 unique recovery codes generated' },
                  { icon: Lock, text: 'One-time use for maximum security' },
                  { icon: RefreshCw, text: 'Regenerate anytime from dashboard' },
                  { icon: Clock, text: 'Works offline, no network needed' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-3xl p-8 lg:p-12">
              <div className="space-y-3 font-mono text-sm">
                {['ABCD-1234-EFGH', 'IJKL-5678-MNOP', 'QRST-9012-UVWX', 'YZAB-3456-CDEF'].map((code, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span>{code}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pt-4">
                  Store these codes securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">And Much More</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete security platform with everything you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: 'Risk Engine',
                description: 'AI-powered threat detection with adaptive authentication based on real-time risk assessment.'
              },
              {
                icon: Bell,
                title: 'Security Alerts',
                description: 'Real-time notifications for suspicious activity and important security events.'
              },
              {
                icon: Layers,
                title: 'Device Management',
                description: 'Full visibility and control over all devices with access to your account.'
              },
              {
                icon: Server,
                title: 'API Access',
                description: 'RESTful API for integrating MFA Card into your own applications.'
              },
              {
                icon: Users,
                title: 'Team Management',
                description: 'Manage authentication for your entire team with admin controls.'
              },
              {
                icon: Eye,
                title: 'Audit Logs',
                description: 'Complete history of all authentication events for compliance.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your account and set up your first authenticator in under 2 minutes.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">© 2024 MFA Card Platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
