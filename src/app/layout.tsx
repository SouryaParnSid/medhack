import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SwasthyaAI - Healthcare AI Assistant',
  description: 'AI-Powered Healthcare Assistant for Rural Communities - Empowering healthcare workers with intelligent tools for better diagnosis, triage, and treatment guidance.',
  keywords: 'healthcare, AI, rural healthcare, medical assistant, diagnosis, triage',
  authors: [{ name: 'SwasthyaAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
          <div id="modal-root" />
        </div>
      </body>
    </html>
  );
}
