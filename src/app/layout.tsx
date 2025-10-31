import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { BlockProvider } from '@/contexts/BlockContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/ui/ToastContainer';
import IntroVideo from '@/components/ui/SplashScreen';
import ClientWrapper from '@/components/ui/ClientWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QProof Explorer - Verifiable Bitcoin Provenance',
  description: '⚡ QProof Explorer - Verifiable Bitcoin Provenance, Made Simple',
  keywords: ['QProof', 'Bitcoin', 'Blockchain', 'Explorer', 'Quantum-Resistant'],
  authors: [{ name: 'QProof Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  icons: {
    icon: '/qproof_logo.png',
    shortcut: '/qproof_logo.png',
    apple: '/qproof_logo.png',
  },
  openGraph: {
    title: 'QProof Explorer',
    description: '⚡ QProof Explorer - Verifiable Bitcoin Provenance, Made Simple',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://qproof-explorer.vercel.app',
    images: [
      {
        url: 'https://qproof-explorer.vercel.app/qproof_logo.png',
        width: 1200,
        height: 630,
        alt: 'QProof Explorer',
        type: 'image/png',
      },
    ],
    siteName: 'QProof Explorer',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QProof Explorer',
    description: '⚡ QProof Explorer - Verifiable Bitcoin Provenance, Made Simple',
    images: ['https://qproof-explorer.vercel.app/qproof_logo.png'],
    creator: '@QProof',
    site: '@QProof',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <IntroVideo />
        <ErrorBoundary>
          <ToastProvider>
            <BlockProvider>
              <LayoutWrapper>
                <ClientWrapper>{children}</ClientWrapper>
              </LayoutWrapper>
            </BlockProvider>
            <ToastContainer />
          </ToastProvider>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
