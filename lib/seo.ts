import type { Metadata } from 'next';

/** Live site address. Override with NEXT_PUBLIC_SITE_URL (e.g. while still on vercel.app). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sarabot.in').replace(/\/$/, '');
export const SITE_NAME = 'Sarabot';
export const SITE_DESCRIPTION =
  'Sarabot is an AI WhatsApp chatbot for businesses in India. Link your WhatsApp with a QR code and auto-reply to customers 24/7 with prices, stock, delivery and order details. Built for e-commerce, grocery stores, NGOs and small businesses.';

/** Search phrases people actually type. Used as page keywords and in on-page copy. */
export const CORE_KEYWORDS = [
  'WhatsApp chatbot', 'WhatsApp chatbot India', 'AI WhatsApp chatbot', 'WhatsApp auto reply', 'WhatsApp automation',
  'WhatsApp bot for business', 'WhatsApp chatbot for small business', 'WhatsApp customer support bot',
  'WhatsApp chatbot without API', 'WhatsApp Web chatbot', 'chatbot for WhatsApp Business', 'Sarabot',
];

/** Builds consistent metadata for a public page: title, description, canonical URL, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, keywords = [], absoluteTitle = false }: {
  title: string; description: string; path: string; keywords?: string[]; absoluteTitle?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...keywords, ...CORE_KEYWORDS],
    alternates: { canonical: url, languages: { 'en-IN': url, 'x-default': url } },
    openGraph: { type: 'website', url, siteName: SITE_NAME, title: fullTitle, description, locale: 'en_IN' },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}
