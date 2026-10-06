import Link from 'next/link';
import type { Metadata } from 'next';
import { HeartHandshake, ShoppingBag, ShoppingBasket, type LucideIcon } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import Container from '@/components/site/Container';
import PageIntro from '@/components/site/PageIntro';
import JsonLd from '@/components/site/JsonLd';
import { SOLUTIONS } from '@/components/site/solutions';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = pageMetadata({
  title: 'WhatsApp Chatbot Solutions for E-commerce, Grocery Stores and NGOs',
  description: 'See how Sarabot automates WhatsApp replies for online stores, grocery and daily-use product shops, NGOs and small businesses across India.',
  path: '/solutions',
  keywords: ['WhatsApp chatbot use cases', 'WhatsApp automation for business', 'industry WhatsApp chatbot'],
});

const ICONS: Record<string, LucideIcon> = { ecommerce: ShoppingBag, grocery: ShoppingBasket, ngo: HeartHandshake };

export default function SolutionsPage() {
  return (
    <SiteShell>
      <JsonLd data={breadcrumbSchema([{ name: 'Solutions', path: '/solutions' }])} />
      <PageIntro title="WhatsApp chatbot solutions for every kind of business">
        Online stores, grocery shops, NGOs, clinics, coaching centres: if your customers message you on WhatsApp, Sarabot can answer them.
      </PageIntro>
      <section className="bg-white">
        <Container className="grid gap-6 py-16 md:grid-cols-3 md:py-20">
          {SOLUTIONS.map((s) => {
            const Icon = ICONS[s.slug] ?? ShoppingBag;
            return (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="group flex flex-col rounded-3xl bg-canvas p-8 ring-1 ring-line transition-colors hover:bg-brand-tint">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white"><Icon className="h-7 w-7" aria-hidden /></span>
                <h2 className="mt-6 font-display text-2xl font-semibold text-navy">{s.name}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{s.short}</p>
                <span className="mt-6 font-semibold text-brand-dark group-hover:underline">Read more about {s.phrase}</span>
              </Link>
            );
          })}
        </Container>
      </section>
    </SiteShell>
  );
}
