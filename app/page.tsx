'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Bot, CheckCircle2, Circle, MessagesSquare, Package, Smartphone, UserRound, Users, type LucideIcon } from 'lucide-react';
import { useDashboardQuery } from '@/store/api';
import { ErrorNote, IconTile, StatusPill, Tone, toneClass } from '@/components/ui';
import { phone } from '@/lib/format';
import type { SessionStatus } from '@/lib/types';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
const PRESETS = [{ label: 'Today', from: 0 }, { label: 'Last 7 days', from: 6 }, { label: 'Last 30 days', from: 29 }];

function StatCard({ label, value, sub, icon, tone }: { label: string; value: string | number; sub?: string; icon: LucideIcon; tone: Tone }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ${toneClass(tone, true)}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"><IconInner icon={icon} /></span>
        <p className="font-display text-3xl font-bold tabular-nums">{value}</p>
      </div>
      <p className="mt-3 text-sm font-semibold">{label}</p>
      {sub && <p className="text-xs text-white">{sub}</p>}
    </div>
  );
}
const IconInner = ({ icon: Icon }: { icon: LucideIcon }) => <Icon className="h-5 w-5" aria-hidden />;

function Status({ s }: { s: SessionStatus }) {
  if (s === 'connected') return <StatusPill tone="ok">Connected</StatusPill>;
  if (s === 'qr' || s === 'starting') return <StatusPill tone="busy">Connecting…</StatusPill>;
  return <StatusPill tone="off">Disconnected</StatusPill>;
}

export default function Dashboard() {
  const [from, setFrom] = useState(daysAgo(0));
  const [to, setTo] = useState(daysAgo(0));
  const { data: d, isError } = useDashboardQuery({ from, to }, { pollingInterval: 30000 });
  const rangeLabel = useMemo(() => {
    const p = PRESETS.find((x) => from === daysAgo(x.from) && to === daysAgo(0));
    return p ? p.label.toLowerCase() : 'in this period';
  }, [from, to]);

  if (isError) return <ErrorNote what="the dashboard" />;

  const steps = d ? [
    { done: d.setup.bots > 0, label: 'Create a bot with business info and flows', href: '/bots' },
    { done: d.setup.products > 0, label: 'Add products (optional) for prices and stock', href: '/products' },
    { done: d.numbers.connected > 0, label: 'Link a WhatsApp number and choose its bots', href: '/numbers' },
  ] : [];
  const quick: Array<{ href: string; label: string; icon: LucideIcon; tone: Tone }> = [
    { href: '/bots', label: 'Bots', icon: Bot, tone: 'violet' },
    { href: '/numbers', label: 'WhatsApp numbers', icon: Smartphone, tone: 'green' },
    { href: '/chats', label: 'Chat history', icon: MessagesSquare, tone: 'sky' },
    { href: '/products', label: 'Products', icon: Package, tone: 'amber' },
  ];

  return (
    <>
      {/* Welcome banner */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line" aria-label="Welcome">
        <div className="bg-gradient-to-r from-c-indigo via-c-violet to-c-pink px-6 py-7 text-white">
          <p className="text-sm text-white/85">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Your WhatsApp is answering for you</h1>
          <p className="mt-1 text-white/90">
            {d ? `${d.numbers.connected} of ${d.numbers.total} number${d.numbers.total === 1 ? '' : 's'} connected · AI replies ${d.aiAvailable ? 'on' : 'off'}` : 'Loading…'}
          </p>
        </div>
        <nav className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0" aria-label="Quick links">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="flex flex-col items-center gap-2 px-4 py-5 text-sm font-medium text-ink transition-colors hover:bg-canvas">
              <IconTile icon={q.icon} tone={q.tone} />
              {q.label}
            </Link>
          ))}
        </nav>
      </section>

      {d && d.needsHuman > 0 && (
        <Link href="/chats?filter=human" className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-c-orange-tint p-4 text-c-orange ring-1 ring-auto-edge hover:ring-c-orange">
          <span><b>{d.needsHuman} chat{d.needsHuman === 1 ? '' : 's'} need{d.needsHuman === 1 ? 's' : ''} you.</b> The bot couldn&apos;t answer these.</span>
          <span className="font-semibold underline">Open</span>
        </Link>
      )}

      {/* Date filter */}
      <section className="mt-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line" aria-label="Report period">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick periods">
          {PRESETS.map((p) => {
            const active = from === daysAgo(p.from) && to === daysAgo(0);
            return (
              <button key={p.label} aria-pressed={active} onClick={() => { setFrom(daysAgo(p.from)); setTo(daysAgo(0)); }}
                className={`h-9 rounded-full px-4 text-sm font-semibold ${active ? 'bg-c-indigo text-white' : 'bg-canvas text-ink hover:bg-c-indigo-tint'}`}>{p.label}</button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div><label htmlFor="d-from" className="label">From</label><input id="d-from" type="date" className="input h-9" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} /></div>
          <div><label htmlFor="d-to" className="label">To</label><input id="d-to" type="date" className="input h-9" value={to} min={from} max={daysAgo(0)} onChange={(e) => e.target.value && setTo(e.target.value)} /></div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Totals">
        <StatCard tone="blue" icon={Smartphone} label="WhatsApp numbers" value={d ? `${d.numbers.connected}/${d.numbers.total}` : '–'} sub="connected" />
        <StatCard tone="orange" icon={ArrowDownLeft} label="Messages received" value={d?.totals.received ?? '–'} sub={rangeLabel} />
        <StatCard tone="green" icon={ArrowUpRight} label="Bot replies" value={d?.totals.botReplies ?? '–'} sub={d ? `${d.totals.byFlow} by flows · ${d.totals.byAi} by AI` : undefined} />
        <StatCard tone="pink" icon={Users} label="Subscribers" value={d?.subscribers.total ?? '–'} sub={d ? `+${d.subscribers.newInRange} new ${rangeLabel}` : undefined} />
      </section>

      {/* Per number */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line" aria-labelledby="per-number">
        <div className="flex items-center gap-3 bg-c-green px-5 py-4 text-white">
          <Smartphone className="h-5 w-5" aria-hidden />
          <h2 id="per-number" className="font-display text-lg font-semibold">WhatsApp numbers <span className="font-normal text-white/85">· {rangeLabel}</span></h2>
        </div>
        {!d?.perNumber.length ? (
          <p className="p-5 text-sm text-muted">No numbers linked yet. <Link href="/numbers" className="font-semibold text-c-green underline">Link a number</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-c-green-tint text-xs text-c-green">
                <tr>
                  <th className="px-5 py-3 font-semibold">Number</th><th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Received</th><th className="px-5 py-3 text-right font-semibold">Bot replies</th>
                  <th className="px-5 py-3 text-right font-semibold">Your replies</th><th className="px-5 py-3 font-semibold">Bot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.perNumber.map((n) => (
                  <tr key={n.id}>
                    <td className="px-5 py-3"><p className="font-semibold text-navy">{n.phone ? phone(n.phone) : 'Not linked yet'}</p><p className="text-xs text-muted">{n.label}</p></td>
                    <td className="px-5 py-3"><Status s={n.status} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{n.received}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{n.botReplies}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{n.humanReplies}</td>
                    <td className="px-5 py-3"><StatusPill tone={n.botEnabled ? 'ok' : 'off'}>{n.botEnabled ? 'On' : 'Off'}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {d && steps.some((s) => !s.done) && (
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-line" aria-labelledby="setup">
          <h2 id="setup" className="font-display text-lg font-semibold text-navy">Get set up</h2>
          <ol className="mt-3 space-y-1">
            {steps.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex items-center gap-3 rounded-lg p-2 hover:bg-canvas">
                  {s.done ? <CheckCircle2 className="h-5 w-5 text-c-green" aria-label="Done" /> : <Circle className="h-5 w-5 text-line" aria-label="To do" />}
                  <span className={s.done ? 'text-muted line-through' : 'text-ink'}>{s.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
      {d && !d.aiAvailable && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted"><UserRound className="h-4 w-4" aria-hidden /> AI replies are off (no <code className="font-mono">GEMINI_API_KEY</code> in <code className="font-mono">backend/.env</code>). Flows and fallback messages still work.</p>
      )}
    </>
  );
}
