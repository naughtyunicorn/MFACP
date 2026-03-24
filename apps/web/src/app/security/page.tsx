'use client';

import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Server,
  Eye,
  FileCheck,
  Globe,
  Key,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Database,
  Cloud,
  Users
} from 'lucide-react';

export default function SecurityPage() {
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
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/security" className="text-sm font-medium text-foreground">Security</Link>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
              <ShieldCheck className="h-4 w-4" />
              Security First
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Security is Not an Afterthought,
              <span className="text-primary"> It's Our Foundation</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Every feature, every line of code, every decision is made with security in mind. 
              Learn how we protect your digital identity.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-xl border">
              <FileCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-sm">SOC 2 Type II</div>
                <div className="text-xs text-muted-foreground">Certified</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-xl border">
              <Globe className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">GDPR</div>
                <div className="text-xs text-muted-foreground">Compliant</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-xl border">
              <Lock className="h-6 w-6 text-purple-600" />
              <div>
                <div className="font-semibold text-sm">256-bit AES</div>
                <div className="text-xs text-muted-foreground">Encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-xl border">
              <Eye className="h-6 w-6 text-amber-600" />
              <div>
                <div className="font-semibold text-sm">24/7</div>
                <div className="text-xs text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero Trust Architecture */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Zero Trust Architecture
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We never assume trust. Every request is verified, every action is logged, 
                and every access point is secured. Our distributed trust model ensures 
                no single point of failure.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Key,
                    title: 'No Single Point of Failure',
                    description: 'Multiple authentication methods ensure you always have access to your account.'
                  },
                  {
                    icon: RefreshCw,
                    title: 'Continuous Verification',
                    description: 'Sessions are continuously validated and suspicious activity triggers re-authentication.'
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Minimal Attack Surface',
                    description: 'Every component is isolated and access is restricted to the minimum necessary.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-4" />
                <h3 className="font-semibold mb-2">Verify</h3>
                <p className="text-sm text-muted-foreground">Every request is authenticated and authorized</p>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                <Lock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Encrypt</h3>
                <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest</p>
              </div>
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200">
                <Eye className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Monitor</h3>
                <p className="text-sm text-muted-foreground">24/7 real-time threat detection</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                <Shield className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="font-semibold mb-2">Protect</h3>
                <p className="text-sm text-muted-foreground">Automated response to threats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Encryption & Data Protection */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Data Protection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your data is protected with industry-leading encryption and security practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-card border text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">End-to-End Encryption</h3>
              <p className="text-muted-foreground mb-4">
                All sensitive data is encrypted with AES-256 before it leaves your device. 
                We can't read your data even if we wanted to.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  AES-256 encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Client-side key generation
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
              <p className="text-muted-foreground mb-4">
                Data at rest is encrypted and stored across geographically distributed 
                data centers with multiple redundancy layers.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Encrypted at rest
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Geographic redundancy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Regular backups
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Cloud className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Transit</h3>
              <p className="text-muted-foreground mb-4">
                All communications use TLS 1.3 with perfect forward secrecy. 
                Certificate pinning prevents man-in-the-middle attacks.
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  TLS 1.3 only
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Perfect forward secrecy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Certificate pinning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Security */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-card border">
                  <Fingerprint className="h-8 w-8 text-emerald-600 mb-4" />
                  <h3 className="font-semibold mb-2">WebAuthn</h3>
                  <p className="text-sm text-muted-foreground">FIDO2 compliant passkey authentication</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border">
                  <Key className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold mb-2">Hardware Keys</h3>
                  <p className="text-sm text-muted-foreground">NFC and USB security key support</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border col-span-2">
                  <Shield className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold mb-2">Phishing Resistance</h3>
                  <p className="text-sm text-muted-foreground">
                    Origin-bound credentials that cannot be phished or replayed
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Authentication Security
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We use the most secure authentication standards available. Passkeys and 
                hardware security keys are inherently phishing-resistant because they're 
                bound to the specific website origin.
              </p>
              
              <div className="space-y-4">
                {[
                  'FIDO2/WebAuthn certified implementation',
                  'Cryptographic binding to device and origin',
                  'No shared secrets that can be stolen',
                  'Biometric authentication never leaves device',
                  'Hardware-backed key storage'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Compliance & Certifications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards of security compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'SOC 2 Type II', description: 'Annual audit of security controls', icon: FileCheck },
              { title: 'GDPR', description: 'EU data protection compliance', icon: Globe },
              { title: 'CCPA', description: 'California privacy compliance', icon: Users },
              { title: 'ISO 27001', description: 'Information security management', icon: Shield }
            ].map((cert, index) => (
              <div key={index} className="p-6 rounded-2xl bg-card border text-center">
                <cert.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Security Practices</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our security program goes beyond compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Regular Penetration Testing',
                description: 'Third-party security experts test our systems quarterly to identify vulnerabilities.'
              },
              {
                title: 'Bug Bounty Program',
                description: 'We reward security researchers who responsibly disclose vulnerabilities.'
              },
              {
                title: 'Security Training',
                description: 'All employees complete regular security awareness training.'
              },
              {
                title: 'Incident Response',
                description: '24/7 security team with documented incident response procedures.'
              },
              {
                title: 'Code Review',
                description: 'All code changes require security review before deployment.'
              },
              {
                title: 'Access Control',
                description: 'Least-privilege access with regular access reviews and audit logs.'
              }
            ].map((practice, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl border bg-card">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{practice.title}</h3>
                  <p className="text-sm text-muted-foreground">{practice.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Security Questions?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Our security team is happy to answer any questions about how we protect your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background text-foreground px-8 py-4 text-base font-medium hover:bg-background/90 transition-all"
              >
                Contact Security Team
              </Link>
              <Link 
                href="/docs/security" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/20 px-8 py-4 text-base font-medium hover:bg-primary-foreground/10 transition-all"
              >
                Security Documentation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
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
