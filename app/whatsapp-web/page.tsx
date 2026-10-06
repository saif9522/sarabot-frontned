import Link from 'next/link';
import type { Metadata } from 'next';
import { AlertTriangle, Check, Smartphone } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PageIntro from '@/components/site/PageIntro';

export const metadata: Metadata = {
  title: 'WhatsApp Web linking',
  description: 'Sarabot connects to your WhatsApp the same way WhatsApp Web does: by scanning a QR code under Linked devices. Here is how to link, and how to use it safely.',
};

const LINK_STEPS = [
  'In your Sarabot dashboard, open WhatsApp numbers and press Link a number. A QR code appears.',
  'On your phone, open WhatsApp (or WhatsApp Business).',
  'Android: tap ⋮ then Linked devices. iPhone: go to Settings then Linked devices.',
  'Tap Link a device and point your phone at the QR code.',
  'The status turns to Connected. Send a test message from another phone.',
];

const SAFE = [
  'Replies only to people who message you first',
  'Never replies in groups, broadcasts or channels',
  'Shows “typing…” and waits a moment before each reply, like a person',
  'Limits how many automatic replies one contact gets per hour',
  'Customers can send STOP to stop automatic replies, and START to resume',
];

export default function WhatsAppWebPage() {
  return (
    <SiteShell>
      <PageIntro width="max-w-5xl" title="Connects like WhatsApp Web">
        Sarabot becomes one of your Linked devices, just like WhatsApp Web on a laptop. You keep your number, your chats and your WhatsApp app.
      </PageIntro>

      <section className="mx-auto grid max-w-5xl gap-12 px-5 pb-16 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">Link your number</h2>
          <ol className="mt-6 space-y-4">
            {LINK_STEPS.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand font-display font-bold text-white">{i + 1}</span>
                <p className="pt-1 leading-relaxed text-ink">{s}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="h-fit rounded-2xl bg-brand-tint p-6">
          <Smartphone className="h-7 w-7 text-brand" aria-hidden />
          <h2 className="mt-3 font-display text-xl font-semibold text-navy">Good to know</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink">
            <li>Works with both WhatsApp and WhatsApp Business.</li>
            <li>You can still use WhatsApp on your phone as usual. Replies you send from the phone show up too.</li>
            <li>Your phone doesn’t need to stay on, but connect it to the internet now and then, or WhatsApp may remove linked devices after a long gap.</li>
            <li>To disconnect, press Unlink in Sarabot, or remove the device from Linked devices on your phone.</li>
          </ul>
        </aside>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="flex items-start gap-3 rounded-2xl border border-auto-edge bg-auto-tint p-6">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-none text-auto" aria-hidden />
            <div>
              <h2 className="font-display text-xl font-semibold text-navy">Please read: this is not the official WhatsApp Business API</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink">
                Linking works through WhatsApp’s linked-devices feature, not through Meta’s paid Business API. WhatsApp can restrict or ban numbers that send automated, bulk or unwanted messages. Use Sarabot to answer customers who contact you, never for promotions or spam, and prefer a business number over your personal one.
              </p>
            </div>
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold text-navy">How Sarabot keeps your number safe</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SAFE.map((s) => (
              <li key={s} className="flex items-start gap-2.5 leading-relaxed text-ink"><Check className="mt-1 h-4 w-4 flex-none text-brand" aria-hidden />{s}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
            <Link href="/how-it-works" className="btn-secondary h-12 rounded-full px-7 text-base">See the full setup</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
