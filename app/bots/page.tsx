'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Bot as BotIcon, Plus } from 'lucide-react';
import { useAddBotMutation, useBotsQuery } from '@/store/api';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill } from '@/components/ui';

export default function BotsPage() {
  const { data, isLoading, isError } = useBotsQuery();
  const [add, { isLoading: adding }] = useAddBotMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();

  async function create(e: FormEvent) {
    e.preventDefault();
    const b = await add({ name: name.trim() || 'New bot' }).unwrap();
    router.push(`/bots/${b.id}`);
  }

  return (
    <>
      <PageHeader icon={Bot} tone="violet" title="Bots" description="A bot answers with a matching flow first, then AI using your business info and products, then your “No match” flow or fallback message."
        actions={<button className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" aria-hidden /> New bot</button>} />
      {data && !data.aiAvailable && (
        <div className="card mb-4 border-tech-edge bg-tech-tint p-4 text-sm text-tech">
          AI replies are off because <code className="font-mono">GEMINI_API_KEY</code> isn&apos;t set in <code className="font-mono">backend/.env</code>. Flows and fallback messages still work.
        </div>
      )}
      {isError ? <ErrorNote what="bots" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.bots.length ? (
        <Empty title="No bots yet">Create one, fill in your business info and add a few flows, then try it in the Test tab before linking a number.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.bots.map((b) => {
            const used = (b._count?.workingFor ?? 0) + (b._count?.offHoursFor ?? 0);
            return (
              <Link key={b.id} href={`/bots/${b.id}`} className="card block p-5 transition-colors hover:border-brand">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-brand-tint text-brand"><BotIcon className="h-5 w-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-navy">{b.name}</h2>
                    <p className="text-xs text-muted">{b._count?.flows ?? 0} flows · used by {used} number{used === 1 ? '' : 's'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusPill tone={b.aiEnabled ? 'ok' : 'off'}>AI {b.aiEnabled ? 'on' : 'off'}</StatusPill>
                  {b.useProducts && <StatusPill tone="busy">Uses products</StatusPill>}
                  {b.welcomeMessage && <StatusPill tone="warn">Welcome message</StatusPill>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="New bot">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label htmlFor="bot-name" className="label">Bot name</label>
            <input id="bot-name" className="input" placeholder="e.g. Shop assistant, After hours" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button className="btn-primary w-full" disabled={adding}>{adding ? 'Creating…' : 'Create and edit'}</button>
        </form>
      </Modal>
    </>
  );
}
