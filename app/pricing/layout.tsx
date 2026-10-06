import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'WhatsApp Chatbot Pricing in India – Plans from a Free Trial',
  description: 'Simple Sarabot plans priced by automatic replies, in Indian rupees. Start with a free trial, no card needed. Replies you type yourself are always free.',
  path: '/pricing',
  keywords: ['WhatsApp chatbot price India', 'WhatsApp chatbot pricing', 'cheap WhatsApp chatbot', 'WhatsApp automation cost'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
