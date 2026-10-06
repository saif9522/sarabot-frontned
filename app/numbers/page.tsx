'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Settings2, Smartphone } from 'lucide-react';
import {
  useAccountsQuery, useAddAccountMutation, useBotsQuery, useDeleteAccountMutation, useLinkAccountMutation, useUnlinkAccountMutation, useUpdateAccountMutation,
} from '@/store/api';
import type { Account } from '@/lib/types';
import { phone } from '@/lib/format';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill, Switch } from '@/components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ZONES = ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Kathmandu', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'UTC'];

function Status({ a }: { a: Account }) {
  const s = a.session.status;
  if (s === 'connected') return <StatusPill tone="ok">Connected</StatusPill>;
  if (s === 'qr') return <StatusPill tone="busy">Waiting for scan</StatusPill>;
  if (s === 'starting') return <StatusPill tone="busy">Connecting…</StatusPill>;
  return <StatusPill tone="off">Disconnected</StatusPill>;
}

/** Shows the live QR code for one number until it connects. */
function QrPanel({ account, onDone }: { account: Account; onDone: () => void }) {
  const [link, { isLoading }] = useLinkAccountMutation();
  const s = account.session;
  useEffect(() => {
    if (s.status === 'connected') {
      const t = setTimeout(onDone, 1500);
      return () => clearTimeout(t);
    }
  }, [s.status, onDone]);

  if (s.status === 'connected') return <p className="rounded-lg bg-brand-tint p-4 text-brand-dark">Linked {phone(account.phone)}. The bot is ready.</p>;
  if (s.status === 'qr' && s.qr) {
    return (
      <div className="flex flex-wrap items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.qr} alt="QR code to link WhatsApp. Scan it from your phone." width={240} height={240} className="rounded-lg border border-line bg-white p-2" />
        <ol className="list-decimal space-y-1.5 pl-5 text-sm">
          <li>Open <b>WhatsApp</b> or <b>WhatsApp Business</b> on the phone</li>
          <li>Go to <b>Settings</b> (or <b>⋮</b>) → <b>Linked devices</b></li>
          <li>Tap <b>Link a device</b> and scan this code</li>
        </ol>
      </div>
    );
  }
  if (s.status === 'starting') return <p className="flex items-center gap-2 text-muted"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Getting a QR code… this takes a few seconds.</p>;
  return (
    <div>
      {s.lastError && <p className="mb-3 text-sm text-auto">{s.lastError}</p>}
      <button className="btn-primary" disabled={isLoading} onClick={() => link(account.id)}>Get a new QR code</button>
    </div>
  );
}

function ManageModal({ account, onClose }: { account: Account; onClose: () => void }) {
  const [update, { isLoading: saving }] = useUpdateAccountMutation();
  const [unlink, { isLoading: unlinking }] = useUnlinkAccountMutation();
  const [del] = useDeleteAccountMutation();
  const [f, setF] = useState({ label: account.label, workDays: account.workDays, workStart: account.workStart, workEnd: account.workEnd, timezone: account.timezone });
  const days = new Set(f.workDays.split(',').filter(Boolean).map(Number));
  const toggleDay = (d: number) => {
    const next = new Set(days);
    if (next.has(d)) next.delete(d); else next.add(d);
    setF({ ...f, workDays: [...next].sort().join(',') });
  };
  async function save(e: FormEvent) {
    e.preventDefault();
    await update({ id: account.id, ...f }).unwrap();
    onClose();
  }
  return (
    <Modal open onClose={onClose} title={`Manage ${account.phone ? phone(account.phone) : account.label}`} wide>
      <form onSubmit={save} className="space-y-5">
        <div>
          <label htmlFor="m-label" className="label">Name</label>
          <input id="m-label" className="input" required maxLength={60} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} />
        </div>
        <fieldset>
          <legend className="label">Working hours</legend>
          <p className="hint mb-2">Inside these hours the &ldquo;working hours bot&rdquo; replies; outside them the &ldquo;after hours bot&rdquo; does.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Working days">
            {DAYS.map((d, i) => (
              <button type="button" key={d} aria-pressed={days.has(i)} onClick={() => toggleDay(i)}
                className={`h-9 w-12 rounded-lg border text-sm font-medium ${days.has(i) ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink'}`}>{d}</button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><label htmlFor="m-start" className="label">Opens</label><input id="m-start" type="time" className="input" value={f.workStart} onChange={(e) => setF({ ...f, workStart: e.target.value })} required /></div>
            <div><label htmlFor="m-end" className="label">Closes</label><input id="m-end" type="time" className="input" value={f.workEnd} onChange={(e) => setF({ ...f, workEnd: e.target.value })} required /></div>
            <div><label htmlFor="m-tz" className="label">Time zone</label>
              <select id="m-tz" className="input" value={f.timezone} onChange={(e) => setF({ ...f, timezone: e.target.value })}>
                {[...new Set([f.timezone, ...ZONES])].map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>
        </fieldset>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap gap-2">
            {account.session.status === 'connected' && <button type="button" className="btn-secondary" disabled={unlinking} onClick={() => unlink(account.id)}>Unlink phone</button>}
            <button type="button" className="btn-danger" onClick={async () => {
              if (confirm('Delete this number and all its chats and subscribers? This cannot be undone.')) { await del(account.id); onClose(); }
            }}>Delete number</button>
          </div>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function NumbersPage() {
  const { data: accounts, isLoading, isError } = useAccountsQuery(undefined, { pollingInterval: 10000 });
  const { data: botsData } = useBotsQuery();
  const [add, { isLoading: adding }] = useAddAccountMutation();
  const [link] = useLinkAccountMutation();
  const [update] = useUpdateAccountMutation();
  const [adder, setAdder] = useState(false);
  const [label, setLabel] = useState('');
  const [qrFor, setQrFor] = useState<string | null>(null);
  const [manage, setManage] = useState<string | null>(null);
  const bots = botsData?.bots ?? [];
  const qrAccount = accounts?.find((a) => a.id === qrFor);
  const manageAccount = accounts?.find((a) => a.id === manage);

  async function create(e: FormEvent) {
    e.preventDefault();
    const a = await add({ label: label.trim() || 'My WhatsApp' }).unwrap();
    setLabel('');
    setAdder(false);
    setQrFor(a.id);
  }

  return (
    <>
      <PageHeader icon={Smartphone} tone="green" title="WhatsApp numbers" description="Link a phone's WhatsApp or WhatsApp Business by scanning a QR code. Each number can use one bot during working hours and another after hours."
        actions={<button className="btn-primary" onClick={() => setAdder(true)}><Plus className="h-4 w-4" aria-hidden /> Link a number</button>} />

      {!bots.length && botsData && (
        <div className="card mb-4 border-auto-edge bg-auto-tint p-4 text-sm text-auto">
          You don&apos;t have a bot yet, so linked numbers won&apos;t reply. <Link href="/bots" className="font-semibold underline">Create a bot</Link> first.
        </div>
      )}

      {isError ? <ErrorNote what="numbers" /> : isLoading ? <p className="text-muted">Loading…</p> : !accounts?.length ? (
        <Empty title="No numbers linked yet">Click <b>Link a number</b>, then scan the QR code from WhatsApp → Linked devices on your phone.</Empty>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-line bg-c-indigo-tint text-xs text-c-indigo">
              <tr>
                <th className="px-4 py-3 font-semibold">Number</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Working hours bot</th>
                <th className="px-4 py-3 font-semibold">After hours bot</th>
                <th className="px-4 py-3 font-semibold">Bot</th>
                <th className="px-4 py-3 font-semibold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{a.phone ? phone(a.phone) : 'Not linked yet'}</p>
                    <p className="text-xs text-muted">{a.label} · {a._count?.contacts ?? 0} subscribers · {a.workingNow ? 'open now' : 'closed now'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Status a={a} />
                      {a.session.status !== 'connected' && (
                        <button className="btn-secondary btn-sm" onClick={() => { if (a.session.status === 'disconnected') link(a.id); setQrFor(a.id); }}>
                          {a.session.status === 'qr' ? 'Show QR' : 'Link'}
                        </button>
                      )}
                    </div>
                  </td>
                  {(['workingBotId', 'offHoursBotId'] as const).map((key) => (
                    <td key={key} className="px-4 py-3">
                      <label className="sr-only" htmlFor={`${key}-${a.id}`}>{key === 'workingBotId' ? 'Working hours bot' : 'After hours bot'}</label>
                      <select id={`${key}-${a.id}`} className="input h-9" value={a[key] ?? ''} onChange={(e) => update({ id: a.id, [key]: e.target.value })}>
                        <option value="">No reply</option>
                        {bots.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </td>
                  ))}
                  <td className="px-4 py-3"><Switch checked={a.botEnabled} label={`Bot for ${a.label}`} onChange={(v) => update({ id: a.id, botEnabled: v })} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn-secondary btn-sm" onClick={() => setManage(a.id)}><Settings2 className="h-4 w-4" aria-hidden /> Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 max-w-3xl text-xs text-muted">
        This links like WhatsApp Web, which is not an official WhatsApp API. WhatsApp may ban numbers that send automated or bulk messages.
        SAIF Chat only replies to people who message first, never in groups, waits a moment and shows &ldquo;typing…&rdquo; before replying, and caps replies per contact.
      </p>

      <Modal open={adder} onClose={() => setAdder(false)} title="Link a WhatsApp number">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label htmlFor="new-label" className="label">Name for this number</label>
            <input id="new-label" className="input" placeholder="e.g. Shop counter, Sales team" maxLength={60} value={label} onChange={(e) => setLabel(e.target.value)} />
            <p className="hint">Only shown to you. The phone number is filled in after you scan.</p>
          </div>
          <button className="btn-primary w-full" disabled={adding}>{adding ? 'Starting…' : 'Continue to QR code'}</button>
        </form>
      </Modal>

      {qrAccount && (
        <Modal open onClose={() => setQrFor(null)} title={`Scan to link · ${qrAccount.label}`} wide>
          <QrPanel account={qrAccount} onDone={() => setQrFor(null)} />
        </Modal>
      )}
      {manageAccount && <ManageModal account={manageAccount} onClose={() => setManage(null)} />}
    </>
  );
}
