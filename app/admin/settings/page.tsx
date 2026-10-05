'use client';
import { FormEvent, useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { errorText, usePlatformSettingsQuery, useSavePlatformSettingsMutation } from '@/store/api';
import { ErrorNote, PageHeader, StatusPill, Switch } from '@/components/ui';
import { API_ORIGIN } from '@/lib/format';

const SOURCE = { dashboard: 'Set here', env: 'From .env', unset: 'Not set' } as const;

export default function SettingsPage() {
  const { data, isError } = usePlatformSettingsQuery();
  const [save, { isLoading, error, isSuccess }] = useSavePlatformSettingsMutation();
  const [f, setF] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setF(Object.fromEntries(data.filter((s) => !s.secret).map((s) => [s.key, s.value])));
  }, [data]);
  if (isError) return <ErrorNote what="settings" />;
  if (!data) return <p className="text-muted">Loading…</p>;
  const by = Object.fromEntries(data.map((s) => [s.key, s]));

  async function submit(e: FormEvent) {
    e.preventDefault();
    // Secrets left empty keep their current value.
    const body = Object.fromEntries(Object.entries(f).filter(([k, v]) => !(by[k]?.secret && v === '')));
    await save(body).unwrap();
    setF((cur) => Object.fromEntries(Object.entries(cur).filter(([k]) => !by[k]?.secret)));
  }
  const field = (key: string, placeholder?: string, hint?: string) => {
    const s = by[key];
    return (
      <div key={key}>
        <div className="mb-1.5 flex items-center justify-between gap-2"><label htmlFor={`s-${key}`} className="text-sm font-medium text-ink">{s.label}</label><StatusPill tone={s.source === 'unset' ? 'off' : 'ok'}>{SOURCE[s.source]}</StatusPill></div>
        <input id={`s-${key}`} className="input font-mono" type={s.secret ? 'password' : 'text'} autoComplete="off"
          placeholder={s.secret ? (s.value ? `Saved (${s.value}). Leave empty to keep.` : placeholder) : placeholder}
          value={f[key] ?? ''} onChange={(e) => setF({ ...f, [key]: e.target.value })} />
        {hint && <p className="hint">{hint}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={submit}>
      <PageHeader icon={SlidersHorizontal} tone="amber" title="Platform settings" description="Keys saved here are encrypted and take priority over backend/.env. No restart needed."
        actions={<button className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving…' : 'Save settings'}</button>} />
      {error && <p className="mb-4 rounded-xl bg-err-tint p-3 text-sm text-err">{errorText(error)}</p>}
      {isSuccess && <p className="mb-4 rounded-xl bg-brand-tint p-3 text-sm text-brand-dark" role="status">Saved. New values are in use now.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4 p-5" aria-labelledby="ai">
          <h2 id="ai" className="font-display text-lg font-semibold text-navy">AI replies (Google Gemini)</h2>
          {field('GEMINI_API_KEY', 'AIza…', 'Get a key at aistudio.google.com/apikey. Used by every customer’s bots.')}
          {field('LLM_MODEL', 'gemini-2.5-flash')}
        </section>
        <section className="card space-y-4 p-5" aria-labelledby="rzp">
          <h2 id="rzp" className="font-display text-lg font-semibold text-navy">Payments (Razorpay)</h2>
          {field('RAZORPAY_KEY_ID', 'rzp_live_… or rzp_test_…', 'Razorpay Dashboard → Account & Settings → API Keys.')}
          {field('RAZORPAY_KEY_SECRET', 'Key secret')}
          {field('RAZORPAY_WEBHOOK_SECRET', 'Webhook secret', `Webhooks → Add: URL ${API_ORIGIN}/api/payments/webhook, events payment.captured, order.paid, payment.failed. The URL must be public (not localhost) for webhooks.`)}
        </section>
        <section className="card space-y-3 p-5" aria-labelledby="su">
          <h2 id="su" className="font-display text-lg font-semibold text-navy">Sign-up</h2>
          <div className="flex items-center gap-3">
            <Switch checked={(f.ALLOW_SIGNUP ?? 'true') !== 'false'} label="Allow sign-up" onChange={(v) => setF({ ...f, ALLOW_SIGNUP: v ? 'true' : 'false' })} />
            <span className="text-sm">Businesses can create their own account at /signup</span>
          </div>
        </section>
      </div>
    </form>
  );
}
