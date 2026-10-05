import type { PlanStatus } from '@/lib/types';
import { chats, fmtDate } from '@/lib/format';
import { StatusPill } from './ui';

export function PlanPill({ p }: { p: PlanStatus }) {
  if (p.active) return <StatusPill tone="ok">Active · {p.daysLeft} day{p.daysLeft === 1 ? '' : 's'} left</StatusPill>;
  const label = { none: 'No plan', expired: 'Expired', used_up: 'Chats used up', suspended: 'Suspended' }[p.reason ?? 'none'];
  return <StatusPill tone={p.reason === 'none' ? 'busy' : 'off'}>{label}</StatusPill>;
}

/** Chats used vs limit as a bar. */
export function UsageBar({ p }: { p: PlanStatus }) {
  const pct = p.chatLimit ? Math.min(100, Math.round((p.chatsUsed / p.chatLimit) * 100)) : 0;
  const color = pct >= 90 ? 'bg-err' : pct >= 70 ? 'bg-c-orange' : 'bg-c-green';
  return (
    <div>
      <div className="flex justify-between text-xs text-muted">
        <span>{p.chatsUsed.toLocaleString('en-IN')} used</span>
        <span>{p.chatLimit == null ? 'Unlimited' : `${chats(p.chatLimit)} total`}</span>
      </div>
      {p.chatLimit != null && (
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Chats used">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      {p.endsAt && <p className="mt-1 text-xs text-muted">{p.active ? 'Ends' : 'Ended'} {fmtDate(p.endsAt)}</p>}
    </div>
  );
}
