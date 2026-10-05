'use client';
import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { errorText, useResetCheckQuery, useResetWithTokenMutation } from '@/store/api';
import AuthLayout, { PasswordInput } from '@/components/AuthLayout';

function ResetForm() {
  const token = useSearchParams().get('token') ?? '';
  const { data: check, isLoading: checking } = useResetCheckQuery(token, { skip: !token });
  const [reset, { isLoading, error }] = useResetWithTokenMutation();
  const [f, setF] = useState({ password: '', confirm: '' });
  const router = useRouter();
  const mismatch = f.confirm.length > 0 && f.password !== f.confirm;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.password !== f.confirm) return;
    await reset({ token, password: f.password }).unwrap();
    router.replace('/login?reset=1');
  }

  if (!token || (check && !check.valid)) {
    return (
      <AuthLayout title="This link doesn't work" subtitle="Reset links work once and expire after 1 hour.">
        <Link href="/forgot-password" className="btn-primary w-full">Get a new link</Link>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title="Set a new password" subtitle={check?.email ? <>For <b>{check.email}</b>. You&apos;ll be signed out on other devices.</> : undefined}>
      <form onSubmit={submit} className="space-y-4">
        <PasswordInput id="r-pw" label="New password" autoComplete="new-password" hint="At least 8 characters." value={f.password} onChange={(v) => setF({ ...f, password: v })} />
        <div>
          <PasswordInput id="r-pw2" label="Confirm new password" autoComplete="new-password" value={f.confirm} onChange={(v) => setF({ ...f, confirm: v })} />
          {mismatch && <p className="mt-1 text-xs text-err">Passwords don&apos;t match.</p>}
        </div>
        {error && <p className="rounded-lg bg-err-tint p-3 text-sm text-err" role="alert">{errorText(error)}</p>}
        <button className="btn-primary w-full" disabled={isLoading || checking || mismatch}>{isLoading ? 'Saving…' : 'Save new password'}</button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetForm /></Suspense>;
}
