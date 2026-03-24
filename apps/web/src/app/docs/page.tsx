'use client';

import Link from 'next/link';
import { 
  Shield, 
  Book, 
  Rocket, 
  Key, 
  CreditCard, 
  Settings, 
  Code, 
  Users,
  Lock,
  ArrowRight,
  Search,
  ChevronRight
} from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      icon: Rocket,
      title: 'Getting Started',
      description: 'Quick start guide to set up your first authenticator',
      links: [
        { title: 'Create Your Account', href: '/docs/getting-started/create-account' },
        { title: 'Set Up Passkeys', href: '/docs/getting-started/passkeys' },
        { title: 'Generate Recovery Codes', href: '/docs/getting-started/recovery-codes' },
        { title: 'Add NFC Card', href: '/docs/getting-started/nfc-card' },
      ]
    },
    {
      icon: Key,
      title: 'Authentication Methods',
      description: 'Learn about different ways to authenticate',
      links: [
        { title: 'Passkey Authentication', href: '/docs/auth/passkeys' },
        { title: 'NFC Smart Cards', href: '/docs/auth/nfc' },
        { title: 'Recovery Codes', href: '/docs/auth/recovery' },
        { title: 'TOTP Apps', href: '/docs/auth/totp' },
      ]
    },
    {
      icon: Settings,
      title: 'Account Management',
      description: 'Manage your devices and security settings',
      links: [
        { title: 'Device Management', href: '/docs/account/devices' },
        { title: 'Security Dashboard', href: '/docs/account/dashboard' },
        { title: 'Activity Logs', href: '/docs/account/activity' },
        { title: 'Account Settings', href: '/docs/account/settings' },
      ]
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Integrate MFA Card into your applications',
      links: [
        { title: 'API Overview', href: '/docs/api/overview' },
        { title: 'Authentication', href: '/docs/api/authentication' },
        { title: 'Endpoints', href: '/docs/api/endpoints' },
        { title: 'Webhooks', href: '/docs/api/webhooks' },
      ]
    },
    {
      icon: Users,
      title: 'Team & Enterprise',
      description: 'Manage authentication for your organization',
      links: [
        { title: 'Team Setup', href: '/docs/team/setup' },
        { title: 'Admin Controls', href: '/docs/team/admin' },
        { title: 'SSO Integration', href: '/docs/team/sso' },
        { title: 'Compliance', href: '/docs/team/compliance' },
      ]
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Security best practices and documentation',
      links: [
        { title: 'Security Model', href: '/docs/security/model' },
        { title: 'Encryption', href: '/docs/security/encryption' },
        { title: 'Compliance', href: '/docs/security/compliance' },
        { title: 'Incident Response', href: '/docs/security/incident-response' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
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
              <Link href="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</Link>
              <Link href="/docs" className="text-sm font-medium text-foreground">Docs</Link>
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
      <section className="py-12 lg:py-20 border-b bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Book className="h-4 w-4" />
              Documentation
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Learn MFA Card Platform
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive guides and documentation to help you get started with 
              MFA Card Platform and integrate it into your applications.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/docs/getting-started/create-account"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border bg-card hover:bg-secondary transition-colors"
            >
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-medium">Quick Start</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link 
              href="/docs/api/overview"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border bg-card hover:bg-secondary transition-colors"
            >
              <Code className="h-5 w-5 text-primary" />
              <span className="font-medium">API Reference</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link 
              href="/docs/auth/passkeys"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border bg-card hover:bg-secondary transition-colors"
            >
              <Key className="h-5 w-5 text-primary" />
              <span className="font-medium">Passkeys Guide</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sections.map((section, index) => (
              <div key={index} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowRight className="h-3 w-3" />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                View Demo
                <ArrowRight className="h-4 w-4" />
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
