import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CR Game Creator Studio | Build ANY Game with AI',
  description: 'Describe your dream game in plain English and watch Javari AI build it. From simple kids games to complex multiplayer experiences. No coding required.',
  keywords: 'game creator, game builder, AI games, no-code game development, Javari AI, CR AudioViz AI',
  openGraph: {
    title: 'CR Game Creator Studio | Build ANY Game with AI',
    description: 'Describe your dream game and watch AI build it instantly.',
    type: 'website',
    url: 'https://games.craudiovizai.com/studio',
    images: ['/og-game-studio.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR Game Creator Studio',
    description: 'Build ANY game by describing it in plain English.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://kteobfyferrukqeolofj.supabase.co" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white`}>
        {/* Header with ecosystem navigation */}
        <Header />
        
        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Toast notifications */}
        <Toaster />
        
        {/* Javari AI Assistant - Always available */}
        <Script 
          src="https://javariai.com/embed.js" 
          strategy="lazyOnload"
          data-position="bottom-right"
          data-theme="dark"
          data-context="game-studio"
        />
        
        {/* Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
