'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { 
  Key, Smartphone, Lock, Plus, Trash2, 
  CheckCircle, AlertCircle
} from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export default function AuthenticatorsPage() {
  const { data, error, isLoading } = useSWR('/api/authenticators', fetcher);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const authenticators = data?.authenticators || [];
  const webauthn = data?.webauthn || [];
  const totp = data?.totp || [];
  const recoveryCodes = data?.recoveryCodes || { total: 0, unused: 0 };

  const handleRemove = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to remove this authenticator?')) return;
    
    setDeleting(id);
    setErrorMsg('');

    try {
      const response = await fetch(`/api/authenticators?id=${id}&type=${type}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      
      if (!response.ok) {
        setErrorMsg(result.error || 'Failed to remove authenticator');
      } else {
        mutate('/api/authenticators');
        mutate('/api/auth/me');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred');
    } finally {
      setDeleting(null);
    }
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never used';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Authenticators</h1>
          <p className="text-muted-foreground">Manage your authentication methods</p>
        </div>
        <Link
          href="/dashboard/authenticators/add"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Authenticator
        </Link>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Passkeys Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Passkeys</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Passwordless authentication using your device&apos;s security
          </p>
        </div>
        <div className="p-4">
          {webauthn.length === 0 ? (
            <div className="text-center py-6">
              <Key className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No passkeys registered</p>
              <Link
                href="/dashboard/authenticators/add?type=passkey"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                Add Passkey
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {webauthn.map((cred: any) => (
                <div key={cred.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cred.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last used {formatTimeAgo(cred.lastUsedAt)}
                        {cred.isBackup && ' - Backup method'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                    <button
                      onClick={() => handleRemove(cred.id, 'webauthn')}
                      disabled={deleting === cred.id}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOTP Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-security-medium" />
            <h2 className="font-semibold">Authenticator Apps</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Time-based one-time passwords (TOTP)
          </p>
        </div>
        <div className="p-4">
          {totp.length === 0 ? (
            <div className="text-center py-6">
              <Smartphone className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No authenticator apps configured</p>
              <Link
                href="/dashboard/authenticators/add?type=totp"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                Add Authenticator App
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {totp.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-medium/10">
                      <Smartphone className="h-5 w-5 text-security-medium" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last used {formatTimeAgo(t.lastUsedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                    <button
                      onClick={() => handleRemove(t.id, 'totp')}
                      disabled={deleting === t.id}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recovery Codes Section */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-security-high" />
            <h2 className="font-semibold">Recovery Codes</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Single-use backup codes for emergency access
          </p>
        </div>
        <div className="p-4">
          {recoveryCodes.total === 0 ? (
            <div className="text-center py-6">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No recovery codes generated</p>
              <Link
                href="/dashboard/recovery"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                Generate Recovery Codes
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-high/10">
                  <Lock className="h-5 w-5 text-security-high" />
                </div>
                <div>
                  <h3 className="font-medium">Recovery Codes</h3>
                  <p className="text-sm text-muted-foreground">
                    {recoveryCodes.unused} of {recoveryCodes.total} codes remaining
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {recoveryCodes.unused < 3 ? (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-high/10 text-security-high text-xs font-medium">
                    <AlertCircle className="h-3 w-3" />
                    Low
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </span>
                )}
                <Link
                  href="/dashboard/recovery"
                  className="text-sm text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
