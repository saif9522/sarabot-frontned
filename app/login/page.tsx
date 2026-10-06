'use client';
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { errorText, useLoginMutation, useOtpRequestMutation, useOtpVerifyMutation, useSignupInfoQuery } from '@/store/api';
import AuthLayout, { PasswordInput } from '@/components/AuthLayout';

const RESEND_SECONDS = 60;

function serverDown(e: unknown) {
  return !!e && typeof e === 'object' && 'status' in e && (e as { status: unknown }).status === 'FETCH_ERROR';
}

function LoginForm() {
  const params = useSearchParams();
  const { data: info } = useSignupInfoQuery();
  const [method, setMethod] = useState<'code' | 'password'>('password');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [wait, setWait] = useState(0);
  const [requestCode, req] = useOtpRequestMutation();
  const [verifyCode, ver] = useOtpVerifyMutation();
  const [login, pw] = useLoginMutation();
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);
  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  function done(role: string) {
    const next = params.get('next');
    // Full reload so live updates connect with the new session.
    window.location.href = next && next.startsWith('/') && !next.startsWith('//') ? next : role === 'superadmin' ? '/admin' : '/';
  }

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    ver.reset();
    await requestCode({ email: email.trim() }).unwrap();
    setMethod('code');
    setStep('code');
    setCode('');
    setWait(RESEND_SECONDS);
  }

  async function submitCode(value = code) {
    if (value.length !== 6 || ver.isLoading) return;
    const r = await verifyCode({ email: email.trim(), code: value }).unwrap().catch(() => null);
    if (r) done(r.role);
    else setCode('');
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    const r = await login({ email: email.trim(), password }).unwrap();
    done(r.role);
  }

  const subtitle = params.get('reset') ? 'Password changed. Sign in with your new password.' : method === 'code' && step === 'code' ? undefined : 'Welcome back.';

  return (
    <AuthLayout title={step === 'code' && method === 'code' ? 'Check your email' : 'Sign in'} subtitle={subtitle}>
      {method === 'code' && step === 'code' && (
        <form onSubmit={(e) => { e.preventDefault(); submitCode(); }} className="space-y-5">
          <p className="flex gap-3 rounded-xl bg-brand-tint p-4 text-sm text-brand-dark" role="status">
            <MailCheck className="h-5 w-5 flex-none" aria-hidden />
            <span>We sent a 6-digit code to <b>{email.trim()}</b> if it has an account. It works for 10 minutes.</span>
          </p>
          <div>
            <label htmlFor="l-code" className="label">Sign-in code</label>
            <input id="l-code" ref={codeRef} className="input h-14 text-center font-mono text-2xl tracking-[0.5em]" inputMode="numeric" autoComplete="one-time-code"
              pattern="\d{6}" maxLength={6} required value={code}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(v); if (v.length === 6) submitCode(v); }} />
          </div>
          {ver.error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(ver.error)}</p>}
          <button className="btn-primary w-full" disabled={ver.isLoading || code.length !== 6}>{ver.isLoading ? 'Checking…' : 'Sign in'}</button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="flex items-center gap-1 font-medium text-c-indigo hover:underline" onClick={() => { setMethod('password'); setStep('email'); ver.reset(); req.reset(); }}><ArrowLeft className="h-4 w-4" aria-hidden /> Use password instead</button>
            <button type="button" className="font-medium text-c-indigo hover:underline disabled:text-muted disabled:no-underline" disabled={wait > 0 || req.isLoading} onClick={() => sendCode()}>
              {wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
            </button>
          </div>
          <p className="text-xs text-muted">Not in your inbox? Check spam or promotions.</p>
        </form>
      )}

      {method === 'password' && (
        <form onSubmit={submitPassword} className="space-y-5">
          <div><label htmlFor="p-email" className="label">Email</label><input id="p-email" type="email" autoComplete="username" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div>
            <PasswordInput id="l-pw" label="Password" autoComplete="current-password" value={password} onChange={setPassword} />
            <Link href="/forgot-password" className="mt-1.5 inline-block text-sm font-medium text-c-indigo hover:underline">Forgot password?</Link>
          </div>
          {pw.error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{serverDown(pw.error) ? 'Can’t reach the server. Is the backend running?' : errorText(pw.error, 'Wrong email or password')}</p>}
          <button className="btn-primary w-full" disabled={pw.isLoading}>{pw.isLoading ? 'Signing in…' : 'Sign in'}</button>
          <div className="flex items-center gap-3 text-xs text-muted" aria-hidden><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
          <button type="button" className="btn-secondary w-full" disabled={req.isLoading} onClick={() => {
            const box = document.getElementById('p-email') as HTMLInputElement | null;
            if (!email.trim() || (box && !box.checkValidity())) { box?.reportValidity(); return; }
            pw.reset();
            sendCode().catch(() => undefined);
          }}>{req.isLoading ? 'Sending code…' : 'Email me a sign-in code'}</button>
          {req.error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{serverDown(req.error) ? 'Can’t reach the server. Is the backend running?' : errorText(req.error)}</p>}
          <p className="text-center text-xs text-muted">Forgot your password? Enter your email above and sign in with a one-time code instead.</p>
        </form>
      )}

      {info?.open !== false && <p className="mt-6 text-center text-sm text-muted">New here? <Link href="/signup" className="font-semibold text-c-indigo hover:underline">Create an account</Link></p>}
    </AuthLayout>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
