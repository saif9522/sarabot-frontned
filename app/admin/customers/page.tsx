'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Plus } from 'lucide-react';
import { errorText, useAddCustomerMutation, useCustomersQuery } from '@/store/api';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill } from '@/components/ui';
import { PlanPill, UsageBar } from '@/components/PlanUsage';

export default function CustomersPage() {
  const { data, isLoading, isError } = useCustomersQuery();
  const [add, { isLoading: adding, error }] = useAddCustomerMutation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [f, setF] = useState({ businessName: '', ownerName: '', ownerEmail: '', ownerMobile: '', password: '', notes: '' });
  const router = useRouter();

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
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Owner</th><th className="px-4 py-3 font-semibold">Plan</th><th className="w-56 px-4 py-3 font-semibold">Chats</th><th className="px-4 py-3 font-semibold">Numbers</th><th className="px-4 py-3 font-semibold">Account</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3"><Link href={`/admin/customers/${c.id}`} className="font-semibold text-navy hover:underline">{c.name}</Link></td>
                  <td className="px-4 py-3">{c.users[0] ? <><p>{c.users[0].name}</p><p className="text-xs text-muted">{c.users[0].email}</p></> : <span className="text-c-orange">No owner login</span>}</td>
                  <td className="px-4 py-3"><p className="font-medium">{c.plan.planName ?? '—'}</p><PlanPill p={c.plan} /></td>
                  <td className="px-4 py-3">{c.plan.planName ? <UsageBar p={c.plan} /> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3">{c._count?.accounts ?? 0}</td>
                  <td className="px-4 py-3"><StatusPill tone={c.status === 'active' ? 'ok' : 'off'}>{c.status === 'active' ? 'Active' : 'Suspended'}</StatusPill></td>
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
    </>
  );
}
