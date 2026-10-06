'use client';
import Link from 'next/link';
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, BadgeIndianRupee, Building2, CircleCheck, CircleSlash, Gauge, IdCard, Smartphone } from 'lucide-react';
import { useAdminOverviewQuery } from '@/store/api';
import { ErrorNote, PageHeader, Tone, toneClass } from '@/components/ui';
import { fmtDate, money } from '@/lib/format';

export default function AdminOverview() {
  const { data: d, isError } = useAdminOverviewQuery(undefined, { pollingInterval: 60000 });
  if (isError) return <ErrorNote what="the overview" />;
  const cards: Array<{ label: string; value: string | number; tone: Tone; icon: typeof Gauge; href?: string }> = d ? [
    { label: 'Customers', value: d.customers, tone: 'blue', icon: Building2, href: '/admin/customers' },
    { label: 'On an active plan', value: d.paying, tone: 'green', icon: CircleCheck },
    { label: 'Without a plan', value: d.withoutPlan, tone: 'orange', icon: CircleSlash },
    { label: 'Collected this month', value: d.revenueThisMonth.length ? d.revenueThisMonth.map((r) => money(r.amount, r.currency)).join(' + ') : money(0), tone: 'pink', icon: BadgeIndianRupee, href: '/admin/payments' },
    { label: `Team: ${d.people.owners} owners · ${d.people.admins} admins`, value: d.people.agents + ' agents', tone: 'violet', icon: IdCard, href: '/admin/users' },
    { label: 'WhatsApp numbers connected', value: `${d.numbers.connected}/${d.numbers.total}`, tone: 'sky', icon: Smartphone },
    { label: 'Messages received today', value: d.today.received, tone: 'amber', icon: ArrowDownLeft },
    { label: `Bot replies today · ${d.subscribers.toLocaleString('en-IN')} subscribers`, value: d.today.botReplies, tone: 'indigo', icon: ArrowUpRight },
  ] : [];
  return (
    <>
      <PageHeader icon={Gauge} tone="indigo" title="Platform overview" description="Customers, plans and renewals at a glance." />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Totals">
        {cards.map((c) => {
          const Icon = c.icon;
          const body = (
            <div className={`h-full rounded-2xl p-5 shadow-sm ${toneClass(c.tone, true)}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"><Icon className="h-5 w-5" aria-hidden /></span>
                <p className="text-right font-display text-3xl font-bold tabular-nums">{c.value}</p>
              </div>
              <p className="mt-3 text-sm font-semibold">{c.label}</p>
            </div>
          );
          return c.href ? <Link key={c.label} href={c.href}>{body}</Link> : <div key={c.label}>{body}</div>;
        })}
      </section>
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line" aria-labelledby="expiring">
        <div className="flex items-center gap-3 bg-c-orange px-5 py-4 text-white">
          <AlertTriangle className="h-5 w-5" aria-hidden />
          <h2 id="expiring" className="font-display text-lg font-semibold">Plans ending in the next 7 days</h2>
        </div>
        {!d?.expiringSoon.length ? <p className="p-5 text-sm text-muted">No plans are ending this week.</p> : (
          <ul className="divide-y divide-slate-100">
            {d.expiringSoon.map((e) => (
              <li key={e.workspaceId + e.endsAt} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <span><Link href={`/admin/customers/${e.workspaceId}`} className="font-semibold text-navy hover:underline">{e.name}</Link> <span className="text-sm text-muted">· {e.planName}</span></span>
                <span className="text-sm text-c-orange">ends {fmtDate(e.endsAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {d && d.activePlans === 0 && (
        <p className="mt-6 rounded-2xl bg-c-violet-tint p-4 text-sm text-c-violet">No plans yet. <Link href="/admin/plans" className="font-semibold underline">Create your first plan</Link> before activating customers.</p>
      )}
    </>
  );
}
