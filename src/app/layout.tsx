import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { BlockProvider } from "@/contexts/BlockContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QProof Explorer - Verifiable Bitcoin Provenance",
  description: "Track QProof provenance for Bitcoin transactions. View UTXOs, keys, and blocks with complete inclusion proofs and verification.",
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
    description: 'Verifiable Bitcoin Provenance, Made Simple',
    type: 'website',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ErrorBoundary>
          <BlockProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Footer />
          </BlockProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
