'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json())

interface RecoveryCode {
  id: string
  code: string
  used_at: string | null
  created_at: string
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)
  const [newRecoveryCodes, setNewRecoveryCodes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: recoveryData } = useSWR<{ recoveryCodes: RecoveryCode[] }>(
    user ? '/api/recovery-codes' : null,
    fetcher
  )

  const generateNewRecoveryCodes = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/recovery-codes', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.codes) {
        setNewRecoveryCodes(data.codes)
        setShowRecoveryCodes(true)
        mutate('/api/recovery-codes')
      }
    } catch (error) {
      console.error('Failed to generate recovery codes:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        logout()
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const unusedCodes = recoveryData?.recoveryCodes?.filter(c => !c.used_at) || []

  return (
    <div className="space-y-8">
      {/* Account Information */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Display Name</p>
              <p className="text-foreground font-medium">{user?.display_name || 'Not set'}</p>
            </div>
            <button className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <button className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="text-foreground font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recovery Codes */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recovery Codes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use these codes to access your account if you lose your authenticator
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {unusedCodes.length} codes remaining
            </span>
          </div>
        </div>

        {showRecoveryCodes && newRecoveryCodes.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-400 text-sm font-medium">
                Save these codes in a secure location. They will only be shown once.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newRecoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-3 font-mono text-sm text-foreground text-center"
                >
                  {code}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newRecoveryCodes.join('\n'))
              }}
              className="w-full py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
            >
              Copy All Codes
            </button>
            <button
              onClick={() => {
                setShowRecoveryCodes(false)
                setNewRecoveryCodes([])
              }}
              className="w-full py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {unusedCodes.length < 3 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-400 text-sm">
                  You have few recovery codes remaining. Consider generating new ones.
                </p>
              </div>
            )}
            <button
              onClick={generateNewRecoveryCodes}
              disabled={isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate New Recovery Codes'}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              This will invalidate all existing recovery codes
            </p>
          </div>
        )}
      </section>

      {/* Security Preferences */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Security Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-foreground font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Automatically log out after period of inactivity
              </p>
            </div>
            <select className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="240">4 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-foreground font-medium">Login Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified of new login attempts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-foreground font-medium">Require Confirmation</p>
              <p className="text-sm text-muted-foreground">
                Ask for confirmation before critical actions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-card border border-destructive/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-destructive mb-6">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
