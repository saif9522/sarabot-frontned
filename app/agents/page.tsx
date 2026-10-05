'use client';
import { FormEvent, useState } from 'react';
import { Pencil, Plus, Trash2, UserCog } from 'lucide-react';
import { errorText, useAgentsQuery, useDeleteAgentMutation, useMeQuery, useSaveAgentMutation, useTeamSettingsMutation } from '@/store/api';
import type { TeamUser } from '@/lib/types';
import { ErrorNote, Modal, PageHeader, StatusPill, Switch } from '@/components/ui';
import { fmtDate, timeAgo } from '@/lib/format';

type Draft = { id?: string; name: string; email: string; mobile: string; password: string; role: 'admin' | 'agent'; seeUnassigned: boolean };
const blank: Draft = { name: '', email: '', mobile: '', password: '', role: 'agent', seeUnassigned: true };

export default function AgentsPage() {
  const { data, isLoading, isError } = useAgentsQuery();
  const { data: me } = useMeQuery();
  const [save, { isLoading: saving, error, reset }] = useSaveAgentMutation();
  const [del] = useDeleteAgentMutation();
  const [settings] = useTeamSettingsMutation();
  const [d, setD] = useState<Draft | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!d) return;
    const { id, password, email, ...rest } = d;
    await save(id ? { id, ...rest, ...(password ? { password } : {}) } : { ...rest, email, password }).unwrap();
    setD(null);
  }
  const edit = (u: TeamUser) => { reset(); setD({ id: u.id, name: u.name, email: u.email, mobile: u.mobile, password: '', role: u.role as 'admin' | 'agent', seeUnassigned: u.seeUnassigned }); };
  const full = data ? data.agentsUsed >= data.agentsLimit : false;

  return (
    <>
      <PageHeader icon={UserCog} tone="blue" title="Agents" description="Your team. Agents answer the chats assigned to them; admins can also manage bots, numbers and the team."
        actions={<button className="btn-primary" disabled={full} title={full ? 'Your plan limit is reached' : undefined} onClick={() => { reset(); setD({ ...blank }); }}><Plus className="h-4 w-4" aria-hidden /> Add agent</button>} />
      {isError ? <ErrorNote what="your team" /> : isLoading || !data ? <p className="text-muted">Loading…</p> : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line">
            <div className="flex items-center gap-3">
              <Switch checked={data.autoAssign} label="Auto-assign chats" onChange={(v) => settings({ autoAssign: v })} />
              <span><span className="block text-sm font-semibold text-navy">Auto-assign new chats</span><span className="text-xs text-muted">New customers are shared between active agents in turn.</span></span>
            </div>
            <p className={`text-sm ${full ? 'text-c-orange' : 'text-muted'}`}>{data.agentsUsed} of {data.agentsLimit} team seats used{full ? ' · ask your administrator for more' : ''}</p>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs"><tr><th className="px-4 py-3 font-semibold">Name</th><th className="px-4 py-3 font-semibold">Mobile</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Sees unassigned chats</th><th className="px-4 py-3 font-semibold">Chats</th><th className="px-4 py-3 font-semibold">Last sign-in</th><th className="px-4 py-3 font-semibold">Active</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.map((u) => {
                  const owner = u.role === 'owner';
                  const self = u.id === me?.user.id;
                  return (
                    <tr key={u.id} className={u.active ? '' : 'opacity-60'}>
                      <td className="px-4 py-3"><p className="font-semibold text-navy">{u.name}{self && <span className="font-normal text-muted"> (you)</span>}</p><p className="text-xs text-muted">{u.email} · added {fmtDate(u.createdAt)}</p></td>
                      <td className="px-4 py-3 text-muted">{u.mobile || '—'}</td>
                      <td className="px-4 py-3"><StatusPill tone={owner ? 'warn' : u.role === 'admin' ? 'busy' : 'ok'}>{owner ? 'Owner' : u.role === 'admin' ? 'Admin' : 'Agent'}</StatusPill></td>
                      <td className="px-4 py-3">{owner || u.role === 'admin' ? <span className="text-muted">All chats</span> : <Switch checked={u.seeUnassigned} label={`${u.name} sees unassigned chats`} onChange={(v) => save({ id: u.id, seeUnassigned: v })} />}</td>
                      <td className="px-4 py-3 tabular-nums">{u._count?.assigned ?? 0}</td>
                      <td className="px-4 py-3 text-muted">{timeAgo(u.lastLoginAt)}</td>
                      <td className="px-4 py-3">{owner || self ? <span className="text-muted">—</span> : <Switch checked={u.active} label={`${u.name} active`} onChange={(v) => save({ id: u.id, active: v })} />}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {!owner && <>
                          <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Edit ${u.name}`} onClick={() => edit(u)}><Pencil className="h-4 w-4" /></button>
                          {!self && <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" aria-label={`Delete ${u.name}`} onClick={() => confirm(`Delete ${u.name}? Their chats become unassigned.`) && del(u.id)}><Trash2 className="h-4 w-4" /></button>}
                        </>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={!!d} onClose={() => setD(null)} title={d?.id ? 'Edit team member' : 'Add team member'}>
        {d && (
          <form onSubmit={submit} className="space-y-4">
            <div><label htmlFor="g-name" className="label">Name</label><input id="g-name" className="input" required maxLength={120} value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label htmlFor="g-email" className="label">Login email</label><input id="g-email" type="email" autoComplete="off" className="input" required disabled={!!d.id} value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
              <div><label htmlFor="g-mob" className="label">Mobile (optional)</label><input id="g-mob" type="tel" className="input" maxLength={20} value={d.mobile} onChange={(e) => setD({ ...d, mobile: e.target.value })} /></div>
            </div>
            <div><label htmlFor="g-pw" className="label">{d.id ? 'New password (leave empty to keep)' : 'Temporary password'}</label><input id="g-pw" type="text" autoComplete="off" className="input font-mono" minLength={8} required={!d.id} value={d.password} onChange={(e) => setD({ ...d, password: e.target.value })} /></div>
            <fieldset>
              <legend className="label">Role</legend>
              <div className="space-y-2">
                {([['agent', 'Agent', 'Answers chats assigned to them.'], ['admin', 'Admin', 'Everything the owner can do, including bots, numbers and the team.']] as const).map(([v, t, desc]) => (
                  <label key={v} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${d.role === v ? 'border-c-blue bg-c-blue-tint' : 'border-line'}`}>
                    <input type="radio" name="role" className="mt-1" checked={d.role === v} onChange={() => setD({ ...d, role: v })} />
                    <span><span className="block font-medium text-navy">{t}</span><span className="text-sm text-muted">{desc}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            {d.role === 'agent' && <div className="flex items-center gap-3"><Switch checked={d.seeUnassigned} onChange={(v) => setD({ ...d, seeUnassigned: v })} label="Sees unassigned chats" /><span className="text-sm">Can see and pick up chats nobody is assigned to</span></div>}
            {error && <p className="text-sm text-err">{errorText(error)}</p>}
            <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : d.id ? 'Save changes' : 'Add to team'}</button>
          </form>
        )}
      </Modal>
    </>
  );
}
