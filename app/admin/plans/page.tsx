'use client';
import { FormEvent, useState } from 'react';
import { BadgeIndianRupee, Pencil, Plus, Trash2 } from 'lucide-react';
import { errorText, useAdminPlansQuery, useDeletePlanMutation, useSavePlanMutation } from '@/store/api';
import type { Plan } from '@/lib/types';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill, Switch } from '@/components/ui';
import { chats, duration, money } from '@/lib/format';

const CHAT_PRESETS = [10000, 13000, 15000, 50000];
const DURATION_PRESETS = [{ label: '1 month', days: 30 }, { label: '3 months', days: 90 }, { label: '6 months', days: 180 }, { label: '1 year', days: 365 }];
type Draft = { id?: string; name: string; description: string; chatLimit: string; unlimited: boolean; durationDays: string; price: string; currency: string; numbersLimit: string; agentsLimit: string; active: boolean; trial: boolean; sortOrder: string };
const toDraft = (p?: Plan): Draft => ({
  id: p?.id, name: p?.name ?? '', description: p?.description ?? '', chatLimit: p?.chatLimit != null ? String(p.chatLimit) : p ? '' : '10000', unlimited: p ? p.chatLimit == null : false,
  durationDays: String(p?.durationDays ?? 30), price: p ? String(p.price) : '', currency: p?.currency ?? 'INR', numbersLimit: String(p?.numbersLimit ?? 1),
  agentsLimit: String(p?.agentsLimit ?? 1), active: p?.active ?? true, trial: p?.trialForSignup ?? false, sortOrder: String(p?.sortOrder ?? 0),
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`h-8 rounded-full px-3 text-xs font-semibold ${active ? 'bg-c-violet text-white' : 'bg-canvas text-ink hover:bg-c-violet-tint'}`}>{children}</button>;
}

export default function PlansPage() {
  const { data, isLoading, isError } = useAdminPlansQuery();
  const [save, { isLoading: saving, error }] = useSavePlanMutation();
  const [del] = useDeletePlanMutation();
  const [d, setD] = useState<Draft | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!d) return;
    await save({
      id: d.id, name: d.name, description: d.description, chatLimit: d.unlimited ? null : Number(d.chatLimit), durationDays: Number(d.durationDays),
      price: Number(d.price || 0), currency: d.currency, numbersLimit: Number(d.numbersLimit), agentsLimit: Number(d.agentsLimit), active: d.active, trialForSignup: d.trial, sortOrder: Number(d.sortOrder || 0),
    }).unwrap();
    setD(null);
  }

  return (
    <>
      <PageHeader icon={BadgeIndianRupee} tone="violet" title="Plans" description="What customers can buy. Changing a plan doesn't affect plans already activated."
        actions={<button className="btn-primary" onClick={() => setD(toDraft())}><Plus className="h-4 w-4" aria-hidden /> New plan</button>} />
      {isError ? <ErrorNote what="plans" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
        <Empty title="No plans yet">Create plans like &ldquo;Starter · 10,000 chats · 1 month&rdquo;. They appear on the public pricing page and can be activated for customers.</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Plan</th><th className="px-4 py-3 font-semibold">Chats</th><th className="px-4 py-3 font-semibold">Duration</th><th className="px-4 py-3 text-right font-semibold">Price</th><th className="px-4 py-3 font-semibold">Numbers / team</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((p) => (
                <tr key={p.id} className={p.active ? '' : 'opacity-60'}>
                  <td className="px-4 py-3"><p className="font-semibold text-navy">{p.name}{p.trialForSignup && <span className="ml-2 rounded-full bg-c-green-tint px-2 py-0.5 text-xs font-semibold text-c-green">Sign-up trial</span>}</p>{p.description && <p className="text-xs text-muted">{p.description}</p>}</td>
                  <td className="px-4 py-3 tabular-nums">{chats(p.chatLimit)}</td>
                  <td className="px-4 py-3">{duration(p.durationDays)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(p.price, p.currency)}</td>
                  <td className="px-4 py-3">{p.numbersLimit} · {p.agentsLimit}</td>
                  <td className="px-4 py-3"><StatusPill tone={p.active ? 'ok' : 'off'}>{p.active ? 'On sale' : 'Hidden'}</StatusPill><p className="mt-1 text-xs text-muted">{p._count?.subscriptions ?? 0} sold</p></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Edit ${p.name}`} onClick={() => setD(toDraft(p))}><Pencil className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" aria-label={`Delete ${p.name}`}
                      onClick={() => confirm(p._count?.subscriptions ? `"${p.name}" has been sold before, so it will be hidden instead of deleted. Continue?` : `Delete "${p.name}"?`) && del(p.id)}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!d} onClose={() => setD(null)} title={d?.id ? 'Edit plan' : 'New plan'} wide>
        {d && (
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label htmlFor="p-name" className="label">Plan name</label><input id="p-name" className="input" required maxLength={80} placeholder="e.g. Business 15K" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></div>
              <div><label htmlFor="p-desc" className="label">Short description (optional)</label><input id="p-desc" className="input" maxLength={500} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} /></div>
            </div>
            <fieldset>
              <legend className="label">Chats included</legend>
              <div className="mb-2 flex flex-wrap gap-2">
                {CHAT_PRESETS.map((n) => <Chip key={n} active={!d.unlimited && d.chatLimit === String(n)} onClick={() => setD({ ...d, unlimited: false, chatLimit: String(n) })}>{(n / 1000).toLocaleString()}K</Chip>)}
                <Chip active={d.unlimited} onClick={() => setD({ ...d, unlimited: true })}>Unlimited</Chip>
              </div>
              {!d.unlimited && <input aria-label="Chats included" type="number" min={1} className="input w-48" required value={d.chatLimit} onChange={(e) => setD({ ...d, chatLimit: e.target.value })} />}
            </fieldset>
            <fieldset>
              <legend className="label">Duration</legend>
              <div className="mb-2 flex flex-wrap gap-2">
                {DURATION_PRESETS.map((p) => <Chip key={p.days} active={d.durationDays === String(p.days)} onClick={() => setD({ ...d, durationDays: String(p.days) })}>{p.label}</Chip>)}
              </div>
              <div className="flex items-center gap-2"><input aria-label="Duration in days" type="number" min={1} max={3660} className="input w-28" required value={d.durationDays} onChange={(e) => setD({ ...d, durationDays: e.target.value })} /><span className="text-sm text-muted">days</span></div>
            </fieldset>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2"><label htmlFor="p-price" className="label">Price</label>
                <div className="flex gap-2">
                  <select aria-label="Currency" className="input w-24" value={d.currency} onChange={(e) => setD({ ...d, currency: e.target.value })}>{['INR', 'USD', 'AED', 'EUR', 'GBP'].map((c) => <option key={c}>{c}</option>)}</select>
                  <input id="p-price" type="number" min={0} step="0.01" className="input" required value={d.price} onChange={(e) => setD({ ...d, price: e.target.value })} />
                </div>
              </div>
              <div><label htmlFor="p-num" className="label">WhatsApp numbers</label><input id="p-num" type="number" min={1} max={100} className="input" required value={d.numbersLimit} onChange={(e) => setD({ ...d, numbersLimit: e.target.value })} /></div>
              <div><label htmlFor="p-ag" className="label">Agents</label><input id="p-ag" type="number" min={0} max={500} className="input" required value={d.agentsLimit} onChange={(e) => setD({ ...d, agentsLimit: e.target.value })} /></div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3"><Switch checked={d.active} onChange={(v) => setD({ ...d, active: v })} label="On sale" /><span className="text-sm">Show on pricing page and allow activating</span></div>
              <div className="flex items-center gap-3"><Switch checked={d.trial} onChange={(v) => setD({ ...d, trial: v })} label="Free trial for sign-ups" /><span className="text-sm">Free trial for new sign-ups</span></div>
              <div className="flex items-center gap-2"><label htmlFor="p-sort" className="text-sm">Display order</label><input id="p-sort" type="number" className="input h-9 w-20" value={d.sortOrder} onChange={(e) => setD({ ...d, sortOrder: e.target.value })} /></div>
            </div>
            {error && <p className="text-sm text-err">{errorText(error)}</p>}
            <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save plan'}</button>
          </form>
        )}
      </Modal>
    </>
  );
}
