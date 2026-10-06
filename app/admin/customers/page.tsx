'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Eye, Pencil, Plus, Trash2, Zap } from 'lucide-react';
import { errorText, useAddCustomerMutation, useCustomersQuery, useDeleteCustomerMutation, useUpdateCustomerMutation, useUpdateUserMutation } from '@/store/api';
import type { Customer } from '@/lib/types';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill } from '@/components/ui';
import { PlanPill, UsageBar } from '@/components/PlanUsage';
import ActivatePlanModal from '@/components/ActivatePlanModal';

export default function CustomersPage() {
  const { data, isLoading, isError } = useCustomersQuery();
  const [add, { isLoading: adding, error }] = useAddCustomerMutation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [f, setF] = useState({ businessName: '', ownerName: '', ownerEmail: '', ownerMobile: '', password: '', notes: '' });
  const router = useRouter();
  const [updateCustomer, { isLoading: savingC, error: errC, reset: resetC }] = useUpdateCustomerMutation();
  const [updateOwner, { isLoading: savingO, error: errO, reset: resetO }] = useUpdateUserMutation();
  const [delCustomer] = useDeleteCustomerMutation();
  type EditDraft = { id: string; name: string; status: 'active' | 'suspended'; notes: string; ownerId: string | null; ownerName: string; ownerEmail: string; ownerMobile: string };
  const [ed, setEd] = useState<EditDraft | null>(null);
  const [activateFor, setActivateFor] = useState<string | null>(null);

  function openEdit(c: Customer) {
    resetC(); resetO();
    const o = c.users[0];
    setEd({ id: c.id, name: c.name, status: c.status, notes: c.notes ?? '', ownerId: o?.id ?? null, ownerName: o?.name ?? '', ownerEmail: o?.email ?? '', ownerMobile: o?.mobile ?? '' });
  }
  async function submitEdit(e: FormEvent) {
    e.preventDefault();
    if (!ed) return;
    await updateCustomer({ id: ed.id, name: ed.name.trim(), status: ed.status, notes: ed.notes }).unwrap();
    if (ed.ownerId) await updateOwner({ id: ed.ownerId, name: ed.ownerName.trim(), email: ed.ownerEmail.trim(), mobile: ed.ownerMobile.trim() }).unwrap();
    setEd(null);
  }
  async function remove(c: Customer) {
    const typed = prompt(`This permanently deletes "${c.name}" with all its numbers, bots, products, chats, team and payment history.\n\nType the business name to confirm:`);
    if (typed === null) return;
    if (typed.trim() !== c.name) { alert('The name did not match. Nothing was deleted.'); return; }
    try { await delCustomer(c.id).unwrap(); } catch (err) { alert(errorText(err, 'Could not delete this customer')); }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const w = await add({ ...f, ownerMobile: f.ownerMobile || undefined, notes: f.notes || undefined }).unwrap();
    router.push(`/admin/customers/${w.id}`);
  }
  const term = q.trim().toLowerCase();
  const rows = (data ?? []).filter((c) => !term || c.name.toLowerCase().includes(term) || c.users.some((u) => u.email.includes(term) || u.name.toLowerCase().includes(term) || u.mobile.includes(term)));

  return (
    <>
      <PageHeader icon={Building2} tone="green" title="Customers" description="Each customer has their own numbers, bots, chats and team."
        actions={<button className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" aria-hidden /> Add customer</button>} />
      <div className="mb-4 w-80"><label htmlFor="c-q" className="sr-only">Search customers</label><input id="c-q" className="input" placeholder="Search business, owner, email or mobile" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {isError ? <ErrorNote what="customers" /> : isLoading ? <p className="text-muted">Loading…</p> : !rows.length ? (
        <Empty title={term ? 'No matches' : 'No customers yet'}>{term ? 'Try another search.' : 'Add a customer to create their login, then activate a plan for them.'}</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Owner</th><th className="px-4 py-3 font-semibold">Plan</th><th className="w-56 px-4 py-3 font-semibold">Chats</th><th className="px-4 py-3 font-semibold">Numbers</th><th className="px-4 py-3 font-semibold">Account</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3"><Link href={`/admin/customers/${c.id}`} className="font-semibold text-navy hover:underline">{c.name}</Link></td>
                  <td className="px-4 py-3">{c.users[0] ? <><p>{c.users[0].name}</p><p className="text-xs text-muted">{c.users[0].email}</p></> : <span className="text-c-orange">No owner login</span>}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setActivateFor(c.id)} title={c.plan.active ? 'Change or renew plan' : 'Activate a plan'} className="group text-left">
                      <p className="font-medium group-hover:underline">{c.plan.active ? c.plan.planName : 'No plan'}</p>
                      {c.plan.active ? <PlanPill p={c.plan} /> : <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-c-violet px-2.5 py-0.5 text-xs font-semibold text-white"><Zap className="h-3 w-3" aria-hidden />Activate</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3">{c.plan.planName ? <UsageBar p={c.plan} /> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3">{c._count?.accounts ?? 0}</td>
                  <td className="px-4 py-3"><StatusPill tone={c.status === 'active' ? 'ok' : 'off'}>{c.status === 'active' ? 'Active' : 'Suspended'}</StatusPill></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button className="mr-1 inline-flex h-8 items-center gap-1 rounded-lg bg-c-violet-tint px-2.5 text-xs font-semibold text-c-violet hover:bg-c-violet hover:text-white" title="Activate plan" onClick={() => setActivateFor(c.id)}><Zap className="h-3.5 w-3.5" aria-hidden />Activate plan</button>
                    <Link href={`/admin/customers/${c.id}`} className="inline-flex rounded p-2 text-muted hover:bg-canvas" title="View" aria-label={`View ${c.name}`}><Eye className="h-4 w-4" /></Link>
                    <button className="rounded p-2 text-muted hover:bg-canvas" title="Edit" aria-label={`Edit ${c.name}`} onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" title="Delete" aria-label={`Delete ${c.name}`} onClick={() => remove(c)}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add customer" wide>
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="n-biz" className="label">Business name</label><input id="n-biz" className="input" required maxLength={120} value={f.businessName} onChange={(e) => setF({ ...f, businessName: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label htmlFor="n-name" className="label">Owner name</label><input id="n-name" className="input" required maxLength={120} value={f.ownerName} onChange={(e) => setF({ ...f, ownerName: e.target.value })} /></div>
            <div><label htmlFor="n-mob" className="label">Owner mobile (optional)</label><input id="n-mob" type="tel" className="input" maxLength={20} value={f.ownerMobile} onChange={(e) => setF({ ...f, ownerMobile: e.target.value })} /></div>
            <div><label htmlFor="n-email" className="label">Owner login email</label><input id="n-email" type="email" autoComplete="off" className="input" required value={f.ownerEmail} onChange={(e) => setF({ ...f, ownerEmail: e.target.value })} /></div>
            <div><label htmlFor="n-pw" className="label">Temporary password</label><input id="n-pw" type="text" autoComplete="off" minLength={8} className="input font-mono" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /><p className="hint">8+ characters. Share it privately; they can change it after signing in.</p></div>
          </div>
          <div><label htmlFor="n-notes" className="label">Internal notes (optional)</label><textarea id="n-notes" className="textarea min-h-16" maxLength={2000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
          {error && <p className="text-sm text-err">{errorText(error)}</p>}
          <button className="btn-primary" disabled={adding}>{adding ? 'Creating…' : 'Create customer'}</button>
        </form>
      </Modal>

      {activateFor && <ActivatePlanModal customerId={activateFor} onClose={() => setActivateFor(null)} />}

      <Modal open={!!ed} onClose={() => setEd(null)} title="Edit customer" wide>
        {ed && (
          <form onSubmit={submitEdit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label htmlFor="ec-biz" className="label">Business name</label><input id="ec-biz" className="input" required maxLength={120} value={ed.name} onChange={(e) => setEd({ ...ed, name: e.target.value })} /></div>
              <div><label htmlFor="ec-st" className="label">Account</label>
                <select id="ec-st" className="input" value={ed.status} onChange={(e) => setEd({ ...ed, status: e.target.value as 'active' | 'suspended' })}>
                  <option value="active">Active</option><option value="suspended">Suspended (bot stops, team can&apos;t work)</option>
                </select>
              </div>
            </div>
            {ed.ownerId ? (
              <fieldset className="grid gap-3 sm:grid-cols-3">
                <legend className="label">Owner</legend>
                <div><label htmlFor="ec-on" className="label">Name</label><input id="ec-on" className="input" required maxLength={120} value={ed.ownerName} onChange={(e) => setEd({ ...ed, ownerName: e.target.value })} /></div>
                <div><label htmlFor="ec-oe" className="label">Login email</label><input id="ec-oe" type="email" className="input" required value={ed.ownerEmail} onChange={(e) => setEd({ ...ed, ownerEmail: e.target.value })} /></div>
                <div><label htmlFor="ec-om" className="label">Mobile</label><input id="ec-om" type="tel" className="input" maxLength={20} value={ed.ownerMobile} onChange={(e) => setEd({ ...ed, ownerMobile: e.target.value })} /></div>
              </fieldset>
            ) : <p className="text-sm text-c-orange">This customer has no owner login. Open the customer to add one.</p>}
            <div><label htmlFor="ec-notes" className="label">Internal notes</label><textarea id="ec-notes" className="textarea min-h-16" maxLength={2000} value={ed.notes} onChange={(e) => setEd({ ...ed, notes: e.target.value })} /></div>
            {(errC || errO) && <p className="text-sm text-err">{errorText(errC ?? errO)}</p>}
            <div className="flex gap-2">
              <button className="btn-primary" disabled={savingC || savingO}>{savingC || savingO ? 'Saving…' : 'Save changes'}</button>
              <button type="button" className="btn-secondary" onClick={() => setEd(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
