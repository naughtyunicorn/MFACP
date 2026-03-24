'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, Key, Smartphone, Lock, Check, 
  ArrowRight, ArrowLeft, Copy, Download,
  CheckCircle
} from 'lucide-react';

type OnboardingStep = 'welcome' | 'passkey' | 'backup' | 'recovery' | 'complete';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [codesCopied, setCodesCopied] = useState(false);
  const [securityScore, setSecurityScore] = useState(20);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const router = useRouter();

  const steps: { id: OnboardingStep; title: string; number: number }[] = [
    { id: 'welcome', title: 'Welcome', number: 1 },
    { id: 'passkey', title: 'Add Passkey', number: 2 },
    { id: 'backup', title: 'Backup Method', number: 3 },
    { id: 'recovery', title: 'Recovery Codes', number: 4 },
    { id: 'complete', title: 'Complete', number: 5 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handlePasskeySetup = async () => {
    setIsLoading(true);
    // In production, this would call WebAuthn API
    // For now, simulate success
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps(prev => new Set([...prev, 'passkey']));
    setSecurityScore(prev => prev + 30);
    setIsLoading(false);
    setCurrentStep('backup');
  };

  const handleSkipPasskey = () => {
    setCurrentStep('backup');
  };

  const handleGenerateRecoveryCodes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recovery-codes', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.codes) {
        setRecoveryCodes(data.codes);
        setCompletedSteps(prev => new Set([...prev, 'recovery']));
        setSecurityScore(prev => prev + 10);
      }
    } catch (error) {
      console.error('Failed to generate recovery codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCodesCopied(true);
    setTimeout(() => setCodesCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const content = `MFA Card Platform Recovery Codes
Generated: ${new Date().toLocaleDateString()}

IMPORTANT: Each code can only be used once. Keep these codes safe.

${recoveryCodes.join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfa-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStepIndex
                      ? 'bg-security-low text-white'
                      : index === currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStepIndex ? <Check className="h-4 w-4" /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-1 transition-colors ${
                      index < currentStepIndex ? 'bg-security-low' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg border bg-card p-8">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Welcome to MFA Card Platform</h1>
              <p className="text-muted-foreground mb-6">
                Let's set up your account security. This will only take a few minutes.
              </p>
              
              <div className="text-left bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">What we'll set up:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    <span>Passkey for passwordless login</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span>Backup authentication method</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Recovery codes for emergencies</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentStep('passkey')}
                className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Passkey Step */}
          {currentStep === 'passkey' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Add a Passkey</h1>
              <p className="text-muted-foreground mb-6">
                Passkeys are the most secure way to sign in. They use your device's built-in security like fingerprint or Face ID.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium mb-2">Why use passkeys?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>- Phishing-resistant authentication</li>
                  <li>- No passwords to remember</li>
                  <li>- Works across devices with sync</li>
                  <li>- Faster than traditional login</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePasskeySetup}
                  disabled={isLoading}
                  className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? 'Setting up...' : 'Create Passkey'}
                </button>
                <button
                  onClick={handleSkipPasskey}
                  className="auth-button w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* Backup Method Step */}
          {currentStep === 'backup' && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Add Backup Method</h1>
                <p className="text-muted-foreground">
                  Choose a backup authentication method in case you can't use your primary one.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  className="w-full p-4 rounded-lg border hover:bg-accent transition-colors text-left flex items-center gap-4"
                  onClick={() => {
                    setCompletedSteps(prev => new Set([...prev, 'backup']));
                    setSecurityScore(prev => prev + 20);
                    setCurrentStep('recovery');
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">NFC Card</h3>
                    <p className="text-sm text-muted-foreground">Physical security key for tap-to-login</p>
                  </div>
                </button>

                <button
                  className="w-full p-4 rounded-lg border hover:bg-accent transition-colors text-left flex items-center gap-4"
                  onClick={() => {
                    setCompletedSteps(prev => new Set([...prev, 'backup']));
                    setSecurityScore(prev => prev + 15);
                    setCurrentStep('recovery');
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-medium/10">
                    <Lock className="h-5 w-5 text-security-medium" />
                  </div>
                  <div>
                    <h3 className="font-medium">Authenticator App</h3>
                    <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setCurrentStep('recovery')}
                className="auth-button w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Recovery Codes Step */}
          {currentStep === 'recovery' && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-security-high/10">
                  <Lock className="h-8 w-8 text-security-high" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Recovery Codes</h1>
                <p className="text-muted-foreground">
                  Generate backup codes for emergency account access.
                </p>
              </div>

              {recoveryCodes.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-security-high/10 border border-security-high/20 rounded-lg p-4 text-sm">
                    <p className="font-medium text-security-high mb-1">Important</p>
                    <p className="text-muted-foreground">
                      Recovery codes are single-use and should be stored securely. They're your last resort if you lose access to all other methods.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGenerateRecoveryCodes}
                    disabled={isLoading}
                    className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoading ? 'Generating...' : 'Generate Recovery Codes'}
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('complete')}
                    className="auth-button w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Skip for now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {recoveryCodes.map((code, index) => (
                        <div key={index} className="py-1">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCodes}
                      className="auth-button flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      {codesCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {codesCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadCodes}
                      className="auth-button flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" id="saved" className="mt-1" required />
                    <label htmlFor="saved" className="text-muted-foreground">
                      I have saved these codes in a secure location
                    </label>
                  </div>

                  <button
                    onClick={() => setCurrentStep('complete')}
                    className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-security-low/10">
                <CheckCircle className="h-8 w-8 text-security-low" />
              </div>
              <h1 className="text-2xl font-bold mb-2">You're All Set!</h1>
              <p className="text-muted-foreground mb-6">
                Your account is now protected with multiple layers of security.
              </p>

              {/* Security Score */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-security-low mb-2">{securityScore}%</div>
                <p className="text-sm text-muted-foreground mb-4">Security Score</p>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className="h-2 bg-security-low rounded-full transition-all duration-500"
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </div>

              {/* Completed Items */}
              <div className="text-left mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`h-4 w-4 ${completedSteps.has('passkey') ? 'text-security-low' : 'text-muted-foreground'}`} />
                  <span className={completedSteps.has('passkey') ? '' : 'text-muted-foreground'}>
                    Passkey {completedSteps.has('passkey') ? 'configured' : 'skipped'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`h-4 w-4 ${completedSteps.has('backup') ? 'text-security-low' : 'text-muted-foreground'}`} />
                  <span className={completedSteps.has('backup') ? '' : 'text-muted-foreground'}>
                    Backup method {completedSteps.has('backup') ? 'configured' : 'skipped'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`h-4 w-4 ${completedSteps.has('recovery') ? 'text-security-low' : 'text-muted-foreground'}`} />
                  <span className={completedSteps.has('recovery') ? '' : 'text-muted-foreground'}>
                    Recovery codes {completedSteps.has('recovery') ? 'generated' : 'skipped'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={goToDashboard}
                  className="auth-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/dashboard/authenticators"
                  className="auth-button w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex"
                >
                  Add More Security Methods
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <button
            onClick={() => {
              const prevIndex = currentStepIndex - 1;
              if (prevIndex >= 0) {
                setCurrentStep(steps[prevIndex].id);
              }
            }}
            className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
