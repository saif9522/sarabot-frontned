import { ReactNode } from 'react';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';

/** Two-panel layout shared by sign in, sign up and password pages. */
export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-c-indigo via-c-violet to-c-pink p-12 text-white lg:flex" aria-hidden>
        <span className="flex items-center gap-3 font-display text-xl font-bold"><MessagesSquare className="h-7 w-7" /> SAIF Chat</span>
        <div>
          <p className="font-display text-4xl font-bold leading-tight">Your WhatsApp answers customers while you sleep.</p>
          <p className="mt-4 max-w-md text-white/90">Scan a QR code, add your business info and flows, and the bot replies in your customers&apos; language. Your team steps in when it matters.</p>
        </div>
        <Link href="/pricing" className="w-fit text-sm font-semibold underline">See plans and pricing</Link>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link href="/login" className="mb-6 flex items-center gap-3 font-display text-xl font-bold text-navy lg:hidden"><MessagesSquare className="h-7 w-7 text-brand" aria-hidden /> SAIF Chat</Link>
          <h1 className="font-display text-3xl font-bold text-navy">{title}</h1>
          {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function PasswordInput({ id, label, value, onChange, autoComplete, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type="password" autoComplete={autoComplete} minLength={autoComplete === 'new-password' ? 8 : undefined} className="input" required value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
