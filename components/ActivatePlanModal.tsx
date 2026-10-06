'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { errorText, useActivatePlanMutation, useAdminPlansQuery } from '@/store/api';
import { Modal } from '@/components/ui';
import { chats, duration, money } from '@/lib/format';

/** Super Admin: start a plan (paid, free trial or custom days) for one customer. */
export default function ActivatePlanModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { data: plans } = useAdminPlansQuery();
  const [activate, { isLoading, error }] = useActivatePlanMutation();
  const onSale = (plans ?? []).filter((p) => p.active);
  const [f, setF] = useState({ planId: '', start: 'now' as 'now' | 'after', durationDays: '', amountPaid: '', note: '' });
  const trialPlan = onSale.find((p) => p.price === 0) ?? null;
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
          {trialPlan && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-c-green-tint p-3 text-sm text-c-green">
              <span><b>Quick:</b> {trialPlan.name} free for 7 days. It stops by itself after 7 days.</span>
              <button type="button" className="btn-secondary h-9" onClick={() => setF({ planId: trialPlan.id, start: 'now', durationDays: '7', amountPaid: '0', note: 'Free trial' })}>Fill free trial</button>
            </div>
          )}
          <fieldset>
            <legend className="label">Plan</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {onSale.map((p) => (
                <label key={p.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${f.planId === p.id ? 'border-c-violet bg-c-violet-tint' : 'border-line'}`}>
                  <input type="radio" name="plan" className="mt-1" required checked={f.planId === p.id} onChange={() => setF({ ...f, planId: p.id, amountPaid: String(p.price) })} />
                  <span><span className="block font-semibold text-navy">{p.name}{p.price === 0 && <span className="ml-2 rounded-full bg-c-green-tint px-2 py-0.5 text-[11px] font-semibold text-c-green">Free</span>}</span><span className="text-xs text-muted">{chats(p.chatLimit)} chats · {duration(p.durationDays)} · {money(p.price, p.currency)}</span></span>
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
            <div><label htmlFor="a-days" className="label">Days (optional)</label><p className="hint mb-1">Leave empty to use the plan&apos;s days.</p><input id="a-days" type="number" min={1} max={3660} className="input" placeholder={plan ? String(plan.durationDays) : ''} value={f.durationDays} onChange={(e) => setF({ ...f, durationDays: e.target.value })} /></div>
            <div><label htmlFor="a-paid" className="label">Amount received</label><input id="a-paid" type="number" min={0} step="0.01" className="input" value={f.amountPaid} onChange={(e) => setF({ ...f, amountPaid: e.target.value })} /></div>
            <div><label htmlFor="a-note" className="label">Note (payment ref.)</label><input id="a-note" className="input" maxLength={500} placeholder="UPI ref, invoice no." value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
          </div>
          {plan && <p className="rounded-xl bg-canvas p-3 text-sm">Runs for <b>{f.durationDays || plan.durationDays} days</b>{f.start === 'now' ? ' from today' : ' after the current plan'} and switches off automatically when it ends.</p>}
          {error && <p className="text-sm text-err">{errorText(error)}</p>}
          <button className="btn-primary" disabled={isLoading || !f.planId}>{isLoading ? 'Activating…' : 'Activate plan'}</button>
        </form>
      )}
    </Modal>
  );
}
