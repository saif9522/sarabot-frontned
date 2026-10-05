'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Eye, KeyRound } from 'lucide-react';
import {
  api, errorText, useActAsMutation, useActivatePlanMutation, useAddOwnerMutation, useAdminPlansQuery, useCustomerQuery, useDeleteCustomerMutation,
  useResetPasswordMutation, useSubActionMutation, useUpdateCustomerMutation,
} from '@/store/api';
import { useAppDispatch } from '@/store/store';
import { ErrorNote, Modal, PageHeader, StatusPill } from '@/components/ui';
import { PlanPill, UsageBar } from '@/components/PlanUsage';
import { chats, duration, fmtDate, money, phone, timeAgo } from '@/lib/format';

function ActivateModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { data: plans } = useAdminPlansQuery();
  const [activate, { isLoading, error }] = useActivatePlanMutation();
  const onSale = (plans ?? []).filter((p) => p.active);
  const [f, setF] = useState({ planId: '', start: 'now' as 'now' | 'after', durationDays: '', amountPaid: '', note: '' });
  const plan = onSale.find((p) => p.id === f.planId);
  async function submit(e: FormEvent) {
    e.preventDefault();
    await activate({
      id: customerId, planId: f.planId, start: f.start, note: f.note || undefined,
      durationDays: f.durationDays ? Number(f.durationDays) : undefined, amountPaid: f.amountPaid !== '' ? Number(f.amountPaid) : undefined,
    }).unwrap();
    onClose();
  }
  return (
    <Modal open onClose={onClose} title="Activate a plan" wide>
      {!onSale.length ? <p className="text-muted">No plans on sale. <Link href="/admin/plans" className="font-semibold text-c-violet underline">Create a plan</Link> first.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <fieldset>
            <legend className="label">Plan</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {onSale.map((p) => (
                <label key={p.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${f.planId === p.id ? 'border-c-violet bg-c-violet-tint' : 'border-line'}`}>
                  <input type="radio" name="plan" className="mt-1" required checked={f.planId === p.id} onChange={() => setF({ ...f, planId: p.id, amountPaid: String(p.price) })} />
                  <span><span className="block font-semibold text-navy">{p.name}</span><span className="text-xs text-muted">{chats(p.chatLimit)} chats · {duration(p.durationDays)} · {money(p.price, p.currency)}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">Starts</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="start" checked={f.start === 'now'} onChange={() => setF({ ...f, start: 'now' })} /> Today (replaces the current plan)</label>
              <label className="flex items-center gap-2"><input type="radio" name="start" checked={f.start === 'after'} onChange={() => setF({ ...f, start: 'after' })} /> When the current plan ends (renewal)</label>
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label htmlFor="a-days" className="label">Days (optional)</label><input id="a-days" type="number" min={1} max={3660} className="input" placeholder={plan ? String(plan.durationDays) : ''} value={f.durationDays} onChange={(e) => setF({ ...f, durationDays: e.target.value })} /></div>
            <div><label htmlFor="a-paid" className="label">Amount received</label><input id="a-paid" type="number" min={0} step="0.01" className="input" value={f.amountPaid} onChange={(e) => setF({ ...f, amountPaid: e.target.value })} /></div>
            <div><label htmlFor="a-note" className="label">Note (payment ref.)</label><input id="a-note" className="input" maxLength={500} placeholder="UPI ref, invoice no." value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
          </div>
          {error && <p className="text-sm text-err">{errorText(error)}</p>}
          <button className="btn-primary" disabled={isLoading || !f.planId}>{isLoading ? 'Activating…' : 'Activate plan'}</button>
        </form>
      )}
    </Modal>
  );
}

export default function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: c, isError } = useCustomerQuery(id);
  const [update] = useUpdateCustomerMutation();
  const [del] = useDeleteCustomerMutation();
  const [subAction] = useSubActionMutation();
  const [actAs] = useActAsMutation();
  const [addOwner, { isLoading: addingOwner, error: ownerErr }] = useAddOwnerMutation();
  const [resetPw] = useResetPasswordMutation();
  const [activating, setActivating] = useState(false);
  const [ownerForm, setOwnerForm] = useState<{ name: string; email: string; password: string } | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  if (isError) return <ErrorNote what="this customer" />;
  if (!c) return <p className="text-muted">Loading…</p>;

  async function open() {
    await actAs(id).unwrap();
    dispatch(api.util.resetApiState());
    window.location.href = '/';
  }
  const now = Date.now();

  return (
    <>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1 text-sm text-c-green hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> All customers</Link>
      <PageHeader icon={Building2} tone="green" title={c.name}
        description={<span className="flex flex-wrap items-center gap-2"><StatusPill tone={c.status === 'active' ? 'ok' : 'off'}>{c.status === 'active' ? 'Active' : 'Suspended'}</StatusPill><PlanPill p={c.plan} /><span className="text-sm">Customer since {fmtDate(c.createdAt)}</span></span>}
        actions={<>
          <button className="btn-secondary" onClick={open}><Eye className="h-4 w-4" aria-hidden /> Open their workspace</button>
          <button className="btn-primary" onClick={() => setActivating(true)}>Activate plan</button>
        </>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2" aria-labelledby="cur">
          <h2 id="cur" className="font-display text-lg font-semibold text-navy">Current plan</h2>
          {c.plan.planName ? (
            <div className="mt-3 space-y-3">
              <p><b>{c.plan.planName}</b> · {c.plan.numbersLimit} number{c.plan.numbersLimit === 1 ? '' : 's'} · {c.plan.agentsLimit} agent{c.plan.agentsLimit === 1 ? '' : 's'}</p>
              <UsageBar p={c.plan} />
              {c.plan.upcoming && <p className="text-sm text-c-violet">Next: {c.plan.upcoming.planName} from {fmtDate(c.plan.upcoming.startsAt)} to {fmtDate(c.plan.upcoming.endsAt)}</p>}
            </div>
          ) : <p className="mt-2 text-sm text-muted">No plan yet. The customer can set up bots and numbers, but the bot won&apos;t reply until a plan is active.</p>}
        </section>
        <section className="card p-5" aria-labelledby="acc">
          <h2 id="acc" className="font-display text-lg font-semibold text-navy">Account</h2>
          <p className="mt-2 text-sm text-muted">{c.accounts.length} number{c.accounts.length === 1 ? '' : 's'} · {c._count?.bots ?? 0} bots · {c._count?.products ?? 0} products</p>
          <ul className="mt-2 space-y-1 text-sm">{c.accounts.map((a) => <li key={a.id} className="flex justify-between gap-2"><span>{a.phone ? phone(a.phone) : a.label}</span><StatusPill tone={a.status === 'connected' ? 'ok' : 'off'}>{a.status === 'connected' ? 'Connected' : 'Disconnected'}</StatusPill></li>)}</ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={c.status === 'active' ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}
              onClick={() => confirm(c.status === 'active' ? `Suspend ${c.name}? Their team can't sign in and the bot stops replying.` : `Reactivate ${c.name}?`) && update({ id, status: c.status === 'active' ? 'suspended' : 'active' })}>
              {c.status === 'active' ? 'Suspend' : 'Reactivate'}
            </button>
            <button className="btn-danger btn-sm" onClick={async () => {
              if (prompt(`This deletes ${c.name} with all numbers, bots, chats and subscribers. Type DELETE to confirm.`) === 'DELETE') { await del(id); router.push('/admin/customers'); }
            }}>Delete customer</button>
          </div>
        </section>
      </div>

      <section className="card mt-6 overflow-x-auto" aria-labelledby="hist">
        <h2 id="hist" className="px-5 pt-5 font-display text-lg font-semibold text-navy">Plan history</h2>
        {!c.subscriptions.length ? <p className="p-5 text-sm text-muted">No plans activated yet.</p> : (
          <table className="mt-3 w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-5 py-3 font-semibold">Plan</th><th className="px-5 py-3 font-semibold">Period</th><th className="px-5 py-3 font-semibold">Chats used</th><th className="px-5 py-3 text-right font-semibold">Paid</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {c.subscriptions.map((s) => {
                const state = s.status === 'cancelled' ? 'Cancelled' : new Date(s.startsAt).getTime() > now ? 'Upcoming' : new Date(s.endsAt).getTime() <= now ? 'Ended' : 'Running';
                const live = state === 'Running' || state === 'Upcoming';
                return (
                  <tr key={s.id}>
                    <td className="px-5 py-3"><p className="font-medium">{s.planName}</p>{s.note && <p className="text-xs text-muted">{s.note}</p>}<p className="text-xs text-muted">by {s.activatedBy}</p></td>
                    <td className="px-5 py-3">{fmtDate(s.startsAt)} → {fmtDate(s.endsAt)}</td>
                    <td className="px-5 py-3 tabular-nums">{s.chatsUsed.toLocaleString('en-IN')} / {chats(s.chatLimit)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(s.amountPaid, s.currency)}</td>
                    <td className="px-5 py-3"><StatusPill tone={state === 'Running' ? 'ok' : state === 'Upcoming' ? 'busy' : 'off'}>{state}</StatusPill></td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      {live && <>
                        <button className="btn-secondary btn-sm" onClick={() => { const d = Number(prompt('Add how many days?', '30')); if (d > 0) subAction({ customerId: id, subId: s.id, action: 'extend', days: d }); }}>+ Days</button>{' '}
                        {s.chatLimit != null && <button className="btn-secondary btn-sm" onClick={() => { const n = Number(prompt('Add how many chats?', '1000')); if (n > 0) subAction({ customerId: id, subId: s.id, action: 'add-chats', chats: n }); }}>+ Chats</button>}{' '}
                        <button className="btn-danger btn-sm" onClick={() => confirm(`Cancel ${s.planName}? The bot stops replying if no other plan is running.`) && subAction({ customerId: id, subId: s.id, action: 'cancel' })}>Cancel</button>
                      </>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="card mt-6 p-5" aria-labelledby="users">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="users" className="font-display text-lg font-semibold text-navy">Logins</h2>
          <button className="btn-secondary btn-sm" onClick={() => setOwnerForm({ name: '', email: '', password: '' })}>Add owner login</button>
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {c.users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <span><b>{u.name}</b> <span className="text-muted">· {u.email} · {u.role}{u.active === false ? ' · disabled' : ''} · last sign-in {timeAgo(u.lastLoginAt)}</span></span>
              <button className="btn-secondary btn-sm" onClick={async () => {
                const pw = prompt(`New password for ${u.email} (8+ characters):`);
                if (pw && pw.length >= 8) { await resetPw({ userId: u.id, password: pw }).unwrap(); alert('Password changed. Share it privately.'); }
                else if (pw) alert('Password must be at least 8 characters.');
              }}><KeyRound className="h-3.5 w-3.5" aria-hidden /> Reset password</button>
            </li>
          ))}
        </ul>
      </section>

      {activating && <ActivateModal customerId={id} onClose={() => setActivating(false)} />}
      <Modal open={!!ownerForm} onClose={() => setOwnerForm(null)} title="Add owner login">
        {ownerForm && (
          <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); await addOwner({ id, ...ownerForm }).unwrap(); setOwnerForm(null); }}>
            <div><label htmlFor="o-name" className="label">Name</label><input id="o-name" className="input" required value={ownerForm.name} onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })} /></div>
            <div><label htmlFor="o-email" className="label">Email</label><input id="o-email" type="email" className="input" required value={ownerForm.email} onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })} /></div>
            <div><label htmlFor="o-pw" className="label">Temporary password</label><input id="o-pw" className="input font-mono" minLength={8} required value={ownerForm.password} onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })} /></div>
            {ownerErr && <p className="text-sm text-err">{errorText(ownerErr)}</p>}
            <button className="btn-primary" disabled={addingOwner}>Add owner</button>
          </form>
        )}
      </Modal>
    </>
  );
}
