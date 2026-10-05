'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ReceiptIndianRupee } from 'lucide-react';
import { useAdminPaymentsQuery } from '@/store/api';
import { Empty, ErrorNote, PageHeader, StatusPill } from '@/components/ui';
import { fmtDate, money } from '@/lib/format';

export default function PaymentsPage() {
  const [status, setStatus] = useState('paid');
  const { data, isLoading, isError } = useAdminPaymentsQuery(status ? { status } : {});
  const total = (data ?? []).filter((p) => p.status === 'paid').reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.currency]: (acc[p.currency] ?? 0) + p.amount / 100 }), {});
  return (
    <>
      <PageHeader icon={ReceiptIndianRupee} tone="pink" title="Payments" description="Online payments through Razorpay. Paid orders activate their plan automatically." />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48"><label htmlFor="p-st" className="label">Show</label>
          <select id="p-st" className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="paid">Paid</option><option value="created">Started, not paid</option><option value="failed">Failed</option><option value="">All</option></select>
        </div>
        {!!Object.keys(total).length && <p className="h-10 text-sm leading-10 text-muted">Total shown: <b className="text-navy">{Object.entries(total).map(([c, a]) => money(a, c)).join(' + ')}</b></p>}
      </div>
      {isError ? <ErrorNote what="payments" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
        <Empty title="No payments here">Payments appear when customers buy a plan on their Plan &amp; usage page. Set the Razorpay keys in Platform settings first.</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Plan</th><th className="px-4 py-3 text-right font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Razorpay</th><th className="px-4 py-3 font-semibold">Paid by</th></tr></thead>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
