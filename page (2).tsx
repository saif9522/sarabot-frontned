'use client';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { useBillingQuery } from '@/store/api';
import { ErrorNote, PageHeader, StatusPill } from '@/components/ui';
import { PlanPill, UsageBar } from '@/components/PlanUsage';
import BuyPlans from '@/components/BuyPlans';
import { chats, fmtDate, money } from '@/lib/format';

export default function BillingPage() {
  const { data, isError } = useBillingQuery(undefined, { pollingInterval: 30000 });
  if (isError) return <ErrorNote what="your plan" />;
  if (!data) return <p className="text-muted">Loading…</p>;
  const s = data.status;
  const now = Date.now();
  return (
    <>
      <PageHeader icon={CreditCard} tone="orange" title="Plan & usage" description="Your plan, what you have used, and buying or renewing online." />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line lg:col-span-2" aria-labelledby="cur">
          <div className="bg-gradient-to-r from-c-orange to-c-pink px-5 py-5 text-white">
            <p className="text-sm text-white/90">Current plan</p>
            <h2 id="cur" className="font-display text-2xl font-bold">{s.planName ?? 'No plan yet'}</h2>
          </div>
          <div className="space-y-4 p-5">
            <PlanPill p={s} />
            {s.planName ? <UsageBar p={s} /> : <p className="text-sm text-muted">You can set up bots and numbers now. The bot starts replying once a plan is active.</p>}
            {s.chatsLeft != null && s.active && <p className="text-sm"><b>{s.chatsLeft.toLocaleString('en-IN')}</b> automatic replies left</p>}
            {s.upcoming && <p className="text-sm text-c-violet">Next plan booked: {s.upcoming.planName}, {fmtDate(s.upcoming.startsAt)} – {fmtDate(s.upcoming.endsAt)}</p>}
            <p className="text-xs text-muted">One automatic bot reply counts as one chat. Replies your team types are free.</p>
          </div>
        </section>
        <section className="card space-y-4 p-5" aria-labelledby="lim">
          <h2 id="lim" className="font-display text-lg font-semibold text-navy">Limits</h2>
          <p className="flex justify-between text-sm"><span>WhatsApp numbers</span><b>{data.numbersUsed} / {s.numbersLimit}</b></p>
          <p className="flex justify-between text-sm"><span>Team members</span><b>{data.agentsUsed} / {s.agentsLimit}</b></p>
          <Link href="/pricing" className="btn-secondary w-full">See all plans</Link>
        </section>
      </div>
      <BuyPlans renewing={s.active && !!s.endsAt} />
      <section className="card mt-6 overflow-x-auto" aria-labelledby="hist">
        <h2 id="hist" className="px-5 pt-5 font-display text-lg font-semibold text-navy">History</h2>
        {!data.history.length ? <p className="p-5 text-sm text-muted">No plans yet.</p> : (
          <table className="mt-3 w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-5 py-3 font-semibold">Plan</th><th className="px-5 py-3 font-semibold">Period</th><th className="px-5 py-3 font-semibold">Chats used</th><th className="px-5 py-3 text-right font-semibold">Amount</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.history.map((h) => {
                const state = h.status === 'cancelled' ? 'Cancelled' : new Date(h.startsAt).getTime() > now ? 'Upcoming' : new Date(h.endsAt).getTime() <= now ? 'Ended' : 'Running';
                return (
                  <tr key={h.id}>
                    <td className="px-5 py-3 font-medium">{h.planName}</td>
                    <td className="px-5 py-3">{fmtDate(h.startsAt)} → {fmtDate(h.endsAt)}</td>
                    <td className="px-5 py-3 tabular-nums">{h.chatsUsed.toLocaleString('en-IN')} / {chats(h.chatLimit)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(h.amountPaid, h.currency)}</td>
                    <td className="px-5 py-3"><StatusPill tone={state === 'Running' ? 'ok' : state === 'Upcoming' ? 'busy' : 'off'}>{state}</StatusPill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
