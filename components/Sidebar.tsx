'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BadgeIndianRupee, Bot, Building2, CreditCard, Gauge, IdCard, ReceiptIndianRupee, SlidersHorizontal, LayoutGrid, Menu, MessagesSquare, Package, Smartphone, UserCog, Users, X } from 'lucide-react';
import { useDashboardQuery, useMeQuery } from '@/store/api';
import { useLive } from '@/app/providers';
import type { Role } from '@/lib/types';
import { IconTile, Tone } from './ui';

type Item = { href: string; label: string; icon: typeof Bot; tone: Tone; badge?: boolean; roles?: Role[] };
const MANAGERS: Role[] = ['owner', 'admin'];

const WORKSPACE: Array<{ title: string | null; items: Item[] }> = [
  { title: null, items: [{ href: '/', label: 'Dashboard', icon: LayoutGrid, tone: 'indigo' }] },
  { title: 'Connect', items: [{ href: '/numbers', label: 'WhatsApp numbers', icon: Smartphone, tone: 'green', roles: MANAGERS }] },
  { title: 'Automate', items: [{ href: '/bots', label: 'Bots', icon: Bot, tone: 'violet', roles: MANAGERS }, { href: '/products', label: 'Products', icon: Package, tone: 'amber', roles: MANAGERS }] },
  { title: 'People', items: [
    { href: '/chats', label: 'Chat history', icon: MessagesSquare, tone: 'sky', badge: true },
    { href: '/subscribers', label: 'Subscribers', icon: Users, tone: 'pink', roles: MANAGERS },
    { href: '/agents', label: 'Agents', icon: UserCog, tone: 'blue', roles: MANAGERS },
  ] },
  { title: 'Account', items: [{ href: '/billing', label: 'Plan & usage', icon: CreditCard, tone: 'orange', roles: MANAGERS }] },
];
const ADMIN: Array<{ title: string | null; items: Item[] }> = [
  { title: 'Super Admin', items: [
    { href: '/admin', label: 'Overview', icon: Gauge, tone: 'indigo' },
    { href: '/admin/customers', label: 'Customers', icon: Building2, tone: 'green' },
    { href: '/admin/users', label: 'Users & agents', icon: IdCard, tone: 'blue' },
    { href: '/admin/plans', label: 'Plans', icon: BadgeIndianRupee, tone: 'violet' },
    { href: '/admin/payments', label: 'Payments', icon: ReceiptIndianRupee, tone: 'pink' },
    { href: '/admin/settings', label: 'Platform settings', icon: SlidersHorizontal, tone: 'amber' },
  ] },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const live = useLive();
  const { data: me } = useMeQuery();
  const inWorkspace = !!me?.user.workspaceId;
  const { data } = useDashboardQuery({}, { skip: !inWorkspace });
  const waiting = data?.needsHuman ?? 0;
  const role = me?.user.effectiveRole;
  const groups = (inWorkspace ? WORKSPACE : ADMIN)
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || (role && i.roles.includes(role))) }))
    .filter((g) => g.items.length);

  return (
    <aside className="border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-64 md:flex-none md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:py-5">
        <Link href={inWorkspace ? '/' : '/admin'} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-glow to-brand-dark shadow-sm">
            <MessagesSquare className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-tight text-navy">SAIF Chat</span>
            <span className="block max-w-[150px] truncate text-xs text-muted">{inWorkspace ? me?.workspace?.name : 'Platform admin'}</span>
          </span>
        </Link>
        <button className="rounded-md p-2 text-ink hover:bg-canvas md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <nav className={`${open ? 'block' : 'hidden'} px-3 pb-4 md:block`} aria-label="Main">
        {groups.map((g) => (
          <div key={g.title ?? 'home'} className="mb-4">
            {g.title && <p className="px-3 pb-1.5 text-xs font-semibold text-c-indigo">{g.title}</p>}
            <ul className="space-y-1">
              {g.items.map(({ href, label, icon, tone, badge }) => {
                const active = href === '/' || href === '/admin' ? path === href : path.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} aria-current={active ? 'page' : undefined}
                      className={`flex h-11 items-center gap-3 rounded-xl px-2 text-sm transition-colors ${active ? 'bg-c-indigo-tint font-semibold text-navy' : 'text-ink hover:bg-canvas'}`}>
                      <IconTile icon={icon} tone={tone} size="sm" solid={active} />
                      <span className="flex-1">{label}</span>
                      {badge && waiting > 0 && <span className="rounded-full bg-c-orange px-2 py-0.5 text-xs font-semibold text-white" aria-label={`${waiting} chats need you`}>{waiting}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p className="mt-6 flex items-center gap-2 px-3 text-xs text-muted">
          <span className={`h-2 w-2 rounded-full ${live ? 'bg-brand-glow' : 'bg-slate-400'}`} aria-hidden />
          {live ? 'Live updates on' : 'Connecting to server…'}
        </p>
      </nav>
    </aside>
  );
}
