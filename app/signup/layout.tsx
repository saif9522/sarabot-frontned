import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Start Your Free Trial – Create a Sarabot Account',
  description: 'Create your Sarabot account and start a free trial of the AI WhatsApp chatbot. No card needed, set up in about 10 minutes.',
  path: '/signup',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
