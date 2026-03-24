'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  Activity, 
  Settings, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  LogOut,
  ChevronRight,
  CreditCard,
  Smartphone as PhoneIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { state, logout } = useAuth();

  // Mock data for demonstration
  const securityScore = 85;
  const authenticators = [
    {
      id: '1',
      type: 'passkey',
      name: 'MacBook Pro Touch ID',
      lastUsed: '2 hours ago',
      isBackup: false,
      status: 'active'
    },
    {
      id: '2', 
      type: 'card',
      name: 'NFC Security Card',
      lastUsed: '1 day ago',
      isBackup: true,
      status: 'active'
    },
    {
      id: '3',
      type: 'totp',
      name: 'Google Authenticator',
      lastUsed: '3 days ago',
      isBackup: true,
      status: 'active'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login via passkey',
      device: 'MacBook Pro',
      time: '2 hours ago',
      risk: 'low'
    },
    {
      id: '2',
      type: 'authenticator_added',
      description: 'NFC card enrolled',
      device: 'Mobile App',
      time: '1 day ago',
      risk: 'medium'
    },
    {
      id: '3',
      type: 'login',
      description: 'Failed login attempt',
      device: 'Unknown',
      time: '3 days ago',
      risk: 'high'
    }
  ];

  const devices = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastSeen: '2 hours ago',
      trusted: true,
      current: true
    },
    {
      id: '2',
      name: 'iPhone 14 Pro',
      type: 'mobile',
      lastSeen: '1 day ago',
      trusted: true,
      current: false
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-security-low';
      case 'medium': return 'text-security-medium';
      case 'high': return 'text-security-high';
      default: return 'text-muted-foreground';
    }
  };

  const getAuthenticatorIcon = (type: string) => {
    switch (type) {
      case 'passkey': return <Key className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'totp': return <Smartphone className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">MFA Card Platform</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
              <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Settings
              </Link>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* User Info */}
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Security Score</span>
                    <span className="font-medium text-security-low">{securityScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div 
                      className="h-2 rounded-full bg-security-low" 
                      style={{ width: `${securityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('authenticators')}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === 'authenticators' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Key className="h-4 w-4" />
                  Authenticators
                </button>
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === 'devices' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PhoneIcon className="h-4 w-4" />
                  Devices
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === 'activity' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    activeTab === 'recovery' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  Recovery
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Security Overview</h1>
                  <button className="auth-button bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Authenticator
                  </button>
                </div>

                {/* Status Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="security-card low p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <CheckCircle className="h-8 w-8 text-security-low" />
                      <span className="text-2xl font-bold">{authenticators.length}</span>
                    </div>
                    <h3 className="font-semibold mb-1">Active Authenticators</h3>
                    <p className="text-sm text-muted-foreground">Multiple recovery options available</p>
                  </div>

                  <div className="security-card medium p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <Clock className="h-8 w-8 text-security-medium" />
                      <span className="text-2xl font-bold">{devices.length}</span>
                    </div>
                    <h3 className="font-semibold mb-1">Trusted Devices</h3>
                    <p className="text-sm text-muted-foreground">1 currently active</p>
                  </div>

                  <div className="security-card high p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <AlertTriangle className="h-8 w-8 text-security-high" />
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-1">Recent Alerts</h3>
                    <p className="text-sm text-muted-foreground">1 requires attention</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/dashboard/authenticators/add" className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Plus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Add Passkey</h3>
                          <p className="text-sm text-muted-foreground">Set up a new authentication method</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    <Link href="/dashboard/recovery/codes" className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-security-high/10">
                          <Lock className="h-5 w-5 text-security-high" />
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
                    <Link href="/dashboard/activity" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.device} • {activity.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${getRiskColor(activity.risk)}`}>
                          {activity.risk.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Authenticators Tab */}
            {activeTab === 'authenticators' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Authenticators</h1>
                  <button className="auth-button bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Authenticator
                  </button>
                </div>

                <div className="grid gap-4">
                  {authenticators.map((auth) => (
                    <div key={auth.id} className="rounded-lg border bg-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            {getAuthenticatorIcon(auth.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{auth.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last used {auth.lastUsed}
                              {auth.isBackup && ' • Backup method'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-security-low/10 text-security-low text-xs font-medium">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                          <button className="text-sm text-muted-foreground hover:text-foreground">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs would follow similar patterns... */}
            {activeTab === 'devices' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Trusted Devices</h1>
                <div className="grid gap-4">
                  {devices.map((device) => (
                    <div key={device.id} className="rounded-lg border bg-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <PhoneIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last seen {device.lastSeen}
                              {device.current && ' • Current device'}
                            </p>
                          </div>
                        </div>
                        <button className="text-sm text-destructive hover:text-destructive/80">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Security Activity</h1>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="rounded-lg border bg-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{activity.description}</h3>
                            <p className="text-sm text-muted-foreground">{activity.device} • {activity.time}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getRiskColor(activity.risk)}`}>
                          {activity.risk.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recovery' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Recovery Options</h1>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-6">
                    <Lock className="h-8 w-8 text-security-high mb-4" />
                    <h3 className="font-semibold mb-2">Recovery Codes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate single-use backup codes for emergency access
                    </p>
                    <button className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Generate Codes
                    </button>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-6">
                    <Smartphone className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Mobile App Recovery</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use the mobile app to recover your account
                    </p>
                    <button className="auth-button bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Open Mobile App
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
