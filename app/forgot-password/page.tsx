'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { errorText, useForgotMutation } from '@/store/api';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [forgot, { isLoading, error, data }] = useForgotMutation();
  const [email, setEmail] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    await forgot({ email: email.trim() }).unwrap();
  }
  if (data) {
    return (
      <AuthLayout title="Check your email">
        <div className="space-y-4">
          <p className="flex gap-3 rounded-xl bg-brand-tint p-4 text-sm text-brand-dark" role="status"><MailCheck className="h-5 w-5 flex-none" aria-hidden />{data.message}</p>
          <p className="text-sm text-muted">Didn&apos;t get it? Check spam, wait a minute and try again, or ask your administrator to reset your password.</p>
          <Link href="/login" className="btn-secondary w-full">Back to sign in</Link>
        </div>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a link to set a new one.">
      <form onSubmit={submit} className="space-y-5">
        <div><label htmlFor="f-email" className="label">Email</label><input id="f-email" type="email" autoComplete="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(error)}</p>}
        <button className="btn-primary w-full" disabled={isLoading}>{isLoading ? 'Sending…' : 'Send reset link'}</button>
        <p className="text-center text-sm"><Link href="/login" className="font-semibold text-c-indigo hover:underline">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
