'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { X, type LucideIcon } from 'lucide-react';
import { API_URL } from '@/lib/format';

export type Tone = 'indigo' | 'violet' | 'blue' | 'sky' | 'green' | 'orange' | 'amber' | 'pink';
const TONE: Record<Tone, { solid: string; soft: string }> = {
  indigo: { solid: 'bg-c-indigo text-white', soft: 'bg-c-indigo-tint text-c-indigo' },
  violet: { solid: 'bg-c-violet text-white', soft: 'bg-c-violet-tint text-c-violet' },
  blue: { solid: 'bg-c-blue text-white', soft: 'bg-c-blue-tint text-c-blue' },
  sky: { solid: 'bg-c-sky text-white', soft: 'bg-c-sky-tint text-c-sky' },
  green: { solid: 'bg-c-green text-white', soft: 'bg-c-green-tint text-c-green' },
  orange: { solid: 'bg-c-orange text-white', soft: 'bg-c-orange-tint text-c-orange' },
  amber: { solid: 'bg-c-amber text-white', soft: 'bg-c-amber-tint text-c-amber' },
  pink: { solid: 'bg-c-pink text-white', soft: 'bg-c-pink-tint text-c-pink' },
};
export const toneClass = (t: Tone, solid = false) => (solid ? TONE[t].solid : TONE[t].soft);

export function IconTile({ icon: Icon, tone, size = 'md', solid }: { icon: LucideIcon; tone: Tone; size?: 'sm' | 'md' | 'lg'; solid?: boolean }) {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl';
  const ic = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  return <span className={`grid flex-none place-items-center ${box} ${toneClass(tone, solid)}`}><Icon className={ic} aria-hidden /></span>;
}

export function PageHeader({ title, description, actions, icon, tone = 'indigo' }: { title: string; description?: ReactNode; actions?: ReactNode; icon?: LucideIcon; tone?: Tone }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-4">
        {icon && <IconTile icon={icon} tone={tone} size="lg" />}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={`inline-flex h-7 w-14 flex-none items-center rounded-full px-1 text-[10px] font-bold transition-colors disabled:opacity-50 ${checked ? 'justify-end bg-brand text-white' : 'justify-start bg-slate-300 text-slate-600'}`}>
      <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      <span className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running the effect on every render
  // (pages pass a new arrow function each time, which used to steal focus after every keystroke).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // Focus the first field only once, when the modal opens.
  useEffect(() => {
    if (!open) return;
    const box = ref.current;
    (box?.querySelector<HTMLElement>('input, textarea, select') ?? box?.querySelector<HTMLElement>('button'))?.focus();
  }, [open]);
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/50 p-4 pt-[8vh]" onMouseDown={(e) => e.target === e.currentTarget && closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`card w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} p-6 shadow-2xl`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-navy">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-muted hover:bg-canvas" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card border-dashed p-10 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}

export function ErrorNote({ what }: { what: string }) {
  return <div className="card border-err-edge bg-err-tint p-4 text-sm text-err">Couldn&apos;t load {what}. Check that the backend is running at {API_URL}.</div>;
}

export function StatusPill({ tone, children }: { tone: 'ok' | 'off' | 'warn' | 'busy'; children: ReactNode }) {
  const cls = { ok: 'border-brand-edge bg-brand-tint text-brand-dark', off: 'border-err-edge bg-err-tint text-err', warn: 'border-auto-edge bg-auto-tint text-auto', busy: 'border-tech-edge bg-tech-tint text-tech' }[tone];
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}
