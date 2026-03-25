'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { 
  Shield, Key, Smartphone, Lock, Activity, 
  Plus, AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export default function DashboardPage() {
  const { data: userData, error: userError, isLoading: userLoading } = useSWR('/api/auth/me', fetcher);
  const { data: eventsData } = useSWR('/api/security-events?limit=5', fetcher);
  const { data: authData } = useSWR('/api/authenticators', fetcher);

  const user = userData?.user;
  const stats = userData?.stats;
  const events = eventsData?.events || [];
  const authenticators = authData?.authenticators || [];
  const totpAuths = authData?.totp || [];
  const webauthnAuths = authData?.webauthn || [];

  // Calculate security score based on authenticators
  const hasPassword = true; // If they logged in, they have a password or passkey
  const hasMfa = totpAuths.length > 0 || webauthnAuths.length > 0;
  const hasBackupCodes = (authData?.recoveryCodes?.unused || 0) > 0;
  const hasMultipleAuth = (totpAuths.length + webauthnAuths.length) >= 2;
  
  let securityScore = 40; // Base score for having an account
  if (hasMfa) securityScore += 30;
  if (hasBackupCodes) securityScore += 15;
  if (hasMultipleAuth) securityScore += 15;

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-security-low" />;
      case 'FAILURE': return <AlertTriangle className="h-4 w-4 text-security-high" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-security-medium" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-4">Please try refreshing the page or logging in again.</p>
        <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Sign In
        </Link>
      </div>
    );
  }

  const allAuthenticators = [
    ...totpAuths.map((t: any) => ({ ...t, type: 'TOTP' })),
    ...webauthnAuths.map((w: any) => ({ ...w, type: 'WEBAUTHN' })),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user.display_name || user.email}</p>
        </div>
        <Link
          href="/dashboard/authenticators"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Authenticator
        </Link>
      </div>

      {/* Security Score Card */}
      <div className={`rounded-lg border p-6 ${securityScore >= 70 ? 'border-security-low/30 bg-security-low/5' : securityScore >= 50 ? 'border-security-medium/30 bg-security-medium/5' : 'border-security-high/30 bg-security-high/5'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${securityScore >= 70 ? 'bg-security-low/10' : securityScore >= 50 ? 'bg-security-medium/10' : 'bg-security-high/10'}`}>
              <Shield className={`h-7 w-7 ${securityScore >= 70 ? 'text-security-low' : securityScore >= 50 ? 'text-security-medium' : 'text-security-high'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Account Protection</h2>
              <p className="text-sm text-muted-foreground">
                {securityScore >= 70 ? 'Your account is well protected' : 
                 securityScore >= 50 ? 'Your account has moderate protection' : 
                 'Your account needs more protection'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-3xl font-bold ${securityScore >= 70 ? 'text-security-low' : securityScore >= 50 ? 'text-security-medium' : 'text-security-high'}`}>{securityScore}%</div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${securityScore >= 70 ? 'bg-security-low/10 text-security-low' : securityScore >= 50 ? 'bg-security-medium/10 text-security-medium' : 'bg-security-high/10 text-security-high'}`}>
                {securityScore >= 70 ? 'Protected' : securityScore >= 50 ? 'Moderate' : 'At Risk'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Security Score</span>
            <span className="font-medium">{securityScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${securityScore >= 70 ? 'bg-security-low' : securityScore >= 50 ? 'bg-security-medium' : 'bg-security-high'}`}
              style={{ width: `${securityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Key className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{allAuthenticators.length}</span>
          </div>
          <h3 className="font-semibold mb-1">Active Authenticators</h3>
          <p className="text-sm text-muted-foreground">
            {allAuthenticators.length >= 2 ? 'Multiple methods configured' : 'Add more methods for better protection'}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Smartphone className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{stats?.device_count || 0}</span>
          </div>
          <h3 className="font-semibold mb-1">Trusted Devices</h3>
          <p className="text-sm text-muted-foreground">Registered devices</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Lock className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{authData?.recoveryCodes?.unused || 0}</span>
          </div>
          <h3 className="font-semibold mb-1">Recovery Codes</h3>
          <p className="text-sm text-muted-foreground">Available backup codes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link 
            href="/dashboard/authenticators"
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Add Authenticator</h3>
                <p className="text-sm text-muted-foreground">Set up TOTP or passkey</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link 
            href="/dashboard/settings"
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-medium/10">
                <Lock className="h-5 w-5 text-security-medium" />
              </div>
              <div>
                <h3 className="font-medium">Recovery Codes</h3>
                <p className="text-sm text-muted-foreground">Generate backup codes</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link 
            href="/dashboard/activity" 
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {events.map((event: any) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(event.status)}
                  <div>
                    <p className="text-sm font-medium">{event.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.ipAddress || 'Unknown location'} - {formatTimeAgo(event.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium uppercase ${event.status === 'SUCCESS' ? 'text-security-low' : 'text-security-high'}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Authenticators List */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Authenticators</h2>
          <Link 
            href="/dashboard/authenticators" 
            className="text-sm text-primary hover:underline"
          >
            Manage
          </Link>
        </div>
        {allAuthenticators.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No authenticators set up yet</p>
            <Link 
              href="/dashboard/authenticators"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add Your First Authenticator
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allAuthenticators.slice(0, 3).map((auth: any) => (
              <div 
                key={auth.id} 
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {auth.type === 'WEBAUTHN' ? <Key className="h-5 w-5 text-primary" /> :
                     auth.type === 'TOTP' ? <Smartphone className="h-5 w-5 text-primary" /> :
                     <Lock className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{auth.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {auth.type.toLowerCase()} - {auth.lastUsedAt ? `Last used ${formatTimeAgo(auth.lastUsedAt)}` : 'Never used'}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
