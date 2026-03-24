'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { 
  Smartphone, Monitor, Tablet, HelpCircle, 
  CheckCircle, AlertCircle, Trash2, Shield
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DevicesPage() {
  const { data, error, isLoading } = useSWR('/api/devices', fetcher);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error2, setError2] = useState('');

  const devices = data?.data || [];

  const handleRevoke = async (deviceId: string) => {
    if (!confirm('Are you sure you want to revoke this device? All sessions on this device will be terminated.')) return;
    
    setRevoking(deviceId);
    setError2('');

    try {
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!result.success) {
        setError2(result.error?.message || 'Failed to revoke device');
      } else {
        mutate('/api/devices');
        mutate('/api/auth/me');
      }
    } catch (err) {
      setError2('An unexpected error occurred');
    } finally {
      setRevoking(null);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'DESKTOP': return <Monitor className="h-5 w-5" />;
      case 'MOBILE': return <Smartphone className="h-5 w-5" />;
      case 'TABLET': return <Tablet className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return { browser: 'Unknown', os: 'Unknown' };
    
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { browser, os };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
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
      <div>
        <h1 className="text-2xl font-bold">Trusted Devices</h1>
        <p className="text-muted-foreground">Manage devices that have access to your account</p>
      </div>

      {/* Error Message */}
      {error2 && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error2}
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-lg border bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">Device Security</h3>
            <p className="text-sm text-muted-foreground">
              These are devices that have been used to sign in to your account. 
              Revoking a device will terminate all active sessions on that device.
            </p>
          </div>
        </div>
      </div>

      {/* Devices List */}
      {devices.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No devices found</h3>
          <p className="text-sm text-muted-foreground">
            Devices will appear here after you sign in from them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device: any) => {
            const { browser, os } = parseUserAgent(device.userAgent);
            const isCurrentDevice = device.current;
            
            return (
              <div key={device.id} className="rounded-lg border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      isCurrentDevice ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {device.nickname || `${browser} on ${os}`}
                        </h3>
                        {isCurrentDevice && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {os} - {browser}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Last seen: {formatTimeAgo(device.lastSeenAt)}</span>
                        {device.ipAddress && (
                          <span>IP: {device.ipAddress}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {device.isTrusted ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                            <CheckCircle className="h-3 w-3" />
                            Trusted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-medium/10 text-security-medium text-xs font-medium">
                            <AlertCircle className="h-3 w-3" />
                            Not Trusted
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Added {new Date(device.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isCurrentDevice && (
                    <button
                      onClick={() => handleRevoke(device.id)}
                      disabled={revoking === device.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {revoking === device.id ? 'Revoking...' : 'Revoke'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
