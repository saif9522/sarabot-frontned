import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Log in to Sarabot',
  description: 'Log in to your Sarabot dashboard to manage your WhatsApp chatbot, chats, products and plan.',
  path: '/login',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
