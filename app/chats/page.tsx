'use client';
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, MessagesSquare, UserRound, Clock, CheckCheck } from 'lucide-react';
import { useAccountsQuery, useChatsQuery, useMeQuery, useSendMessageMutation, useTeamQuery, useThreadQuery, useUpdateContactMutation } from '@/store/api';
import { Empty, ErrorNote, PageHeader, StatusPill } from '@/components/ui';
import { SENT_BY, phone, timeAgo } from '@/lib/format';
import MediaPreview from '@/components/MediaPreview';

function Assign({ c }: { c: { id: string; assignedToId?: string | null; assignedTo?: { id: string; name: string } | null } }) {
  const { data: me } = useMeQuery();
  const manager = me?.user.effectiveRole !== 'agent';
  const { data: team } = useTeamQuery(undefined, { skip: !manager });
  const [update, { isLoading }] = useUpdateContactMutation();
  if (!me) return null;
  if (manager) {
    return (
      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted">Assigned to</span>
        <select className="input h-9 w-44" disabled={isLoading} value={c.assignedToId ?? ''} onChange={(e) => update({ id: c.id, assignedToId: e.target.value || null })}>
          <option value="">Nobody</option>
          {team?.map((t) => <option key={t.id} value={t.id}>{t.name}{t.id === me.user.id ? ' (you)' : ''}</option>)}
        </select>
      </label>
    );
  }
  if (!c.assignedToId) return <button className="btn-secondary btn-sm" disabled={isLoading} onClick={() => update({ id: c.id, assignedToId: me.user.id })}>Assign to me</button>;
  if (c.assignedToId === me.user.id) return <button className="btn-secondary btn-sm" disabled={isLoading} onClick={() => update({ id: c.id, assignedToId: null })}>Unassign me</button>;
  return <span className="text-sm text-muted">Assigned to {c.assignedTo?.name}</span>;
}

function Thread({ id }: { id: string }) {
  const { data, isError } = useThreadQuery(id);
  const [update, { isLoading: updating }] = useUpdateContactMutation();
  const [send] = useSendMessageMutation();
  const [failed, setFailed] = useState<string | null>(null);
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const count = data?.messages.length ?? 0;
  const first = useRef(true);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end', behavior: first.current ? 'auto' : 'smooth' });
    if (count) first.current = false;
  }, [count]);
  if (isError) return <ErrorNote what="this chat" />;
  if (!data) return <p className="p-5 text-muted">Loading…</p>;
  const { contact: c, messages } = data;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText(''); // like WhatsApp: the box clears and the bubble appears at once
    setFailed(null);
    try {
      await send({ id, text: body }).unwrap();
    } catch {
      setFailed(body);
      setText((t) => t || body); // give the text back so nothing is lost
    }
  }
  return (
    <div className="flex h-[72vh] min-h-[480px] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div>
          <h2 className="font-semibold text-navy">{c.name || phone(c.waId)}</h2>
          <p className="text-xs text-muted">{phone(c.waId)} · via {c.account?.phone ? phone(c.account.phone) : c.account?.label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Assign c={c} />
          {c.needsHuman && <button className="btn-secondary btn-sm" onClick={() => update({ id, needsHuman: false })}>Mark as handled</button>}
          <button type="button" role="switch" aria-checked={!c.botPaused} disabled={updating} onClick={() => update({ id, botPaused: !c.botPaused })}
            className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${c.botPaused ? 'border-auto-edge bg-auto-tint text-auto' : 'border-brand-edge bg-brand-tint text-brand-dark'}`}>
            {c.botPaused ? <><UserRound className="h-4 w-4" aria-hidden /> You are replying</> : <><Bot className="h-4 w-4" aria-hidden /> Bot replying</>}
          </button>
        </div>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto bg-canvas p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'} ${m.pending ? 'opacity-80' : ''}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.direction === 'in' ? 'border border-line bg-white' : m.sentBy === 'human' ? 'bg-navy text-white' : 'bg-brand text-white'}`}>
              {m.type !== 'text' && m.media && <div className="mb-1"><MediaPreview type={m.type as 'image' | 'document'} media={m.media} fileName={m.body} dark={m.direction === 'out'} /></div>}
              {(m.type === 'text' || m.type === 'image') && m.body && <p className="whitespace-pre-wrap">{m.body}</p>}
              <p className={`mt-1 flex items-center gap-1 text-[11px] ${m.direction === 'in' ? 'text-muted' : 'text-white/80'}`}>
                {m.direction === 'out' ? `${SENT_BY[m.sentBy] ?? m.sentBy} · ` : ''}{m.pending ? 'Sending…' : timeAgo(m.createdAt)}
                {m.direction === 'out' && (m.pending ? <Clock className="h-3 w-3" aria-label="Sending" /> : <CheckCheck className="h-3.5 w-3.5" aria-label="Sent" />)}
              </p>
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={submit} className="border-t border-line p-3">
        <div className="flex gap-2">
          <label htmlFor="reply" className="sr-only">Reply</label>
          <input id="reply" className="input" value={text} maxLength={4096} onChange={(e) => setText(e.target.value)} placeholder="Type a reply" />
          <button className="btn-primary" disabled={!text.trim()}>Send</button>
        </div>
        {failed && <p className="mt-2 text-sm text-err" role="alert">Not sent. Is this number still connected? Check WhatsApp numbers, then press Send again.</p>}
        <p className="mt-2 text-xs text-muted">{c.botPaused ? 'The bot is paused for this person. Click “You are replying” to hand the chat back to the bot.' : 'Sending a reply pauses the bot for this person so it doesn’t interrupt you.'}</p>
      </form>
    </div>
  );
}

function ChatsInner() {
  const params = useSearchParams();
  const [accountId, setAccountId] = useState('');
  const [filter, setFilter] = useState(params.get('filter') ?? '');
  const onlyHuman = filter === 'human';
  const { data: me } = useMeQuery();
  const { data: accounts } = useAccountsQuery();
  const { data, isLoading, isError } = useChatsQuery({ ...(accountId ? { accountId } : {}), ...(filter ? { filter } : {}) });
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected && data?.some((c) => c.id === selected) ? selected : data?.[0]?.id ?? null;

  return (
    <>
      <PageHeader icon={MessagesSquare} tone="sky" title="Chat history" description="Every conversation on your numbers. Take over any chat and reply yourself." />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-60">
          <label htmlFor="f-acc" className="label">Number</label>
          <select id="f-acc" className="input" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">All numbers</option>
            {accounts?.map((a) => <option key={a.id} value={a.id}>{a.phone ? phone(a.phone) : a.label}</option>)}
          </select>
        </div>
        <div className="w-56">
          <label htmlFor="f-show" className="label">Show</label>
          <select id="f-show" className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">{me?.user.effectiveRole === 'agent' ? 'All my chats' : 'All chats'}</option>
            <option value="mine">Assigned to me</option>
            {(me?.user.effectiveRole !== 'agent' || me?.user.seeUnassigned) && <option value="unassigned">Unassigned</option>}
            <option value="human">Need a reply from us</option>
          </select>
        </div>
      </div>
      {isError ? <ErrorNote what="chats" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
        <Empty title={onlyHuman ? 'Nothing needs you right now' : 'No chats yet'}>{onlyHuman ? 'Chats the bot could not answer show up here.' : 'When customers message a linked number, their chats appear here.'}</Empty>
      ) : (
        <div className="card grid overflow-hidden md:grid-cols-[320px_minmax(0,1fr)]">
          <ul className="max-h-[72vh] divide-y divide-slate-100 overflow-y-auto border-b border-line md:border-b-0 md:border-r" aria-label="Chats">
            {data.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSelected(c.id)} aria-current={active === c.id ? 'true' : undefined} className={`w-full p-4 text-left hover:bg-canvas ${active === c.id ? 'bg-brand-tint' : ''}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-navy">{c.name || phone(c.waId)}</span>
                    <span className="flex-none text-xs text-muted">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{c.lastMessage ? `${c.lastMessage.direction === 'out' ? `${SENT_BY[c.lastMessage.sentBy] ?? 'Bot'}: ` : ''}${c.lastMessage.type === 'image' ? '📷 ' : c.lastMessage.type === 'document' ? '📄 ' : ''}${c.lastMessage.body}` : ''}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.needsHuman && <StatusPill tone="warn">Needs you</StatusPill>}
                    {c.botPaused && <StatusPill tone="busy">You are replying</StatusPill>}
                    {c.optedOut && <StatusPill tone="off">Unsubscribed</StatusPill>}
                    {c.assignedTo && <StatusPill tone="ok">{c.assignedTo.id === me?.user.id ? 'You' : c.assignedTo.name}</StatusPill>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <section aria-label="Conversation">{active && <Thread id={active} />}</section>
        </div>
      )}
    </>
  );
}

export default function ChatsPage() {
  return <Suspense fallback={<p className="text-muted">Loading…</p>}><ChatsInner /></Suspense>;
}
