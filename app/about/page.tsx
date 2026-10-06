import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CONTACT } from '@/components/site/contact';
import SiteShell from '@/components/site/SiteShell';
import JsonLd from '@/components/site/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import PageIntro from '@/components/site/PageIntro';

export const metadata: Metadata = pageMetadata({
  title: 'About Sarabot – AI WhatsApp Chatbot Company in New Delhi, India',
  description: 'Sarabot builds an AI WhatsApp chatbot for Indian businesses, from online stores and grocery shops to NGOs. Learn what we believe and how to contact our team in New Delhi.',
  path: '/about',
  keywords: ['Sarabot company', 'WhatsApp chatbot company India', 'WhatsApp chatbot New Delhi'],
});

const BELIEFS = [
  { title: 'Your customers already use WhatsApp', text: 'They don’t want an app or a website form. They want a quick answer on the chat they already have open.' },
  { title: 'A wrong answer is worse than no answer', text: 'Sarabot answers only from the facts you give it. When it isn’t sure, it hands the chat to you.' },
  { title: 'Simple enough for any shop owner', text: 'If you can fill a form and scan a QR code, you can run Sarabot. No developers, no setup fees.' },
  { title: 'Priced for small businesses', text: 'Plans are based on how many automatic replies you need, and replies you type yourself are always free.' },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <JsonLd data={breadcrumbSchema([{ name: 'About', path: '/about' }])} />
      <PageIntro title="About Sarabot">
        <p>Sarabot is a WhatsApp chatbot made in India for kirana stores, local shops, clinics, coaching centres and every small business that gets more messages than it can answer.</p>
        <p className="mt-4">It replies when you’re busy at the counter, after closing time and on holidays, in the language your customer writes in.</p>
      </PageIntro>

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy">What we believe</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {BELIEFS.map((b) => (
            <div key={b.title} className="border-l-4 border-brand pl-5">
              <dt className="font-display text-lg font-semibold text-navy">{b.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-muted">{b.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 grid gap-10 py-16 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy">Talk to us</h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-ink">Questions about plans, setup or a custom need for your business? Call, WhatsApp or email us.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#07122A] hover:bg-navy hover:text-white"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp us</a>
              <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
            </div>
          </div>
          <address className="not-italic">
            <ul className="space-y-4 rounded-3xl bg-white p-7 ring-1 ring-line">
              <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-ink hover:text-brand-dark"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint"><Mail className="h-5 w-5 text-brand" aria-hidden /></span>{CONTACT.email}</a></li>
              <li><a href={`tel:${CONTACT.tel}`} className="flex items-center gap-3 text-ink hover:text-brand-dark"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint"><Phone className="h-5 w-5 text-brand" aria-hidden /></span>{CONTACT.phone}</a></li>
              <li className="flex items-center gap-3 text-ink"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint"><MapPin className="h-5 w-5 text-brand" aria-hidden /></span>{CONTACT.address}</li>
            </ul>
          </address>
        </div>
      </section>
    </SiteShell>
  );
}
