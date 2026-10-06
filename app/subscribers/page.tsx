'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Users } from 'lucide-react';
import { useAccountsQuery, useSubscribersQuery, useUpdateContactMutation } from '@/store/api';
import { Empty, ErrorNote, PageHeader, StatusPill } from '@/components/ui';
import { API_URL, phone, timeAgo } from '@/lib/format';

export default function SubscribersPage() {
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [accountId, setAccountId] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);
  const { data: accounts } = useAccountsQuery();
  const { data, isLoading, isError } = useSubscribersQuery({ ...(q ? { q } : {}), ...(accountId ? { accountId } : {}) });
  const [update] = useUpdateContactMutation();

  return (
    <>
      <PageHeader icon={Users} tone="pink" title="Subscribers" description="Everyone who has messaged your numbers. People who send STOP are unsubscribed and get no automatic replies."
        actions={<a className="btn-secondary" href={`${API_URL}/subscribers.csv`}><Download className="h-4 w-4" aria-hidden /> Export CSV</a>} />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-72"><label htmlFor="s-q" className="label">Search</label><input id="s-q" className="input" placeholder="Name, number or tag" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div className="w-60">
          <label htmlFor="s-acc" className="label">Number</label>
          <select id="s-acc" className="input" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">All numbers</option>
            {accounts?.map((a) => <option key={a.id} value={a.id}>{a.phone ? phone(a.phone) : a.label}</option>)}
          </select>
        </div>
        {data && <p className="h-10 text-sm leading-10 text-muted">{data.length.toLocaleString()} shown</p>}
      </div>
      {isError ? <ErrorNote what="subscribers" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
        <Empty title={q ? 'No matches' : 'No subscribers yet'}>{q ? 'Try a different name or number.' : 'People appear here after they message a linked number.'}</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-c-indigo-tint text-xs text-c-indigo">
              <tr>
                <th className="px-4 py-3 font-semibold">Subscriber</th><th className="px-4 py-3 font-semibold">Via number</th><th className="px-4 py-3 font-semibold">Tags</th>
                <th className="px-4 py-3 font-semibold">Messages</th><th className="px-4 py-3 font-semibold">First seen</th><th className="px-4 py-3 font-semibold">Last message</th><th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3"><Link href="/chats" className="font-medium text-navy hover:underline">{c.name || '—'}</Link><p className="text-xs text-muted">{phone(c.waId)}</p></td>
                  <td className="px-4 py-3 text-muted">{c.account?.phone ? phone(c.account.phone) : c.account?.label}</td>
                  <td className="px-4 py-3">
                    <label htmlFor={`tags-${c.id}`} className="sr-only">Tags for {c.name || c.waId}</label>
                    <input id={`tags-${c.id}`} className="input h-8 w-40 text-xs" defaultValue={c.tags} placeholder="vip, wholesale" maxLength={300}
                      onBlur={(e) => e.target.value !== c.tags && update({ id: c.id, tags: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">{c.messageCount}</td>
                  <td className="px-4 py-3 text-muted">{timeAgo(c.firstSeenAt)}</td>
                  <td className="px-4 py-3 text-muted">{timeAgo(c.lastMessageAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusPill tone={c.optedOut ? 'off' : 'ok'}>{c.optedOut ? 'Unsubscribed' : 'Subscribed'}</StatusPill>
                      <button className="text-xs font-medium text-brand-dark hover:underline" onClick={() => update({ id: c.id, optedOut: !c.optedOut })}>{c.optedOut ? 'Resubscribe' : 'Unsubscribe'}</button>
                    </div>
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
