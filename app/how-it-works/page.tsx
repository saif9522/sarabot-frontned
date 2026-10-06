import Link from 'next/link';
import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import PageIntro from '@/components/site/PageIntro';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'Set up Sarabot in five steps: create an account, link WhatsApp with a QR code, add your business details and products, set your hours, and let it reply.',
};

const STEPS = [
  {
    title: 'Create your account',
    text: 'Sign up with your business name, email and a password. Your free trial starts straight away, no card needed.',
  },
  {
    title: 'Link your WhatsApp number',
    text: 'In WhatsApp numbers, press Link a number and scan the QR code from your phone (WhatsApp → Linked devices → Link a device). It works with WhatsApp and WhatsApp Business, and your number stays the same.',
  },
  {
    title: 'Tell your bot about the business',
    text: 'Fill in your shop name, address, phone, website and timings, then write your FAQs in plain words: delivery charges, payment options, return rules. Sarabot answers only from what you write here.',
  },
  {
    title: 'Add products and quick replies',
    text: 'Add products with prices and stock so the bot can answer “rate kya hai?”. Optionally make flows: when someone types “menu” or “offers”, send a fixed reply with an image or a PDF.',
  },
  {
    title: 'Choose who replies when',
    text: 'Pick one bot for working hours and one for after hours, or the same bot for both. Then try it in the Test tab before your customers do.',
  },
];

const FAQ = [
  { q: 'Which language does it reply in?', a: 'The language the customer writes in. Hindi, English and Hinglish work well, and other languages too.' },
  { q: 'What if a customer asks something it doesn’t know?', a: 'It doesn’t invent an answer. The chat is marked “Needs you” on your dashboard and you reply yourself.' },
  { q: 'Can I reply myself?', a: 'Yes, from Chat history on your dashboard or from your phone as usual. When you reply from the dashboard, the bot pauses for that customer until you hand the chat back.' },
  { q: 'Does it message people on its own?', a: 'No. Sarabot only replies to people who message you first. It never posts in groups and never sends bulk messages.' },
  { q: 'What counts as one chat in my plan?', a: 'One automatic reply from the bot. Replies you or your team type are always free.' },
  { q: 'Does my phone need to stay on?', a: 'Like WhatsApp Web, the link keeps working when your phone is off for a while. Connect your phone to the internet now and then so WhatsApp keeps the link active.' },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <PageIntro title="How Sarabot works">
        From sign-up to the first automatic reply takes about ten minutes. Here’s every step.
      </PageIntro>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <ol className="relative ml-5 space-y-10 border-l-2 border-brand-edge pl-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="absolute -left-[3.05rem] grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-lg font-bold text-white ring-4 ring-white">{i + 1}</span>
              <h2 className="font-display text-2xl font-semibold text-navy">{s.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
          <Link href="/whatsapp-web" className="btn-secondary h-12 rounded-full px-7 text-base">Read about linking WhatsApp</Link>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy">Common questions</h2>
          <div className="mt-8 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                  {f.q}<span className="text-xl text-brand transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
