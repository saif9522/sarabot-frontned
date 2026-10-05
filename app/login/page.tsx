'use client';
import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { errorText, useLoginMutation, useSignupInfoQuery } from '@/store/api';
import AuthLayout, { PasswordInput } from '@/components/AuthLayout';

function LoginForm() {
  const params = useSearchParams();
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: info } = useSignupInfoQuery();
  const [f, setF] = useState({ email: '', password: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await login({ email: f.email.trim(), password: f.password }).unwrap();
    const next = params.get('next');
    // Full reload so live updates connect with the new session.
    window.location.href = next && next.startsWith('/') && !next.startsWith('//') ? next : r.role === 'superadmin' ? '/admin' : '/';
  }

  return (
    <AuthLayout title="Sign in" subtitle={params.get('reset') ? 'Password changed. Sign in with your new password.' : 'Welcome back.'}>
      <form onSubmit={submit} className="space-y-5">
        <div><label htmlFor="l-email" className="label">Email</label><input id="l-email" type="email" autoComplete="username" className="input" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div>
          <PasswordInput id="l-pw" label="Password" autoComplete="current-password" value={f.password} onChange={(v) => setF({ ...f, password: v })} />
          <Link href="/forgot-password" className="mt-1.5 inline-block text-sm font-medium text-c-indigo hover:underline">Forgot password?</Link>
        </div>
        {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{'status' in error && error.status === 'FETCH_ERROR' ? 'Can’t reach the server. Is the backend running?' : errorText(error, 'Wrong email or password')}</p>}
        <button className="btn-primary w-full" disabled={isLoading}>{isLoading ? 'Signing in…' : 'Sign in'}</button>
        {info?.open !== false && <p className="text-center text-sm text-muted">New here? <Link href="/signup" className="font-semibold text-c-indigo hover:underline">Create an account</Link></p>}
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
