import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import AppShell from '@/components/AppShell';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: { default: 'Sarabot – WhatsApp chatbot for your business', template: '%s | Sarabot' },
  description: 'Sarabot answers your customers on WhatsApp in Hindi, English or Hinglish, day and night. Link your number with a QR code and start in minutes.',
  metadataBase: new URL('https://sarabot.in'),
  openGraph: { siteName: 'Sarabot', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
