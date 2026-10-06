'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useMeQuery } from '@/store/api';
import Brand from '../Brand';
import { NAV } from './nav';



export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { data: me } = useMeQuery();
  const dashboard = me ? (me.user.workspaceId ? '/dashboard' : '/admin') : null;

  const account = dashboard ? (
    <Link href={dashboard} className="btn-primary h-10 rounded-full px-5">Open dashboard</Link>
  ) : (
    <>
      <Link href="/login" className="btn-secondary h-10 rounded-full px-5">Log in</Link>
      <Link href="/signup" className="btn-primary h-10 rounded-full px-5">Start free trial</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Sarabot home"><Brand size="sm" /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Website">
          {NAV.map((n) => {
            const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium ${active ? 'bg-brand-tint text-brand-dark' : 'text-ink hover:bg-canvas'}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">{account}</div>
        <button className="rounded-lg p-2 text-ink hover:bg-canvas lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav id="site-menu" className="border-t border-line bg-white px-5 pb-5 pt-2 lg:hidden" aria-label="Website">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className={`block rounded-xl px-3 py-3 text-base font-medium ${path === n.href ? 'bg-brand-tint text-brand-dark' : 'text-ink'}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 [&>a]:w-full">{account}</div>
        </nav>
      )}
    </header>
  );
}
