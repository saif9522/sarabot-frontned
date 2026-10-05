'use client';
import { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { errorText, useCreateOrderMutation, usePaymentOptionsQuery, useVerifyPaymentMutation } from '@/store/api';
import { chats, duration, money } from '@/lib/format';

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (ev: string, cb: (r: unknown) => void) => void } }
}

/** Loads Razorpay Checkout once. */
function loadCheckout(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BuyPlans({ renewing }: { renewing: boolean }) {
  const { data, isLoading } = usePaymentOptionsQuery();
  const [createOrder] = useCreateOrderMutation();
  const [verify] = useVerifyPaymentMutation();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const durations = [...new Set((data?.plans ?? []).map((p) => p.durationDays))].sort((a, b) => a - b);
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked ?? durations[0];

  if (isLoading || !data) return null;
  if (!data.enabled) {
    return <p className="rounded-2xl bg-c-blue-tint p-4 text-sm text-c-blue">Online payment isn&apos;t available yet. Contact your administrator to buy or renew a plan.</p>;
  }
  if (!data.plans.length) return null;

  async function buy(planId: string) {
    setMsg(null);
    setBusy(planId);
    try {
      if (!(await loadCheckout()) || !window.Razorpay) throw new Error('Could not load Razorpay. Check your internet connection.');
      const order = await createOrder(planId).unwrap();
      const rzp = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: 'SAIF Chat', description: order.planName,
        prefill: { name: data!.prefill.name, email: data!.prefill.email },
        notes: { business: data!.business },
        theme: { color: '#7C3AED' },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verify(r).unwrap();
            setMsg({ tone: 'ok', text: renewing ? `Paid. ${order.planName} starts when your current plan ends.` : `Paid. ${order.planName} is now active.` });
          } catch {
            setMsg({ tone: 'ok', text: 'Payment received. Your plan will be active within a minute — refresh this page.' });
          } finally {
            setBusy(null);
          }
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.on('payment.failed', () => { setMsg({ tone: 'err', text: 'The payment failed. No money was taken — you can try again.' }); setBusy(null); });
      rzp.open();
    } catch (e) {
      setMsg({ tone: 'err', text: e instanceof Error ? e.message : errorText(e, 'Could not start the payment') });
      setBusy(null);
    }
  }

  return (
    <section className="mt-6" aria-labelledby="buy">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="buy" className="font-display text-xl font-semibold text-navy">{renewing ? 'Renew or upgrade' : 'Choose a plan'}</h2>
          <p className="text-sm text-muted">{renewing ? 'A new plan starts when your current one ends, so you never lose days.' : 'Your plan starts as soon as the payment goes through.'}</p>
        </div>
        {durations.length > 1 && (
          <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-line" role="group" aria-label="Billing period">
            {durations.map((d) => (
              <button key={d} aria-pressed={d === current} onClick={() => setPicked(d)} className={`h-9 rounded-full px-4 text-sm font-semibold ${d === current ? 'bg-c-violet text-white' : 'text-c-violet hover:bg-c-violet-tint'}`}>{duration(d)}</button>
            ))}
          </div>
        )}
      </div>
      {msg && <p role="status" className={`mb-3 rounded-xl p-3 text-sm ${msg.tone === 'ok' ? 'bg-brand-tint text-brand-dark' : 'bg-err-tint text-err'}`}>{msg.text}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.plans.filter((p) => p.durationDays === current).map((p) => (
          <article key={p.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-line">
            <h3 className="font-display text-lg font-semibold text-navy">{p.name}</h3>
            <p className="mt-2"><span className="font-display text-3xl font-bold text-navy">{money(p.price, p.currency)}</span> <span className="text-sm text-muted">/ {duration(p.durationDays)}</span></p>
            <ul className="mt-4 flex-1 space-y-1.5 text-sm">
              {[`${chats(p.chatLimit)} automatic replies`, `${p.numbersLimit} WhatsApp number${p.numbersLimit === 1 ? '' : 's'}`, `${p.agentsLimit} team member${p.agentsLimit === 1 ? '' : 's'}`].map((f) => (
                <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-none text-c-green" aria-hidden />{f}</li>
              ))}
            </ul>
            <button className="btn-primary mt-5 w-full" disabled={!!busy} onClick={() => buy(p.id)}>{busy === p.id ? 'Opening payment…' : `Pay ${money(p.price, p.currency)}`}</button>
          </article>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4" aria-hidden /> Secure payment by Razorpay: UPI, cards, netbanking and wallets.</p>
    </section>
  );
}
