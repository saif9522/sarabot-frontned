'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bot as BotIcon, Copy, Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { useBotQuery, useDeleteBotMutation, useDeleteFlowMutation, useDuplicateFlowMutation, useTestBotMutation, useToggleFlowMutation, useUpdateBotMutation } from '@/store/api';
import type { Bot, Decision, OutMessage } from '@/lib/types';
import { ErrorNote, PageHeader, StatusPill, Switch } from '@/components/ui';
import MediaPreview from '@/components/MediaPreview';

const TABS = ['Settings', 'Business info', 'Bot flows', 'Test'] as const;
type Tab = (typeof TABS)[number];

function Saved({ show }: { show: boolean }) {
  return show ? <span className="text-sm text-brand-dark" role="status">Saved</span> : null;
}

function SettingsTab({ bot }: { bot: Bot }) {
  const [update, { isLoading, isSuccess }] = useUpdateBotMutation();
  const [f, setF] = useState({ name: bot.name, aiEnabled: bot.aiEnabled, useProducts: bot.useProducts, instructions: bot.instructions, welcomeMessage: bot.welcomeMessage, fallbackMessage: bot.fallbackMessage });
  return (
    <form className="card space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); update({ id: bot.id, ...f }); }}>
      <div><label htmlFor="b-name" className="label">Bot name (only shown to you)</label><input id="b-name" className="input" required maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-3"><Switch checked={f.aiEnabled} onChange={(v) => setF({ ...f, aiEnabled: v })} label="AI replies" /><span className="text-sm">AI answers when no flow matches</span></div>
        <div className="flex items-center gap-3"><Switch checked={f.useProducts} onChange={(v) => setF({ ...f, useProducts: v })} label="Use products" /><span className="text-sm">AI may answer from the product list</span></div>
      </div>
      {!bot.aiAvailable && f.aiEnabled && <p className="text-sm text-tech">The server has no GEMINI_API_KEY, so instead of AI the &ldquo;No match&rdquo; flow or fallback message is used.</p>}
      <div>
        <label htmlFor="b-ins" className="label">Instructions for the AI</label>
        <textarea id="b-ins" className="textarea" maxLength={4000} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })}
          placeholder={'Reply in Hindi when the customer writes Hindi, otherwise Hinglish.\nBe respectful; address elders as "ji".'} />
      </div>
      <div>
        <label htmlFor="b-wel" className="label">Welcome message (first time someone writes)</label>
        <textarea id="b-wel" className="textarea min-h-20" maxLength={1000} value={f.welcomeMessage} onChange={(e) => setF({ ...f, welcomeMessage: e.target.value })} placeholder="नमस्कार {name} जी! 🙏" />
        <p className="hint">Leave empty for none. {'{name}'} = the customer&apos;s first name.</p>
      </div>
      <div>
        <label htmlFor="b-fb" className="label">Fallback message</label>
        <textarea id="b-fb" className="textarea min-h-20" required maxLength={1000} value={f.fallbackMessage} onChange={(e) => setF({ ...f, fallbackMessage: e.target.value })} />
        <p className="hint">Used only if there is no &ldquo;No match&rdquo; flow, and sent at most once an hour to the same person. The chat is then marked &ldquo;needs you&rdquo;. Small talk, &ldquo;ok/thanks&rdquo;, emojis and abuse get no reply at all.</p>
      </div>
      <div className="flex items-center gap-3"><button className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving…' : 'Save settings'}</button><Saved show={isSuccess} /></div>
    </form>
  );
}

const INFO_FIELDS = [
  { key: 'companyName', label: 'Company name', max: 200 },
  { key: 'location', label: 'Company location', max: 500 },
  { key: 'industry', label: 'Industry', max: 200 },
  { key: 'assistantName', label: 'Bot name (how it introduces itself)', max: 80 },
  { key: 'supportEmail', label: 'Support email', max: 200, type: 'email' },
  { key: 'websiteUrl', label: 'Website', max: 300 },
] as const;

function BusinessTab({ bot }: { bot: Bot }) {
  const [update, { isLoading, isSuccess, error }] = useUpdateBotMutation();
  const [f, setF] = useState({
    companyName: bot.companyName, location: bot.location, industry: bot.industry, assistantName: bot.assistantName,
    supportEmail: bot.supportEmail, websiteUrl: bot.websiteUrl, phoneNumbers: bot.phoneNumbers, primaryGoal: bot.primaryGoal, knowledge: bot.knowledge,
  });
  return (
    <form className="card space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); update({ id: bot.id, ...f }); }}>
      <p className="text-sm text-muted">The AI uses only these facts, so customers get accurate answers.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {INFO_FIELDS.map((fd) => (
          <div key={fd.key}>
            <label htmlFor={`bi-${fd.key}`} className="label">{fd.label}</label>
            <input id={`bi-${fd.key}`} className="input" type={'type' in fd ? fd.type : 'text'} maxLength={fd.max} value={f[fd.key]} onChange={(e) => setF({ ...f, [fd.key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label htmlFor="bi-goal" className="label">Bot&apos;s primary goal</label>
          <textarea id="bi-goal" className="textarea min-h-20" maxLength={2000} value={f.primaryGoal} onChange={(e) => setF({ ...f, primaryGoal: e.target.value })} placeholder="उद्देश्य – बाल विवाह, दहेज प्रथा रोकना तथा सामूहिक विवाह प्रोत्साहित करना" />
        </div>
        <div>
          <label htmlFor="bi-phones" className="label">Phone numbers (one per line)</label>
          <textarea id="bi-phones" className="textarea min-h-20" maxLength={300} value={f.phoneNumbers} onChange={(e) => setF({ ...f, phoneNumbers: e.target.value })} />
        </div>
      </div>
      <div>
        <label htmlFor="bi-train" className="label">Training data</label>
        <p className="hint mb-2">About you, services, fees, process, documents needed, timings, FAQs. Write it like you&apos;d explain to a new staff member.</p>
        <textarea id="bi-train" className="textarea min-h-[280px]" maxLength={50000} value={f.knowledge} onChange={(e) => setF({ ...f, knowledge: e.target.value })} />
        <p className="hint">{f.knowledge.length.toLocaleString()} / 50,000 characters</p>
      </div>
      {error && <p className="text-sm text-err">Couldn&apos;t save. Check the support email address.</p>}
      <div className="flex items-center gap-3"><button className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving…' : 'Save business info'}</button><Saved show={isSuccess} /></div>
    </form>
  );
}

function FlowsTab({ bot }: { bot: Bot }) {
  const [toggle] = useToggleFlowMutation();
  const [dup] = useDuplicateFlowMutation();
  const [del] = useDeleteFlowMutation();
  const flows = bot.flows ?? [];
  const hasNoMatch = flows.some((f) => f.isNoMatch);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted">When a message matches a flow&apos;s trigger keywords, the bot sends that flow&apos;s messages in order — text, images, documents and pauses. Mark one flow as <b>No match</b> to send it when nothing else fits.</p>
        <Link href={`/bots/${bot.id}/flows/new`} className="btn-primary"><Plus className="h-4 w-4" aria-hidden /> Add flow</Link>
      </div>
      {!flows.length ? (
        <div className="card border-dashed p-8 text-center text-sm text-muted">No flows yet. Start with a greeting: triggers &ldquo;Hello, Hi, Namaste&rdquo;, marked as No match, with your introduction and poster.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line bg-c-indigo-tint text-xs text-c-indigo">
              <tr><th className="px-4 py-3 font-semibold">Flow</th><th className="px-4 py-3 font-semibold">Trigger keywords</th><th className="px-4 py-3 font-semibold">Match</th><th className="px-4 py-3 font-semibold">Messages</th><th className="px-4 py-3 font-semibold">On</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flows.map((f) => (
                <tr key={f.id} className={f.enabled ? '' : 'opacity-60'}>
                  <td className="px-4 py-3 align-top">
                    <Link href={`/bots/${bot.id}/flows/${f.id}`} className="font-medium text-navy hover:underline">{f.name}</Link>
                    {f.isNoMatch && <div className="mt-1"><StatusPill tone="warn">No match</StatusPill></div>}
                  </td>
                  <td className="px-4 py-3 align-top"><p className="flex max-w-sm flex-wrap gap-1">{f.keywords.split(',').map((k) => k.trim()).filter(Boolean).map((k) => <span key={k} className="rounded bg-canvas px-1.5 py-0.5 text-xs">{k}</span>)}</p></td>
                  <td className="px-4 py-3 align-top text-muted">{f.matchType === 'exact' ? 'Exact' : f.matchType === 'starts' ? 'Starts with' : 'Contains'}</td>
                  <td className="px-4 py-3 align-top text-muted">{f.steps.map((s) => (s.type === 'text' ? 'text' : s.type === 'delay' ? `wait ${s.delaySeconds}s` : s.type)).join(' → ')}</td>
                  <td className="px-4 py-3 align-top"><Switch checked={f.enabled} label={`Flow ${f.name} enabled`} onChange={(v) => toggle({ botId: bot.id, id: f.id, enabled: v })} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                    <Link href={`/bots/${bot.id}/flows/${f.id}`} className="inline-block rounded p-2 text-muted hover:bg-canvas" aria-label={`Edit ${f.name}`}><Pencil className="h-4 w-4" /></Link>
                    <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Duplicate ${f.name}`} onClick={() => dup({ botId: bot.id, id: f.id })}><Copy className="h-4 w-4" /></button>
                    <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" aria-label={`Delete ${f.name}`} onClick={() => confirm(`Delete flow "${f.name}"?`) && del({ botId: bot.id, id: f.id })}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!!flows.length && !hasNoMatch && <p className="text-xs text-muted">No flow is marked &ldquo;No match&rdquo;, so unmatched messages go to AI, then the fallback message.</p>}
    </div>
  );
}

function OutBubble({ m }: { m: OutMessage }) {
  if (m.type === 'delay') return <p className="text-center text-xs text-muted">… waits {m.seconds}s …</p>;
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] space-y-1 rounded-2xl border border-line bg-white px-3.5 py-2 text-sm">
        {m.type === 'text' ? <p className="whitespace-pre-wrap">{m.text}</p> : <><MediaPreview type={m.type} media={m.media} fileName={m.fileName} />{m.caption && <p className="whitespace-pre-wrap">{m.caption}</p>}</>}
      </div>
    </div>
  );
}

const VIA: Record<Decision['via'], string> = { flow: 'Flow', ai: 'AI', nomatch: 'No-match flow', fallback: 'Fallback', ignored: 'Bot stays silent', none: 'No reply' };

function TestTab({ bot }: { bot: Bot }) {
  const [test, { isLoading }] = useTestBotMutation();
  const [log, setLog] = useState<Array<{ kind: 'in'; text: string } | { kind: 'out'; d: Decision } | { kind: 'error' }>>([]);
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [log.length]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    setText('');
    type H = { direction: 'in' | 'out'; body: string };
    const history = log.flatMap((l): H[] =>
      l.kind === 'in' ? [{ direction: 'in', body: l.text }]
      : l.kind === 'out' ? l.d.messages.flatMap((m): H[] => (m.type === 'text' ? [{ direction: 'out', body: m.text }] : [])) : []);
    setLog((l) => [...l, { kind: 'in', text: message }]);
    try {
      const d = await test({ id: bot.id, message, history }).unwrap();
      setLog((l) => [...l, { kind: 'out', d }]);
    } catch {
      setLog((l) => [...l, { kind: 'error' }]);
    }
  }
  return (
    <div className="card flex h-[64vh] min-h-[440px] flex-col">
      <div className="flex items-center justify-between border-b border-line p-4">
        <p className="text-sm text-muted">Chat as a customer. Nothing is sent on WhatsApp. Save the other tabs first.</p>
        {!!log.length && <button className="btn-secondary btn-sm" onClick={() => setLog([])}>Clear</button>}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-canvas p-4">
        {!log.length && <p className="pt-10 text-center text-sm text-muted">Type one of your trigger keywords, a question, or something unrelated.</p>}
        {log.map((l, i) =>
          l.kind === 'in' ? (
            <div key={i} className="flex justify-end"><div className="max-w-[80%] rounded-2xl bg-brand px-3.5 py-2 text-sm text-white"><p className="whitespace-pre-wrap">{l.text}</p></div></div>
          ) : l.kind === 'error' ? (
            <p key={i} className="text-sm text-err">Test failed. Is the backend running?</p>
          ) : (
            <div key={i} className="space-y-2">
              {l.d.messages.length ? l.d.messages.map((m, j) => <OutBubble key={j} m={m} />) : <p className="text-sm italic text-muted">(no reply sent)</p>}
              <p className="text-[11px] text-muted">{VIA[l.d.via]}{l.d.flowName ? ` “${l.d.flowName}”` : ''}{l.d.handoff ? ' · would mark the chat “needs you”' : ''}{l.d.reason && l.d.via !== 'flow' ? ` · ${l.d.reason}` : ''}{l.d.via === 'fallback' || l.d.via === 'nomatch' ? ' · on WhatsApp this is sent at most once per hour per person' : ''}</p>
            </div>
          ),
        )}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
        <label htmlFor="t-msg" className="sr-only">Test message</label>
        <input id="t-msg" className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a customer message" maxLength={2000} />
        <button className="btn-primary" disabled={isLoading || !text.trim()} aria-label="Send test message"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}

export default function BotEditor() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const { data: bot, isError } = useBotQuery(id);
  const [del] = useDeleteBotMutation();
  const initial = TABS.find((t) => t === search.get('tab')) ?? 'Settings';
  const [tab, setTab] = useState<Tab>(initial);
  const router = useRouter();
  if (isError) return <ErrorNote what="this bot" />;
  if (!bot) return <p className="text-muted">Loading…</p>;

  return (
    <>
      <Link href="/bots" className="mb-3 inline-flex items-center gap-1 text-sm text-brand-dark hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> All bots</Link>
      <PageHeader icon={BotIcon} tone="violet" title={bot.name}
        description={<span className="flex flex-wrap gap-2"><StatusPill tone={bot.aiEnabled ? 'ok' : 'off'}>AI {bot.aiEnabled ? 'on' : 'off'}</StatusPill><StatusPill tone="busy">{bot.flows?.length ?? 0} flows</StatusPill></span>}
        actions={<>
          <button className="btn-secondary" onClick={() => setTab('Test')}>Test your bot</button>
          <button className="btn-danger" onClick={async () => { if (confirm(`Delete "${bot.name}"? Numbers using it will stop replying until you choose another bot.`)) { await del(bot.id); router.push('/bots'); } }}>Delete bot</button>
        </>} />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`h-10 rounded-full px-4 text-sm font-semibold transition-colors ${tab === t ? 'bg-c-violet text-white' : 'bg-white text-muted ring-1 ring-line hover:text-ink'}`}>{t}</button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'Settings' && <SettingsTab key={bot.updatedAt} bot={bot} />}
        {tab === 'Business info' && <BusinessTab key={bot.updatedAt} bot={bot} />}
        {tab === 'Bot flows' && <FlowsTab bot={bot} />}
        {tab === 'Test' && <TestTab bot={bot} />}
      </div>
    </>
  );
}
