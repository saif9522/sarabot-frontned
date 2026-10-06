import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PageIntro from '@/components/site/PageIntro';

export const metadata: Metadata = {
  title: 'About',
  description: 'Sarabot is a WhatsApp chatbot made in India for shops and small businesses that get more messages than they can answer.',
};

const BELIEFS = [
  { title: 'Your customers already use WhatsApp', text: 'They don’t want an app or a website form. They want a quick answer on the chat they already have open.' },
  { title: 'A wrong answer is worse than no answer', text: 'Sarabot answers only from the facts you give it. When it isn’t sure, it hands the chat to you.' },
  { title: 'Simple enough for any shop owner', text: 'If you can fill a form and scan a QR code, you can run Sarabot. No developers, no setup fees.' },
  { title: 'Priced for small businesses', text: 'Plans are based on how many automatic replies you need, and replies you type yourself are always free.' },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageIntro title="About Sarabot">
        <p>Sarabot is a WhatsApp chatbot made in India for kirana stores, local shops, clinics, coaching centres and every small business that gets more messages than it can answer.</p>
        <p className="mt-4">It replies when you’re busy at the counter, after closing time and on holidays, in the language your customer writes in.</p>
      </PageIntro>

      <section className="mx-auto max-w-4xl px-5 pb-16">
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
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-6 px-5 py-14">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy">Talk to us</h2>
            <p className="mt-2 max-w-md text-ink">Questions about plans, setup or a custom need for your business? Write to us and we’ll get back to you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:designersaifali@gmail.com" className="btn-secondary h-12 rounded-full px-6 text-base"><Mail className="h-4 w-4" aria-hidden /> designersaifali@gmail.com</a>
            <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
