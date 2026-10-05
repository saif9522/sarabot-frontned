'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { errorText, useSignupInfoQuery, useSignupMutation } from '@/store/api';
import AuthLayout, { PasswordInput } from '@/components/AuthLayout';
import { chats, duration } from '@/lib/format';

export default function SignupPage() {
  const { data: info, isLoading: loadingInfo } = useSignupInfoQuery();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [f, setF] = useState({ businessName: '', name: '', email: '', mobile: '', password: '', confirm: '' });
  const mismatch = f.confirm.length > 0 && f.password !== f.confirm;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.password !== f.confirm) return;
    await signup({ businessName: f.businessName.trim(), name: f.name.trim(), email: f.email.trim(), mobile: f.mobile.trim() || undefined, password: f.password }).unwrap();
    window.location.href = '/';
  }

  if (info && !info.open) {
    return (
      <AuthLayout title="Sign-up is closed" subtitle="New accounts are created by our team.">
        <p className="text-sm text-muted">Contact us to get an account, or <Link href="/login" className="font-semibold text-c-indigo hover:underline">sign in</Link> if you already have one.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account"
      subtitle={info?.trial ? <>Start with a free trial: <b>{chats(info.trial.chatLimit)} chats for {duration(info.trial.durationDays)}</b>.</> : 'Set up your business. Your plan is activated by our team.'}>
      <form onSubmit={submit} className="space-y-4">
        <div><label htmlFor="s-biz" className="label">Business name</label><input id="s-biz" className="input" required minLength={2} maxLength={120} autoComplete="organization" value={f.businessName} onChange={(e) => setF({ ...f, businessName: e.target.value })} /></div>
        <div><label htmlFor="s-name" className="label">Your name</label><input id="s-name" className="input" required minLength={2} maxLength={120} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label htmlFor="s-email" className="label">Email</label><input id="s-email" type="email" className="input" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><label htmlFor="s-mob" className="label">Mobile (optional)</label><input id="s-mob" type="tel" className="input" maxLength={20} autoComplete="tel" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} /></div>
        <PasswordInput id="s-pw" label="Password" autoComplete="new-password" hint="At least 8 characters." value={f.password} onChange={(v) => setF({ ...f, password: v })} />
        <div>
          <PasswordInput id="s-pw2" label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={(v) => setF({ ...f, confirm: v })} />
          {mismatch && <p className="mt-1 text-xs text-err">Passwords don&apos;t match.</p>}
        </div>
        {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(error)}</p>}
        <button className="btn-primary w-full" disabled={isLoading || loadingInfo || mismatch}>{isLoading ? 'Creating account…' : 'Create account'}</button>
        <p className="text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-c-indigo hover:underline">Sign in</Link></p>
        <p className="text-center text-xs text-muted">Team members don&apos;t sign up here — your account owner adds them under Agents.</p>
      </form>
    </AuthLayout>
  );
}
