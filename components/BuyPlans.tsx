'use client';
import { useState } from 'react';
import { ArrowUpCircle, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { api, errorText, useCreateOrderMutation, usePaymentFailedMutation, usePaymentOptionsQuery, useVerifyPaymentMutation } from '@/store/api';
import { useAppDispatch } from '@/store/store';
import { chats, duration, fmtDate, money } from '@/lib/format';

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

type RzpResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

export default function BuyPlans({ renewing }: { renewing: boolean }) {
  const { data, isLoading } = usePaymentOptionsQuery();
  const [createOrder] = useCreateOrderMutation();
  const [verify] = useVerifyPaymentMutation();
  const [reportFailed] = usePaymentFailedMutation();
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const durations = [...new Set((data?.plans ?? []).map((p) => p.durationDays))].sort((a, b) => a - b);
  const [picked, setPicked] = useState<number | null>(null);
  const shown = picked ?? durations[0];

  if (isLoading || !data) return null;
  if (!data.enabled) {
    return <p className="mt-6 rounded-2xl bg-c-blue-tint p-4 text-sm text-c-blue">Online payment isn&apos;t available yet. Contact your administrator to buy or renew a plan.</p>;
  }
  if (!data.plans.length) {
    return <p className="mt-6 rounded-2xl bg-c-blue-tint p-4 text-sm text-c-blue">No plans are on sale right now. Contact your administrator.</p>;
  }
  const running = data.current;

  /** Re-load plan, billing and payments (used after paying, in case the page missed the update). */
  function refreshSoon() {
    const refresh = () => dispatch(api.util.invalidateTags(['Billing', 'Me', 'Dashboard', 'Payments']));
    refresh();
    setTimeout(refresh, 4000);
    setTimeout(refresh, 12000);
  }

  async function buy(planId: string) {
    setMsg(null);
    setBusy(planId);
    try {
      if (!(await loadCheckout()) || !window.Razorpay) throw new Error('Could not load Razorpay. Check your internet connection or turn off ad-blockers and try again.');
      const order = await createOrder(planId).unwrap();
      let finished = false;
      const rzp = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: 'SAIF Chat', description: order.planName,
        prefill: { name: data!.prefill.name, email: data!.prefill.email },
        notes: { business: data!.business },
        theme: { color: '#7C3AED' },
        handler: async (r: RzpResponse) => {
          finished = true;
          setMsg({ tone: 'ok', text: 'Payment received. Activating your plan…' });
          try {
            const res = await verify(r).unwrap();
            setMsg({
              tone: 'ok',
              text: res.startsNow
                ? `Paid. ${res.planName ?? order.planName} is active now${res.endsAt ? ` until ${fmtDate(res.endsAt)}` : ''}.`
                : `Paid. ${res.planName ?? order.planName} starts on ${fmtDate(res.startsAt)}, right after your current plan.`,
            });
          } catch {
            setMsg({ tone: 'ok', text: 'Payment received. Your plan will be active within a minute; this page updates by itself.' });
          } finally {
            refreshSoon();
            setBusy(null);
          }
        },
        modal: {
          ondismiss: () => {
            if (!finished) reportFailed(order.orderId);
            setBusy(null);
          },
        },
      });
      rzp.on('payment.failed', (resp: unknown) => {
        const reason = (resp as { error?: { description?: string } })?.error?.description;
        setMsg({ tone: 'err', text: `The payment failed${reason ? `: ${reason}` : ''}. If money was deducted, it is refunded automatically by your bank. You can try again.` });
        setBusy(null);
      });
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
          <p className="text-sm text-muted">
            {running
              ? <>Same plan = renewal, starts after {fmtDate(running.endsAt)}. A different plan = upgrade, active the moment you pay.</>
              : 'Your plan becomes active as soon as the payment goes through.'}
          </p>
        </div>
        {durations.length > 1 && (
          <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-line" role="group" aria-label="Billing period">
            {durations.map((d) => (
              <button key={d} aria-pressed={d === shown} onClick={() => setPicked(d)} className={`h-9 rounded-full px-4 text-sm font-semibold ${d === shown ? 'bg-c-violet text-white' : 'text-c-violet hover:bg-c-violet-tint'}`}>{duration(d)}</button>
            ))}
          </div>
        )}
      </div>
      {msg && <p role="status" className={`mb-3 rounded-xl p-3 text-sm ${msg.tone === 'ok' ? 'bg-brand-tint text-brand-dark' : 'bg-err-tint text-err'}`}>{msg.text}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.plans.filter((p) => p.durationDays === shown).map((p) => {
          const isCurrent = running?.planId === p.id;
          const action = !running ? 'Buy' : isCurrent ? 'Renew' : 'Upgrade';
          return (
            <article key={p.id} className={`flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ${isCurrent ? 'ring-2 ring-c-violet' : 'ring-line'}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-navy">{p.name}</h3>
                {isCurrent && <span className="rounded-full bg-c-violet-tint px-2 py-0.5 text-xs font-semibold text-c-violet">Current</span>}
              </div>
              {p.description && <p className="mt-1 text-xs text-muted">{p.description}</p>}
              <p className="mt-2"><span className="font-display text-3xl font-bold text-navy">{money(p.price, p.currency)}</span> <span className="text-sm text-muted">/ {duration(p.durationDays)}</span></p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                {[`${chats(p.chatLimit)} automatic replies`, `${p.numbersLimit} WhatsApp number${p.numbersLimit === 1 ? '' : 's'}`, `${p.agentsLimit} team member${p.agentsLimit === 1 ? '' : 's'}`].map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-none text-c-green" aria-hidden />{f}</li>
                ))}
              </ul>
              <button className="btn-primary mt-5 w-full" disabled={!!busy} onClick={() => buy(p.id)}>
                {busy === p.id ? 'Opening payment…' : (
                  <>
                    {action === 'Upgrade' ? <ArrowUpCircle className="h-4 w-4" aria-hidden /> : action === 'Renew' ? <RefreshCw className="h-4 w-4" aria-hidden /> : null}
                    {action} · {money(p.price, p.currency)}
                  </>
                )}
              </button>
              {action === 'Upgrade' && <p className="mt-2 text-center text-[11px] text-muted">Starts now and replaces {running?.planName}.</p>}
            </article>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4" aria-hidden /> Secure payment by Razorpay: UPI, cards, netbanking and wallets.</p>
    </section>
  );
}
