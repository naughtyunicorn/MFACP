'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Shield, 
  Fingerprint,
  CreditCard,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  RefreshCw,
  Play,
  ChevronRight
} from 'lucide-react';

type DemoStep = 'intro' | 'passkey' | 'nfc' | 'recovery' | 'complete';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const simulateAuth = (nextStep: DemoStep) => {
    setIsAuthenticating(true);
    setAuthSuccess(false);
    
    setTimeout(() => {
      setAuthSuccess(true);
      setTimeout(() => {
        setCurrentStep(nextStep);
        setIsAuthenticating(false);
        setAuthSuccess(false);
      }, 1000);
    }, 1500);
  };

  const resetDemo = () => {
    setCurrentStep('intro');
    setIsAuthenticating(false);
    setAuthSuccess(false);
  };

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
            
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {['intro', 'passkey', 'nfc', 'recovery', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === step 
                      ? 'bg-primary text-primary-foreground' 
                      : ['intro', 'passkey', 'nfc', 'recovery', 'complete'].indexOf(currentStep) > index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {['intro', 'passkey', 'nfc', 'recovery', 'complete'].indexOf(currentStep) > index ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && (
                  <div className={`w-8 h-0.5 ${
                    ['intro', 'passkey', 'nfc', 'recovery', 'complete'].indexOf(currentStep) > index
                      ? 'bg-emerald-500'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Demo Content */}
          <div className="bg-card border rounded-3xl p-8 lg:p-12 shadow-lg">
            {/* Intro Step */}
            {currentStep === 'intro' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                  <Play className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Interactive Demo</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Experience how MFA Card Platform works. This demo simulates the authentication 
                  flow with passkeys, NFC cards, and recovery codes.
                </p>
                <button
                  onClick={() => setCurrentStep('passkey')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Start Demo
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Passkey Step */}
            {currentStep === 'passkey' && (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all ${
                  isAuthenticating 
                    ? 'bg-blue-100 animate-pulse' 
                    : authSuccess 
                      ? 'bg-emerald-100' 
                      : 'bg-emerald-100'
                }`}>
                  {authSuccess ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  ) : (
                    <Fingerprint className={`h-10 w-10 text-emerald-600 ${isAuthenticating ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-3">Passkey Authentication</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {isAuthenticating 
                    ? 'Verifying your identity...' 
                    : authSuccess 
                      ? 'Authentication successful!' 
                      : 'Use your fingerprint or face to authenticate. This is the fastest and most secure method.'}
                </p>
                
                {!isAuthenticating && !authSuccess && (
                  <div className="space-y-4">
                    <button
                      onClick={() => simulateAuth('nfc')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-medium text-white hover:bg-emerald-700 transition-all w-full max-w-xs mx-auto"
                    >
                      <Fingerprint className="h-5 w-5" />
                      Authenticate with Passkey
                    </button>
                    <p className="text-sm text-muted-foreground">
                      In a real scenario, this would trigger your device's biometric prompt
                    </p>
                  </div>
                )}

                {isAuthenticating && (
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Waiting for device...</span>
                  </div>
                )}
              </div>
            )}

            {/* NFC Step */}
            {currentStep === 'nfc' && (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all ${
                  isAuthenticating 
                    ? 'bg-blue-100 animate-pulse' 
                    : authSuccess 
                      ? 'bg-emerald-100' 
                      : 'bg-blue-100'
                }`}>
                  {authSuccess ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  ) : (
                    <CreditCard className={`h-10 w-10 text-blue-600 ${isAuthenticating ? 'animate-bounce' : ''}`} />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-3">NFC Card Authentication</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {isAuthenticating 
                    ? 'Reading NFC card...' 
                    : authSuccess 
                      ? 'Card authenticated!' 
                      : 'Tap your NFC security card on your device. Perfect for when biometrics aren\'t available.'}
                </p>
                
                {!isAuthenticating && !authSuccess && (
                  <div className="space-y-4">
                    <button
                      onClick={() => simulateAuth('recovery')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700 transition-all w-full max-w-xs mx-auto"
                    >
                      <CreditCard className="h-5 w-5" />
                      Tap NFC Card
                    </button>
                    <p className="text-sm text-muted-foreground">
                      Hold your card near your phone's NFC reader
                    </p>
                  </div>
                )}

                {isAuthenticating && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping delay-100" />
                      <div className="w-3 h-3 rounded-full bg-blue-300 animate-ping delay-200" />
                    </div>
                    <span className="font-medium text-blue-600">Scanning for NFC card...</span>
                  </div>
                )}
              </div>
            )}

            {/* Recovery Step */}
            {currentStep === 'recovery' && (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all ${
                  isAuthenticating 
                    ? 'bg-amber-100 animate-pulse' 
                    : authSuccess 
                      ? 'bg-emerald-100' 
                      : 'bg-amber-100'
                }`}>
                  {authSuccess ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  ) : (
                    <Key className={`h-10 w-10 text-amber-600`} />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-3">Recovery Code</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {isAuthenticating 
                    ? 'Verifying recovery code...' 
                    : authSuccess 
                      ? 'Code verified!' 
                      : 'Enter one of your recovery codes if you\'ve lost access to your other authenticators.'}
                </p>
                
                {!isAuthenticating && !authSuccess && (
                  <div className="space-y-6 max-w-sm mx-auto">
                    <div className="flex gap-2 justify-center">
                      {['A', 'B', 'C', 'D', '-', '1', '2', '3', '4'].map((char, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-lg ${
                            char === '-' ? 'border-transparent' : 'border-border bg-muted'
                          }`}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => simulateAuth('complete')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-8 py-4 text-base font-medium text-white hover:bg-amber-700 transition-all w-full"
                    >
                      <Key className="h-5 w-5" />
                      Verify Recovery Code
                    </button>
                    <p className="text-sm text-muted-foreground">
                      Each code can only be used once
                    </p>
                  </div>
                )}

                {isAuthenticating && (
                  <div className="flex items-center justify-center gap-3 text-amber-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Verifying code...</span>
                  </div>
                )}
              </div>
            )}

            {/* Complete Step */}
            {currentStep === 'complete' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-8">
                  <Unlock className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Demo Complete!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  You've experienced all three authentication methods. In a real account, 
                  you'd have access to your secure dashboard.
                </p>
                
                <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    What You Learned
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Passkeys</strong> provide the fastest, most secure authentication using biometrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>NFC Cards</strong> offer physical security keys you can keep in your wallet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Recovery Codes</strong> ensure you're never locked out of your account</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Create Your Account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={resetDemo}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-8 py-4 text-base font-medium hover:bg-secondary transition-all"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Restart Demo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          {currentStep !== 'intro' && currentStep !== 'complete' && (
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className={`p-4 rounded-xl border transition-all ${
                currentStep === 'passkey' ? 'bg-emerald-50 border-emerald-200' : 'bg-card'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Passkey</span>
                  {currentStep !== 'passkey' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Biometric authentication</p>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                currentStep === 'nfc' ? 'bg-blue-50 border-blue-200' : 'bg-card'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">NFC Card</span>
                  {['recovery', 'complete'].includes(currentStep) && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Physical security key</p>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                currentStep === 'recovery' ? 'bg-amber-50 border-amber-200' : 'bg-card'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Key className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Recovery Code</span>
                </div>
                <p className="text-xs text-muted-foreground">Emergency backup</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">© 2024 MFA Card Platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/security" className="hover:text-foreground transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
