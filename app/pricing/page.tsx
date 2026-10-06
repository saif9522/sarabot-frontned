'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, MessagesSquare } from 'lucide-react';
import { usePublicPlansQuery } from '@/store/api';
import { chats, duration, money } from '@/lib/format';

export default function PricingPage() {
  const { data: plans, isLoading, isError } = usePublicPlansQuery();
  const durations = useMemo(() => [...new Set((plans ?? []).map((p) => p.durationDays))].sort((a, b) => a - b), [plans]);
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked ?? durations[0] ?? null;
  const shown = (plans ?? []).filter((p) => p.durationDays === current);

  return (
    <div className="min-h-screen bg-gradient-to-b from-c-violet-tint via-white to-c-pink-tint">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/pricing" className="flex items-center gap-3 font-display text-xl font-bold text-navy"><MessagesSquare className="h-7 w-7 text-brand" aria-hidden /> SAIF Chat</Link>
        <span className="flex gap-2"><Link href="/login" className="btn-secondary">Sign in</Link><Link href="/signup" className="btn-primary">Sign up</Link></span>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <h1 className="text-center font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">Plans that grow with your chats</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-muted">A chat is one automatic reply from your bot. Replies you type yourself are always free.</p>

        {durations.length > 1 && (
          <div className="mx-auto mt-8 flex w-fit flex-wrap justify-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-line" role="group" aria-label="Billing period">
            {durations.map((d) => (
              <button key={d} aria-pressed={d === current} onClick={() => setPicked(d)}
                className={`h-10 rounded-full px-5 text-sm font-semibold ${d === current ? 'bg-c-violet text-white' : 'text-c-violet hover:bg-c-violet-tint'}`}>{duration(d)}</button>
            ))}
          </div>
        )}

        {isError && <p className="mt-10 text-center text-err">Plans couldn&apos;t be loaded right now.</p>}
        {isLoading && <p className="mt-10 text-center text-muted">Loading plans…</p>}
        {plans && !plans.length && <p className="mt-10 text-center text-muted">Plans will appear here soon.</p>}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p, i) => (
            <article key={p.id} className={`flex flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ${i === 1 ? 'ring-2 ring-c-violet' : 'ring-line'}`}>
              <h2 className="font-display text-xl font-semibold text-navy">{p.name}</h2>
              {p.trialForSignup && <span className="mt-1 w-fit rounded-full bg-c-green-tint px-2.5 py-0.5 text-xs font-semibold text-c-green">Free with every new account</span>}
              {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
              <p className="mt-5"><span className="font-display text-4xl font-bold text-navy">{money(p.price, p.currency)}</span> <span className="text-muted">/ {duration(p.durationDays)}</span></p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {[`${chats(p.chatLimit)} automatic replies`, `${p.numbersLimit} WhatsApp number${p.numbersLimit === 1 ? '' : 's'}`, `${p.agentsLimit} team member${p.agentsLimit === 1 ? '' : 's'}`, 'Bot flows with images & documents', 'AI replies from your business info'].map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-none text-c-green" aria-hidden />{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary mt-7 h-11 rounded-full">{p.trialForSignup ? 'Start free trial' : 'Get started'}</Link>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">Plans are activated by our team after payment. Already a customer? <Link href="/login" className="font-semibold text-c-indigo hover:underline">Sign in</Link></p>
      </main>
    </div>
  );
}
