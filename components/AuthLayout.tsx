import { ReactNode } from 'react';
import Link from 'next/link';
import Brand from './Brand';

/** Two-panel layout shared by sign in, sign up and password pages. */
export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-navy p-12 text-white lg:flex">
        <Link href="/" className="w-fit"><Brand light /></Link>
        <div>
          <p className="font-display text-4xl font-bold leading-tight">Your WhatsApp answers customers, even while you sleep.</p>
          <p className="mt-4 max-w-md text-white/80">Scan a QR code, add your business info and flows, and the bot replies in your customers&apos; language. Your team steps in when it matters.</p>
        </div>
        <span className="flex gap-5 text-sm font-semibold"><Link href="/" className="underline">Home</Link><Link href="/pricing" className="underline">Plans and pricing</Link></span>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-6 block w-fit lg:hidden"><Brand /></Link>
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
