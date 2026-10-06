'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ReceiptIndianRupee, Zap } from 'lucide-react';
import { errorText, useActivatePaymentMutation, useAdminPaymentsQuery } from '@/store/api';
import { Empty, ErrorNote, PageHeader, StatusPill } from '@/components/ui';
import { fmtDate, money } from '@/lib/format';

export default function PaymentsPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading, isError } = useAdminPaymentsQuery(status ? { status } : {});
  const [activatePayment, { isLoading: activating }] = useActivatePaymentMutation();
  async function activate(id: string, customer: string, plan: string) {
    const ref = prompt(`Did the money for "${plan}" really reach your Razorpay account from ${customer}?\n\nCheck Razorpay → Payments first. Paste the Razorpay payment ID (pay_...) to confirm, or leave it empty:`);
    if (ref === null) return;
    try {
      const r = await activatePayment({ id, razorpayPaymentId: ref.trim() || undefined }).unwrap();
      alert(`Done. ${r.planName} runs from ${fmtDate(r.startsAt)} to ${fmtDate(r.endsAt)}.`);
    } catch (e) {
      alert(errorText(e, 'Could not activate'));
    }
  }
  const total = (data ?? []).filter((p) => p.status === 'paid').reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.currency]: (acc[p.currency] ?? 0) + p.amount / 100 }), {});
  return (
    <>
      <PageHeader icon={ReceiptIndianRupee} tone="pink" title="Payments" description="Online payments through Razorpay. Paid orders start their plan automatically. If money arrived but the plan did not start, use Mark paid & start plan." />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48"><label htmlFor="p-st" className="label">Show</label>
          <select id="p-st" className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option value="paid">Paid</option><option value="created">Started, not paid</option><option value="failed">Failed</option></select>
        </div>
        {!!Object.keys(total).length && <p className="h-10 text-sm leading-10 text-muted">Total shown: <b className="text-navy">{Object.entries(total).map(([c, a]) => money(a, c)).join(' + ')}</b></p>}
      </div>
      {isError ? <ErrorNote what="payments" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
        <Empty title="No payments here">Payments appear when customers buy a plan on their Plan &amp; usage page. Set the Razorpay keys in Platform settings first.</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Plan</th><th className="px-4 py-3 text-right font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Razorpay</th><th className="px-4 py-3 font-semibold">Paid by</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">{fmtDate(p.paidAt ?? p.createdAt)}</td>
                  <td className="px-4 py-3">{p.workspace ? <Link href={`/admin/customers/${p.workspace.id}`} className="font-medium text-navy hover:underline">{p.workspace.name}</Link> : '—'}</td>
                  <td className="px-4 py-3">{p.planName}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(p.amount / 100, p.currency)}</td>
                  <td className="px-4 py-3"><StatusPill tone={p.status === 'paid' ? 'ok' : p.status === 'failed' ? 'off' : 'busy'}>{p.status === 'paid' ? 'Paid' : p.status === 'failed' ? 'Failed' : 'Not paid'}</StatusPill></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.razorpayPaymentId ?? p.razorpayOrderId}</td>
                  <td className="px-4 py-3 text-muted">{p.paidBy}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {!p.subscriptionId ? (
                      <button disabled={activating} onClick={() => activate(p.id, p.workspace?.name ?? 'this customer', p.planName)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-c-violet-tint px-2.5 text-xs font-semibold text-c-violet hover:bg-c-violet hover:text-white">
                        <Zap className="h-3.5 w-3.5" aria-hidden />{p.status === 'paid' ? 'Start plan' : 'Mark paid & start plan'}
                      </button>
                    ) : <span className="text-xs text-c-green">Plan started</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
