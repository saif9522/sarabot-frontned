'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IdCard, KeyRound, Trash2 } from 'lucide-react';
import { useDeleteUserMutation, usePlatformUsersQuery, useResetPasswordMutation, useUpdateUserMutation } from '@/store/api';
import { Empty, ErrorNote, PageHeader, StatusPill, Switch } from '@/components/ui';
import { fmtDate, timeAgo } from '@/lib/format';

const ROLE = { owner: 'Owner', admin: 'Admin', agent: 'Agent', superadmin: 'Super Admin' } as const;

export default function UsersPage() {
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => { const t = setTimeout(() => setQ(input.trim()), 300); return () => clearTimeout(t); }, [input]);
  const { data, isLoading, isError } = usePlatformUsersQuery({ ...(q ? { q } : {}), ...(role ? { role } : {}), ...(status ? { status } : {}) });
  const [update] = useUpdateUserMutation();
  const [del] = useDeleteUserMutation();
  const [resetPw] = useResetPasswordMutation();
  const counts = { owner: 0, admin: 0, agent: 0 } as Record<string, number>;
  data?.forEach((u) => { counts[u.role] = (counts[u.role] ?? 0) + 1; });

  return (
    <>
      <PageHeader icon={IdCard} tone="blue" title="Users & agents" description="Every person who can sign in, across all customers." />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-80"><label htmlFor="u-q" className="label">Search</label><input id="u-q" className="input" placeholder="Name, email, mobile or business" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div className="w-44"><label htmlFor="u-role" className="label">Role</label>
          <select id="u-role" className="input" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option value="owner">Owners</option><option value="admin">Admins</option><option value="agent">Agents</option></select>
        </div>
        <div className="w-44"><label htmlFor="u-st" className="label">Status</label>
          <select id="u-st" className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any</option><option value="active">Active</option><option value="disabled">Disabled</option></select>
        </div>
        {data && <p className="h-10 text-sm leading-10 text-muted">{data.length} shown · {counts.owner} owners · {counts.admin} admins · {counts.agent} agents</p>}
      </div>
      {isError ? <ErrorNote what="users" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? <Empty title="No users found" /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Person</th><th className="px-4 py-3 font-semibold">Mobile</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Chats</th><th className="px-4 py-3 font-semibold">Joined</th><th className="px-4 py-3 font-semibold">Last sign-in</th><th className="px-4 py-3 font-semibold">Active</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((u) => (
                <tr key={u.id} className={u.active ? '' : 'opacity-60'}>
                  <td className="px-4 py-3"><p className="font-semibold text-navy">{u.name}</p><p className="text-xs text-muted">{u.email}</p></td>
                  <td className="px-4 py-3 text-muted">{u.mobile || '—'}</td>
                  <td className="px-4 py-3">{u.workspace ? <Link href={`/admin/customers/${u.workspace.id}`} className="text-c-blue hover:underline">{u.workspace.name}</Link> : '—'}{u.workspace?.status === 'suspended' && <span className="ml-1 text-xs text-err">(suspended)</span>}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`r-${u.id}`}>Role of {u.name}</label>
                    <select id={`r-${u.id}`} className="input h-8 w-28 text-xs" value={u.role} onChange={(e) => update({ id: u.id, role: e.target.value })}>
                      {(['owner', 'admin', 'agent'] as const).map((r) => <option key={r} value={r}>{ROLE[r]}</option>)}
                    </select>
                    {u.role === 'agent' && <p className="mt-1 text-[11px] text-muted">{u.seeUnassigned ? 'Sees unassigned' : 'Assigned only'}</p>}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{u._count.assigned}</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-muted">{timeAgo(u.lastLoginAt)}</td>
                  <td className="px-4 py-3"><Switch checked={u.active} label={`${u.name} active`} onChange={(v) => update({ id: u.id, active: v })} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Reset password for ${u.name}`} onClick={async () => {
                      const pw = prompt(`New password for ${u.email} (8+ characters):`);
                      if (pw && pw.length >= 8) { await resetPw({ userId: u.id, password: pw }).unwrap(); alert('Password changed and their other sessions signed out. Share it privately.'); }
                      else if (pw) alert('Password must be at least 8 characters.');
                    }}><KeyRound className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" aria-label={`Delete ${u.name}`} onClick={() => confirm(`Delete ${u.name} (${u.email})? Their chats become unassigned.`) && del(u.id)}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Turning someone off signs them out immediately and unassigns their chats.</p>
    </>
  );
}
