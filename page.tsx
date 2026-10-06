'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, IdCard, KeyRound, Pencil, Trash2 } from 'lucide-react';
import { errorText, useDeleteUserMutation, usePlatformUsersQuery, useResetPasswordMutation, useUpdateUserMutation } from '@/store/api';
import type { PlatformUser } from '@/lib/types';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill, Switch } from '@/components/ui';
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
  const [saveUser, { isLoading: saving, error: saveError, reset: resetSave }] = useUpdateUserMutation();
  const [del] = useDeleteUserMutation();
  const [viewing, setViewing] = useState<PlatformUser | null>(null);
  const [editing, setEditing] = useState<{ id: string; name: string; email: string; mobile: string; role: string } | null>(null);

  function openEdit(u: PlatformUser) {
    resetSave();
    setEditing({ id: u.id, name: u.name, email: u.email, mobile: u.mobile ?? '', role: u.role });
  }
  async function submitEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    await saveUser({ id: editing.id, name: editing.name.trim(), email: editing.email.trim(), mobile: editing.mobile.trim(), role: editing.role }).unwrap();
    setEditing(null);
  }
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
                    <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`View ${u.name}`} title="View" onClick={() => setViewing(u)}><Eye className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Edit ${u.name}`} title="Edit" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-canvas" title="Reset password" aria-label={`Reset password for ${u.name}`} onClick={async () => {
                      const pw = prompt(`New password for ${u.email} (8+ characters):`);
                      if (pw && pw.length >= 8) { await resetPw({ userId: u.id, password: pw }).unwrap(); alert('Password changed and their other sessions signed out. Share it privately.'); }
                      else if (pw) alert('Password must be at least 8 characters.');
                    }}><KeyRound className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" title="Delete" aria-label={`Delete ${u.name}`} onClick={() => confirm(`Delete ${u.name} (${u.email})? Their chats become unassigned.`) && del(u.id)}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Turning someone off signs them out immediately and unassigns their chats.</p>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="User details">
        {viewing && (
          <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
            <dt className="text-muted">Name</dt><dd className="col-span-2 font-semibold text-navy">{viewing.name}</dd>
            <dt className="text-muted">Email</dt><dd className="col-span-2 break-all">{viewing.email}</dd>
            <dt className="text-muted">Mobile</dt><dd className="col-span-2">{viewing.mobile || '—'}</dd>
            <dt className="text-muted">Role</dt><dd className="col-span-2">{ROLE[viewing.role]}{viewing.role === 'agent' && ` · ${viewing.seeUnassigned ? 'sees unassigned chats' : 'assigned chats only'}`}</dd>
            <dt className="text-muted">Customer</dt><dd className="col-span-2">{viewing.workspace ? <Link href={`/admin/customers/${viewing.workspace.id}`} className="text-c-blue hover:underline">{viewing.workspace.name}</Link> : '—'}{viewing.workspace?.status === 'suspended' && <span className="ml-1 text-xs text-err">(suspended)</span>}</dd>
            <dt className="text-muted">Status</dt><dd className="col-span-2"><StatusPill tone={viewing.active ? 'ok' : 'off'}>{viewing.active ? 'Active' : 'Disabled'}</StatusPill></dd>
            <dt className="text-muted">Chats assigned</dt><dd className="col-span-2 tabular-nums">{viewing._count.assigned}</dd>
            <dt className="text-muted">Joined</dt><dd className="col-span-2">{fmtDate(viewing.createdAt)}</dd>
            <dt className="text-muted">Last sign-in</dt><dd className="col-span-2">{timeAgo(viewing.lastLoginAt)}</dd>
            <div className="col-span-3 mt-2 flex gap-2">
              <button className="btn-primary" onClick={() => { const u = viewing; setViewing(null); openEdit(u); }}><Pencil className="h-4 w-4" aria-hidden /> Edit</button>
              <button className="btn-secondary" onClick={() => setViewing(null)}>Close</button>
            </div>
          </dl>
        )}
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit user">
        {editing && (
          <form onSubmit={submitEdit} className="space-y-4">
            <div><label htmlFor="e-name" className="label">Name</label><input id="e-name" className="input" required minLength={1} maxLength={120} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label htmlFor="e-email" className="label">Login email</label><input id="e-email" type="email" className="input" required value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /><p className="hint">They sign in with this email from now on.</p></div>
            <div><label htmlFor="e-mob" className="label">Mobile</label><input id="e-mob" type="tel" className="input" maxLength={20} value={editing.mobile} onChange={(e) => setEditing({ ...editing, mobile: e.target.value })} /></div>
            <div><label htmlFor="e-role" className="label">Role</label>
              <select id="e-role" className="input" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>
                {(['owner', 'admin', 'agent'] as const).map((r) => <option key={r} value={r}>{ROLE[r]}</option>)}
              </select>
            </div>
            {saveError && <p className="text-sm text-err">{errorText(saveError)}</p>}
            <div className="flex gap-2">
              <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
