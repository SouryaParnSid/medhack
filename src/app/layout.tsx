import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FirebaseInitializer from "@/components/FirebaseInitializer";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

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
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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
      <body className="min-h-screen antialiased bg-[#0f172a] text-white">
        <div className="relative flex min-h-screen flex-col">
          <FirebaseInitializer />
          <Navigation />
          <main className="flex-grow md:pb-0 pb-16"> {/* Added padding bottom for mobile navigation */}
            {children}
          </main>
          <Footer className="md:block hidden" /> {/* Hide footer on mobile */}
          <div id="modal-root" />
        </div>
      </body>
    </html>
  );
}
