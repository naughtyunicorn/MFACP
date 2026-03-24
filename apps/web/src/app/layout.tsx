import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MFA Card Platform - Never Get Locked Out Again',
    template: '%s | MFA Card Platform',
  },
  description: 'Enterprise-grade multi-device authentication platform with passkeys, NFC smart cards, and distributed trust. Your security, your control, no single point of failure.',
  keywords: ['authentication', 'MFA', 'passkeys', 'WebAuthn', 'NFC', 'security', 'smart cards', '2FA', 'passwordless', 'biometric'],
  authors: [{ name: 'MFA Card Platform' }],
  creator: 'MFA Card Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mfacard.com',
    siteName: 'MFA Card Platform',
    title: 'MFA Card Platform - Never Get Locked Out Again',
    description: 'Enterprise-grade multi-device authentication with passkeys, NFC smart cards, and distributed trust.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MFA Card Platform',
    description: 'Never get locked out of your accounts again. Enterprise-grade authentication for everyone.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
