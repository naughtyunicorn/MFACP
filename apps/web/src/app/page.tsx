'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  Check, 
  ChevronRight,
  Fingerprint,
  CreditCard,
  RefreshCw,
  Zap,
  Globe,
  Users,
  Building2,
  Award,
  Activity,
  ShieldCheck,
  KeyRound,
  Layers,
  Eye,
  EyeOff,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">MFA Card</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/features" className="block text-sm font-medium py-2">Features</Link>
              <Link href="/pricing" className="block text-sm font-medium py-2">Pricing</Link>
              <Link href="/security" className="block text-sm font-medium py-2">Security</Link>
              <Link href="/docs" className="block text-sm font-medium py-2">Docs</Link>
              <hr className="border-border" />
              <Link href="/login" className="block text-sm font-medium py-2">Sign In</Link>
              <Link href="/register" className="block w-full text-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <ShieldCheck className="h-4 w-4" />
              <span>Enterprise-Grade Security</span>
              <ChevronRight className="h-4 w-4" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              Never Get Locked Out
              <span className="block text-primary">Of Your Accounts Again</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
              Multi-device authentication combining passkeys, NFC smart cards, and distributed trust. 
              Your security, your control, no single point of failure.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/demo" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-8 py-4 text-base font-medium hover:bg-secondary transition-all"
              >
                <Activity className="h-5 w-5" />
                Watch Demo
              </Link>
            </div>

            {/* Auth Methods Preview */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="font-medium">Passkeys</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">NFC Cards</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-amber-600" />
                </div>
                <span className="font-medium">Recovery Codes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">500+ Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">99.99% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Distributed Trust Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No single device can be the only path into or out of your account
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Fingerprint className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passkey Authentication</h3>
              <p className="text-muted-foreground mb-4">
                Passwordless, phishing-resistant authentication using WebAuthn. Built into modern devices with biometric support.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Biometric</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">WebAuthn</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">NFC Smart Cards</h3>
              <p className="text-muted-foreground mb-4">
                Credit-card shaped security keys for physical authentication and step-up verification when you need extra security.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Physical Key</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">NFC</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <KeyRound className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recovery Codes</h3>
              <p className="text-muted-foreground mb-4">
                Offline backup codes for emergency access. Print them, store them safely, and never worry about lockouts.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Offline</span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Backup</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Engine</h3>
              <p className="text-muted-foreground mb-4">
                Intelligent security monitoring with adaptive authentication based on real-time risk assessment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">AI-Powered</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">Real-time</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Device Sync</h3>
              <p className="text-muted-foreground mb-4">
                Seamlessly manage your authenticators across all your devices with secure end-to-end encrypted sync.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">E2E Encrypted</span>
                <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">Cross-Platform</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 lg:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Recovery</h3>
              <p className="text-muted-foreground mb-4">
                Lost your device? Recover access instantly using your backup authenticators with zero downtime.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-700">Fast</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-700">Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get protected in minutes with our simple setup process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up with your email and create a strong password. Takes less than 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Authenticators</h3>
              <p className="text-muted-foreground">
                Register your passkey, NFC card, or generate recovery codes for backup access.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Stay Protected</h3>
              <p className="text-muted-foreground">
                Enjoy passwordless, phishing-resistant authentication across all your accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Security by Design,
                <span className="text-primary"> Not an Afterthought</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Built with zero-trust principles and enterprise security standards from day one. 
                Every feature is designed to protect you without sacrificing usability.
              </p>
              
              <div className="space-y-4">
                {[
                  'End-to-end encryption for all data',
                  'No single point of failure architecture',
                  'SOC 2 Type II certified infrastructure',
                  'Regular third-party security audits',
                  'GDPR and CCPA compliant'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">0</div>
                <div className="text-sm text-muted-foreground">Single Points of Failure</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-sm text-muted-foreground">AES Encryption</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">99.99%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Security Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Security Teams</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what security professionals say about MFA Card Platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "Finally, a solution that doesn't make me choose between security and usability. Our team adoption rate went from 60% to 98%.",
                author: "Sarah Chen",
                role: "CISO, TechCorp"
              },
              {
                quote: "The distributed trust model means we never worry about lockouts. Even when employees lose their phones, recovery is instant.",
                author: "Michael Torres",
                role: "Security Lead, FinanceApp"
              },
              {
                quote: "We eliminated password-related support tickets entirely. The NFC cards are a game-changer for physical access control too.",
                author: "Emily Watson",
                role: "IT Director, HealthCare Inc"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 lg:p-8 rounded-2xl bg-card border">
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center p-8 lg:p-16 rounded-3xl bg-primary text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Secure Your Digital Life?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who never worry about account lockouts again. 
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background text-foreground px-8 py-4 text-base font-medium hover:bg-background/90 transition-all"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/20 px-8 py-4 text-base font-medium hover:bg-primary-foreground/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MFA Card</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade authentication for everyone. Never get locked out again.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/compliance" className="hover:text-foreground transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              © 2024 MFA Card Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                SOC 2 Certified
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
