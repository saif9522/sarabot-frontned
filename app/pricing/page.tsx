'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { usePublicPlansQuery } from '@/store/api';
import { chats, duration, money } from '@/lib/format';
import SiteShell from '@/components/site/SiteShell';
import PageIntro from '@/components/site/PageIntro';

export default function PricingPage() {
  const { data: plans, isLoading, isError } = usePublicPlansQuery();
  // The sign-up trial has its own banner; tabs are only for paid plans.
  const paid = useMemo(() => (plans ?? []).filter((p) => !p.trialForSignup), [plans]);
  const durations = useMemo(() => [...new Set(paid.map((p) => p.durationDays))].sort((a, b) => a - b), [paid]);
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked ?? durations[0] ?? null;
  const trial = (plans ?? []).find((p) => p.trialForSignup);
  const shown = paid.filter((p) => p.durationDays === current);
  const popular = shown.length >= 3 ? shown[1]?.id : null;

  return (
    <SiteShell>
      <PageIntro title="Simple plans, priced by replies">
        One chat is one automatic reply from your bot. Replies you or your team type are always free.
      </PageIntro>

      <section className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
        {trial && (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-tint p-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-navy">Free for {duration(trial.durationDays)} when you sign up</h2>
              <p className="mt-1 text-ink">{chats(trial.chatLimit)} automatic replies to try Sarabot on your own WhatsApp. No card needed.</p>
            </div>
            <Link href="/signup" className="btn-primary h-11 rounded-full px-6">Start free trial</Link>
          </div>
        )}

        {durations.length > 1 && (
          <div className="mb-8 flex w-fit flex-wrap gap-1 rounded-full bg-canvas p-1 ring-1 ring-line" role="group" aria-label="Billing period">
            {durations.map((d) => (
              <button key={d} aria-pressed={d === current} onClick={() => setPicked(d)}
                className={`h-10 rounded-full px-5 text-sm font-semibold ${d === current ? 'bg-navy text-white' : 'text-navy hover:bg-white'}`}>{duration(d)}</button>
            ))}
          </div>
        )}

        {isError && <p className="text-err">Plans couldn&apos;t be loaded right now. Please refresh in a minute.</p>}
        {isLoading && <p className="text-muted">Loading plans…</p>}
        {plans && !shown.length && !isLoading && <p className="text-muted">Paid plans will appear here soon. Start with the free trial meanwhile.</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            const isPopular = p.id === popular;
            return (
              <article key={p.id} className={`flex flex-col rounded-3xl p-7 ${isPopular ? 'bg-navy text-white' : 'bg-white ring-1 ring-line'}`}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className={`font-display text-2xl font-semibold ${isPopular ? 'text-white' : 'text-navy'}`}>{p.name}</h2>
                  {isPopular && <span className="rounded-full bg-brand-glow px-3 py-1 text-xs font-semibold text-navy">Recommended</span>}
                </div>
                {p.description && <p className={`mt-1 text-sm ${isPopular ? 'text-white/75' : 'text-muted'}`}>{p.description}</p>}
                <p className="mt-6">
                  <span className="font-display text-5xl font-bold tracking-tight">{money(p.price, p.currency)}</span>
                  <span className={isPopular ? 'text-white/75' : 'text-muted'}> / {duration(p.durationDays)}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {[`${chats(p.chatLimit)} automatic replies`, `${p.numbersLimit} WhatsApp number${p.numbersLimit === 1 ? '' : 's'}`, `${p.agentsLimit} team member${p.agentsLimit === 1 ? '' : 's'}`, 'AI replies from your business info', 'Quick replies with images and PDFs'].map((f) => (
                    <li key={f} className="flex gap-2"><Check className={`mt-0.5 h-4 w-4 flex-none ${isPopular ? 'text-brand-glow' : 'text-brand'}`} aria-hidden />{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className={`mt-8 h-12 rounded-full text-base ${isPopular ? 'btn bg-brand-glow text-navy hover:bg-white' : 'btn-primary'}`}>Get started</Link>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-muted">
          Pay online from your dashboard after signing up. Buying the same plan again extends it; a bigger plan starts right away. Already a customer? <Link href="/login" className="font-semibold text-brand-dark hover:underline">Log in</Link>
        </p>
      </section>
    </SiteShell>
  );
}
