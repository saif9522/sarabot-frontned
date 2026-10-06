'use client';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Eye, KeyRound, LogOut } from 'lucide-react';
import { api, errorText, useChangePasswordMutation, useExitActAsMutation, useLogoutMutation, useMeQuery } from '@/store/api';
import { useAppDispatch } from '@/store/store';
import Sidebar from './Sidebar';
import { Modal } from './ui';
import { fmtDate } from '@/lib/format';

/** Website pages and sign-in pages: no login needed. */
const PUBLIC = ['/', '/about', '/how-it-works', '/whatsapp-web', '/pricing', '/login', '/signup', '/forgot-password', '/reset-password'];
/** Pages an agent may open */
const AGENT_PAGES = ['/dashboard', '/chats'];

const ROLE_LABEL = { superadmin: 'Super Admin', owner: 'Owner', admin: 'Admin', agent: 'Agent' } as const;

function UserMenu() {
  const { data: me } = useMeQuery();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState(false);
  const [logout] = useLogoutMutation();
  const [change, { isLoading, error, isSuccess, reset }] = useChangePasswordMutation();
  const [f, setF] = useState({ current: '', next: '' });
  const dispatch = useAppDispatch();
  if (!me) return null;

  async function signOut() {
    await logout();
    dispatch(api.util.resetApiState());
    window.location.href = '/login';
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    await change(f).unwrap();
    setF({ current: '', next: '' });
  }
  return (
    <div className="relative">
      <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-canvas" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-c-indigo to-c-violet text-sm font-bold text-white" aria-hidden>
          {me.user.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold text-navy">{me.user.name}</span>
          <span className="block text-xs text-muted">{ROLE_LABEL[me.user.role]}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 z-40 mt-2 w-56 p-1.5 shadow-xl" onMouseLeave={() => setOpen(false)}>
          <p className="truncate px-3 py-2 text-xs text-muted">{me.user.email}</p>
          <button role="menuitem" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-canvas" onClick={() => { setOpen(false); reset(); setPw(true); }}><KeyRound className="h-4 w-4" aria-hidden /> Change password</button>
          <button role="menuitem" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-err hover:bg-err-tint" onClick={signOut}><LogOut className="h-4 w-4" aria-hidden /> Sign out</button>
        </div>
      )}
      <Modal open={pw} onClose={() => setPw(false)} title="Change password">
        <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="pw-cur" className="label">Current password</label><input id="pw-cur" type="password" autoComplete="current-password" className="input" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></div>
          <div><label htmlFor="pw-new" className="label">New password</label><input id="pw-new" type="password" autoComplete="new-password" minLength={8} className="input" required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /><p className="hint">At least 8 characters.</p></div>
          {error && <p className="text-sm text-err">{errorText(error)}</p>}
          {isSuccess && <p className="text-sm text-brand-dark">Password changed.</p>}
          <button className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving…' : 'Change password'}</button>
        </form>
      </Modal>
    </div>
  );
}

function PlanBanner() {
  const { data: me } = useMeQuery();
  const p = me?.plan;
  if (!p || !me?.user.workspaceId) return null;
  const manager = me.user.effectiveRole !== 'agent';
  let text: ReactNode = null;
  let tone = 'bg-c-orange-tint text-c-orange ring-auto-edge';
  if (!p.active) {
    const why = { none: 'No plan is active yet', expired: `Your plan expired on ${fmtDate(p.endsAt)}`, used_up: `All ${p.chatLimit?.toLocaleString('en-IN')} chats in your plan are used`, suspended: 'This account is suspended' }[p.reason ?? 'none'];
    text = <><b>{why}.</b> The bot is not replying automatically; you can still reply yourself. {manager && 'Contact your administrator to activate a plan.'}</>;
    tone = 'bg-err-tint text-err ring-err-edge';
  } else if (p.daysLeft !== null && p.daysLeft <= 2 && !p.upcoming) {
    text = <><b>{p.planName} ends {p.daysLeft === 0 ? 'today' : `in ${p.daysLeft} day${p.daysLeft === 1 ? '' : 's'}`}</b> ({fmtDate(p.endsAt)}). After that the bot stops replying. {manager && 'Renew to keep it running.'}</>;
  } else if (p.chatLimit && p.chatsLeft !== null && p.chatsLeft / p.chatLimit < 0.1) {
    text = <><b>Only {p.chatsLeft.toLocaleString('en-IN')} chats left</b> in {p.planName}.</>;
  } else {
    const days = p.daysLeft === null ? '' : ` · ${p.daysLeft} day${p.daysLeft === 1 ? '' : 's'} left (till ${fmtDate(p.endsAt)})`;
    const left = p.chatsLeft === null ? ' · unlimited chats' : ` · ${p.chatsLeft.toLocaleString('en-IN')} chats left`;
    text = <><b>✓ {p.planName} is active</b>{days}{left}. The bot is replying automatically.</>;
    tone = 'bg-c-green-tint text-c-green ring-brand-edge';
  }
  if (!text) return null;
  return (
    <div className={`mb-6 rounded-2xl p-4 text-sm ring-1 ${tone}`} role="status">
      {text} {manager && <Link href="/billing" className="font-semibold underline">Plan &amp; usage</Link>}
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(`${p}/`));
  const { data: me, isLoading, isError } = useMeQuery(undefined, { skip: isPublic });
  const [exitActAs] = useExitActAsMutation();
  const dispatch = useAppDispatch();

  const inWorkspace = !!me?.user.workspaceId;
  const role = me?.user.effectiveRole;
  let redirect: string | null = null;
  if (!isPublic && me) {
    if (!inWorkspace && !path.startsWith('/admin')) redirect = '/admin';
    else if (inWorkspace && path.startsWith('/admin') && !me.user.actingAs) redirect = '/dashboard';
    else if (role === 'agent' && !AGENT_PAGES.includes(path)) redirect = '/chats';
  }
  useEffect(() => {
    if (!isPublic && isError) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [isPublic, isError, path, router]);
  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (isPublic) return <>{children}</>;
  if (isLoading || isError || !me || redirect) return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>;

  async function leave() {
    await exitActAs();
    dispatch(api.util.resetApiState());
    window.location.href = '/admin/customers';
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {me.user.actingAs && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-c-violet px-4 py-2 text-sm text-white md:px-10">
            <span className="flex items-center gap-2"><Eye className="h-4 w-4" aria-hidden /> You are viewing <b>{me.workspace?.name}</b> as Super Admin. Changes apply to this customer.</span>
            <button className="rounded-lg bg-white/15 px-3 py-1 font-semibold hover:bg-white/25" onClick={leave}>Back to admin</button>
          </div>
        )}
        <header className="flex items-center justify-end gap-3 border-b border-line bg-white px-4 py-2 md:px-10">
          <UserMenu />
        </header>
        <main className="px-4 py-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-7xl">
            <PlanBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
