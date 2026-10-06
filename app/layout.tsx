import type { Metadata, Viewport } from 'next';
import { CORE_KEYWORDS, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo';
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import AppShell from '@/components/AppShell';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Sarabot – AI WhatsApp Chatbot for Business in India', template: '%s | Sarabot' },
  description: SITE_DESCRIPTION,
  applicationName: 'Sarabot',
  keywords: CORE_KEYWORDS,
  category: 'business software',
  creator: 'Sarabot',
  publisher: 'Sarabot',
  alternates: { canonical: SITE_URL, languages: { 'en-IN': SITE_URL, 'x-default': SITE_URL } },
  openGraph: { type: 'website', siteName: 'Sarabot', locale: 'en_IN', url: SITE_URL, title: 'Sarabot – AI WhatsApp Chatbot for Business in India', description: SITE_DESCRIPTION },
  twitter: { card: 'summary_large_image', title: 'Sarabot – AI WhatsApp Chatbot for Business', description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#0B1B3A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
