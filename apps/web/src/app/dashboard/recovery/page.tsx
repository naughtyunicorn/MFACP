'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Lock, Copy, Download, RefreshCw, AlertTriangle, Check, Shield } from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export default function RecoveryPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/recovery-codes', fetcher);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const recoveryCodes = data?.recoveryCodes || [];
  const unusedCount = recoveryCodes.filter((c: any) => !c.used).length;

  const handleGenerateCodes = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/recovery-codes', {
        method: 'POST',
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok && result.codes) {
        setNewCodes(result.codes);
        mutate();
      }
    } catch (error) {
      console.error('Failed to generate recovery codes:', error);
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCopyCodes = () => {
    if (newCodes) {
      navigator.clipboard.writeText(newCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCodes = () => {
    if (newCodes) {
      const content = `MFA Card Platform Recovery Codes
Generated: ${new Date().toLocaleDateString()}

IMPORTANT: Each code can only be used once. Keep these codes safe and secure.

${newCodes.join('\n')}
`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mfa-recovery-codes.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Recovery Codes</h1>
        <p className="text-muted-foreground">
          Generate and manage backup codes for account recovery
        </p>
      </div>

      {/* Status Card */}
      <div className={`rounded-lg border p-6 ${unusedCount > 3 ? 'border-security-low/30 bg-security-low/5' : unusedCount > 0 ? 'border-security-medium/30 bg-security-medium/5' : 'border-security-high/30 bg-security-high/5'}`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${unusedCount > 3 ? 'bg-security-low/10' : unusedCount > 0 ? 'bg-security-medium/10' : 'bg-security-high/10'}`}>
            <Lock className={`h-6 w-6 ${unusedCount > 3 ? 'text-security-low' : unusedCount > 0 ? 'text-security-medium' : 'text-security-high'}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Recovery Code Status</h2>
            {unusedCount > 0 ? (
              <p className="text-muted-foreground">
                You have <span className="font-semibold">{unusedCount}</span> unused recovery code{unusedCount !== 1 ? 's' : ''} remaining.
              </p>
            ) : (
              <p className="text-muted-foreground">
                You have no recovery codes. Generate new codes to secure your account.
              </p>
            )}
            {unusedCount <= 3 && unusedCount > 0 && (
              <p className="text-sm text-security-medium mt-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Consider generating new codes soon.
              </p>
            )}
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${unusedCount > 3 ? 'text-security-low' : unusedCount > 0 ? 'text-security-medium' : 'text-security-high'}`}>
              {unusedCount}
            </span>
            <p className="text-sm text-muted-foreground">codes left</p>
          </div>
        </div>
      </div>

      {/* New Codes Display */}
      {newCodes && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your New Recovery Codes</h2>
          </div>
          
          <div className="bg-muted rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {newCodes.map((code, index) => (
                <div key={index} className="bg-background rounded px-3 py-2">
                  {code}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-security-medium/10 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-security-medium flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-security-medium">Important</p>
                <p className="text-muted-foreground">
                  Save these codes in a secure location. Each code can only be used once, 
                  and they won&apos;t be shown again after you leave this page.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCopyCodes}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Codes'}
            </button>
            <button
              onClick={handleDownloadCodes}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Generate New Codes */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-2">Generate New Codes</h2>
        <p className="text-muted-foreground mb-4">
          {recoveryCodes.length > 0 
            ? 'Generating new codes will invalidate all your existing recovery codes.'
            : 'Generate recovery codes to ensure you can always access your account.'}
        </p>
        
        {showConfirmDialog ? (
          <div className="bg-security-high/5 border border-security-high/20 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-security-high flex-shrink-0" />
              <div>
                <p className="font-medium">Are you sure?</p>
                <p className="text-sm text-muted-foreground">
                  This will permanently invalidate all your existing recovery codes.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateCodes}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-lg bg-security-high px-4 py-2 text-sm font-medium text-white hover:bg-security-high/90 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Yes, Generate New Codes'
                )}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => recoveryCodes.length > 0 ? setShowConfirmDialog(true) : handleGenerateCodes()}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate New Codes
              </>
            )}
          </button>
        )}
      </div>

      {/* Existing Codes List */}
      {recoveryCodes.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Existing Codes</h2>
          <div className="space-y-2">
            {recoveryCodes.map((code: any) => (
              <div 
                key={code.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${code.used ? 'bg-muted/50 opacity-60' : ''}`}
              >
                <span className="font-mono">{code.code}</span>
                {code.used ? (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    Used
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-security-low/10 text-security-low">
                    Available
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Tips for Storing Recovery Codes</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-security-low flex-shrink-0 mt-0.5" />
            Store codes in a password manager as a secure note
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-security-low flex-shrink-0 mt-0.5" />
            Print and store in a secure physical location like a safe
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-security-low flex-shrink-0 mt-0.5" />
            Keep a copy with a trusted family member or in a safety deposit box
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-security-medium flex-shrink-0 mt-0.5" />
            Never store codes in plain text on your computer or in email
          </li>
        </ul>
      </div>
    </div>
  );
}
