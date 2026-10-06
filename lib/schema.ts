import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './seo';
import { CONTACT } from '@/components/site/contact';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: CONTACT.email,
  telephone: CONTACT.tel,
  address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', postalCode: '110025', addressRegion: 'Delhi', addressCountry: 'IN' },
  areaServed: [{ '@type': 'Country', name: 'India' }, { '@type': 'Place', name: 'Worldwide' }],
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', telephone: CONTACT.tel, email: CONTACT.email, areaServed: 'IN', availableLanguage: ['English', 'Hindi'] }],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${SITE_NAME} – AI WhatsApp Chatbot`,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'WhatsApp chatbot and customer support automation',
  operatingSystem: 'Web browser',
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free trial, no card needed', url: `${SITE_URL}/pricing` },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE_URL}${t.path === '/' ? '' : t.path}`,
    })),
  };
}
