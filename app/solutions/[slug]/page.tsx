import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Check, MessageCircleQuestion } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import Container from '@/components/site/Container';
import MiniChat from '@/components/site/MiniChat';
import JsonLd from '@/components/site/JsonLd';
import { SOLUTIONS, findSolution } from '@/components/site/solutions';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = findSolution(params.slug);
  if (!s) return {};
  return pageMetadata({ title: s.seoTitle, description: s.seoDescription, path: `/solutions/${s.slug}`, keywords: s.keywords, absoluteTitle: true });
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const s = findSolution(params.slug);
  if (!s) notFound();
  const others = SOLUTIONS.filter((o) => o.slug !== s.slug);
  return (
    <SiteShell>
      <JsonLd data={[faqSchema(s.faq), breadcrumbSchema([{ name: 'Solutions', path: '/solutions' }, { name: s.name, path: `/solutions/${s.slug}` }])]} />

      <section className="hero-bg text-white">
        <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-white/70">
              <Link href="/solutions" className="hover:text-white hover:underline">Solutions</Link> <span aria-hidden>/</span> <span className="text-white">{s.name}</span>
            </nav>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{s.h1}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-[#07122A] hover:bg-white">Start free trial</Link>
              <Link href="/pricing" className="inline-flex items-center rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10">See pricing</Link>
            </div>
          </div>
          <MiniChat lines={s.chat} title={s.name} />
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Questions Sarabot answers for you</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">The messages you get every day, answered automatically from the information you add.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.questions.map((q) => (
              <li key={q} className="flex items-start gap-3 rounded-2xl bg-canvas px-5 py-4 text-ink"><MessageCircleQuestion className="mt-0.5 h-5 w-5 flex-none text-brand" aria-hidden />{q}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-canvas">
        <Container className="py-16 md:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Why it works for {s.phrase}</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {s.benefits.map((b) => (
              <div key={b.title} className="border-t-2 border-brand pt-5">
                <h3 className="font-display text-xl font-semibold text-navy">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.5fr]">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Frequently asked questions</h2>
          <div className="divide-y divide-line rounded-2xl ring-1 ring-line">
            {s.faq.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">{f.q}<span className="text-xl text-brand transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-tint">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-14">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy">Start your free trial today</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-ink">
              {['No card needed', 'Set up in 10 minutes', 'Keep your WhatsApp number'].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand" aria-hidden />{t}</li>)}
            </ul>
          </div>
          <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-14">
          <h2 className="font-display text-2xl font-semibold text-navy">Sarabot for other businesses</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {others.map((o) => <li key={o.slug}><Link href={`/solutions/${o.slug}`} className="inline-block rounded-full bg-canvas px-5 py-2.5 font-medium text-navy ring-1 ring-line hover:bg-brand-tint">WhatsApp chatbot for {o.phrase}</Link></li>)}
          </ul>
        </Container>
      </section>
    </SiteShell>
  );
}
