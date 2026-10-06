'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { errorText, useForgotMutation } from '@/store/api';
import AuthLayout from '@/components/AuthLayout';

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [forgot, { isLoading, error, data }] = useForgotMutation();
  const [email, setEmail] = useState('');
  const [wait, setWait] = useState(0);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    await forgot({ email: email.trim() }).unwrap();
    setWait(RESEND_SECONDS);
  }

  if (data) {
    return (
      <AuthLayout title="Check your email">
        <div className="space-y-4">
          <p className="flex gap-3 rounded-xl bg-brand-tint p-4 text-sm text-brand-dark" role="status">
            <MailCheck className="h-5 w-5 flex-none" aria-hidden />
            <span>If <b>{email.trim()}</b> has an account, a reset link is on its way. It works for 1 hour.</span>
          </p>
          <p className="text-sm text-muted">Not in your inbox? Check <b>Spam</b> and <b>Promotions</b>. Emails can take a minute.</p>
          <button type="button" className="btn-secondary w-full" disabled={wait > 0 || isLoading}
            onClick={() => send().then(() => setResent(true)).catch(() => undefined)}>
            {isLoading ? 'Sending…' : wait > 0 ? `Send again in ${wait}s` : 'Send the link again'}
          </button>
          {resent && wait > 0 && <p className="text-center text-xs text-muted">Sent again. Only the newest link works.</p>}
          {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(error)}</p>}
          <p className="text-xs text-muted">You can ask for a link up to 3 times an hour. Still nothing? Ask your administrator to reset your password.</p>
          <Link href="/login" className="btn-secondary w-full">Back to sign in</Link>
        </div>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a link to set a new one.">
      <form onSubmit={send} className="space-y-5">
        <div><label htmlFor="f-email" className="label">Email</label><input id="f-email" type="email" autoComplete="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(error)}</p>}
        <button className="btn-primary w-full" disabled={isLoading}>{isLoading ? 'Sending…' : 'Send reset link'}</button>
        <p className="text-center text-sm"><Link href="/login" className="font-semibold text-c-indigo hover:underline">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
