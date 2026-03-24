'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { 
  Key, Smartphone, Lock, Plus, Trash2, 
  CheckCircle, AlertCircle, MoreVertical 
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AuthenticatorsPage() {
  const { data, error, isLoading } = useSWR('/api/authenticators', fetcher);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error2, setError2] = useState('');

  const authenticators = data?.data?.authenticators || [];
  const webauthn = data?.data?.webauthn || [];
  const totp = data?.data?.totp || [];
  const recoveryCodes = data?.data?.recoveryCodes || [];

  const handleRemove = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to remove this authenticator?')) return;
    
    setDeleting(id);
    setError2('');

    try {
      const response = await fetch(`/api/authenticators?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!result.success) {
        setError2(result.error?.message || 'Failed to remove authenticator');
      } else {
        mutate('/api/authenticators');
        mutate('/api/auth/me');
      }
    } catch (err) {
      setError2('An unexpected error occurred');
    } finally {
      setDeleting(null);
    }
  };

  const getAuthIcon = (type: string) => {
    switch (type) {
      case 'WEBAUTHN': return <Key className="h-5 w-5 text-primary" />;
      case 'TOTP': return <Smartphone className="h-5 w-5 text-security-medium" />;
      case 'SMART_CARD': return <Smartphone className="h-5 w-5 text-primary" />;
      case 'RECOVERY_CODE': return <Lock className="h-5 w-5 text-security-high" />;
      default: return <Key className="h-5 w-5 text-primary" />;
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
          className="auth-button bg-primary text-primary-foreground hover:bg-primary/90 inline-flex"
        >
          <Plus className="h-4 w-4" />
          Add Authenticator
        </Link>
      </div>

      {/* Error Message */}
      {error2 && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error2}
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
            Passwordless authentication using your device's security
          </p>
        </div>
        <div className="p-4">
          {webauthn.length === 0 ? (
            <div className="text-center py-6">
              <Key className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No passkeys registered</p>
              <Link
                href="/dashboard/authenticators/add?type=passkey"
                className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex text-sm"
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
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
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
                className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex text-sm"
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
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
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
          {recoveryCodes.length === 0 ? (
            <div className="text-center py-6">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No recovery codes generated</p>
              <Link
                href="/dashboard/recovery"
                className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex text-sm"
              >
                Generate Recovery Codes
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recoveryCodes.map((batch: any) => (
                <div key={batch.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-high/10">
                      <Lock className="h-5 w-5 text-security-high" />
                    </div>
                    <div>
                      <h3 className="font-medium">{batch.batchName || 'Recovery Codes'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {batch.codesRemaining} of {batch.codesGenerated} codes remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {batch.codesRemaining < 3 ? (
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
                      Regenerate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
