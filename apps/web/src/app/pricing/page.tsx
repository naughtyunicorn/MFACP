'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Shield, 
  Check, 
  X,
  ArrowRight,
  Zap,
  Building2,
  Users,
  HelpCircle
} from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'For individuals getting started with secure authentication.',
      price: { monthly: 0, annual: 0 },
      features: [
        { text: '1 passkey', included: true },
        { text: '5 recovery codes', included: true },
        { text: 'Basic security dashboard', included: true },
        { text: 'Email support', included: true },
        { text: 'NFC card support', included: false },
        { text: 'Team management', included: false },
        { text: 'API access', included: false },
        { text: 'Audit logs', included: false },
      ],
      cta: 'Get Started',
      href: '/register',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For individuals who want comprehensive security.',
      price: { monthly: 9, annual: 7 },
      features: [
        { text: 'Unlimited passkeys', included: true },
        { text: 'Unlimited recovery codes', included: true },
        { text: 'Full security dashboard', included: true },
        { text: 'Priority email support', included: true },
        { text: '2 NFC cards included', included: true },
        { text: 'Device management', included: true },
        { text: 'API access', included: false },
        { text: '30-day audit logs', included: true },
      ],
      cta: 'Start Free Trial',
      href: '/register?plan=pro',
      popular: true
    },
    {
      name: 'Team',
      description: 'For teams and organizations with advanced needs.',
      price: { monthly: 19, annual: 15 },
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Up to 50 team members', included: true },
        { text: 'Admin controls', included: true },
        { text: 'Phone + chat support', included: true },
        { text: '5 NFC cards per user', included: true },
        { text: 'SSO integration', included: true },
        { text: 'Full API access', included: true },
        { text: '1-year audit logs', included: true },
      ],
      cta: 'Start Free Trial',
      href: '/register?plan=team',
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom requirements.',
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        { text: 'Everything in Team', included: true },
        { text: 'Unlimited team members', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Custom NFC cards', included: true },
        { text: 'On-premise deployment', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'Unlimited audit logs', included: true },
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'What happens after the free trial?',
      answer: 'After your 14-day free trial, you can choose to upgrade to a paid plan or continue with our Free tier. No credit card required to start.'
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and wire transfers for Enterprise customers. All payments are processed securely through Stripe.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer: 'Yes! Nonprofits and educational institutions receive 50% off any plan. Contact us with proof of status to apply the discount.'
    },
    {
      question: 'How does team billing work?',
      answer: 'Team plans are billed per user. You can add or remove users anytime, and we\'ll adjust your billing accordingly.'
    }
  ];

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
              <Link href="/pricing" className="text-sm font-medium text-foreground">Pricing</Link>
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
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Choose the plan that fits your needs. All plans include our core security features.
              Start free, upgrade when you're ready.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !annual ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  annual ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Annual
                <span className="ml-2 text-xs text-emerald-600 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl border p-6 lg:p-8 ${
                  plan.popular 
                    ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                    : 'bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      <Zap className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {typeof plan.price.monthly === 'number' ? (
                    <>
                      <span className="text-4xl font-bold">
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                      {annual && plan.price.annual > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed annually
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold">Custom</span>
                  )}
                </div>

                <Link
                  href={plan.href}
                  className={`block w-full text-center rounded-lg px-4 py-3 text-sm font-medium transition-colors mb-6 ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-muted-foreground">A detailed comparison of all available features</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium">Pro</th>
                  <th className="text-center py-4 px-4 font-medium">Team</th>
                  <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: 'Passkeys', free: '1', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Recovery Codes', free: '5', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'NFC Cards', free: false, pro: '2', team: '5/user', enterprise: 'Custom' },
                  { feature: 'Devices', free: '2', pro: '10', team: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Team Members', free: '-', pro: '-', team: '50', enterprise: 'Unlimited' },
                  { feature: 'API Access', free: false, pro: false, team: true, enterprise: true },
                  { feature: 'SSO Integration', free: false, pro: false, team: true, enterprise: true },
                  { feature: 'Audit Log Retention', free: '7 days', pro: '30 days', team: '1 year', enterprise: 'Unlimited' },
                  { feature: 'Priority Support', free: false, pro: true, team: true, enterprise: true },
                  { feature: 'Custom Branding', free: false, pro: false, team: false, enterprise: true },
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.free}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.pro}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.team === 'boolean' ? (
                        row.team ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.team}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our pricing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border bg-card">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Our team is here to help. Get in touch and we'll answer all your questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Contact Sales
              </Link>
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                View Documentation
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
