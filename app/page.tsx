import Link from 'next/link';
import type { Metadata } from 'next';
import { BellRing, Check, Clock3, Hand, Languages, MapPin, PackageSearch, QrCode, ShieldCheck, Store, UserRoundCheck, Users } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import ChatDemo from '@/components/site/ChatDemo';

export const metadata: Metadata = {
  title: { absolute: 'Sarabot – WhatsApp chatbot for shops and small businesses' },
  description: 'Sarabot answers your customers on WhatsApp in Hindi, English or Hinglish, day and night. Link your number with a QR code, add your products, and start in minutes.',
};

const ANSWERS = [
  { icon: PackageSearch, title: 'Prices and stock', text: 'From your product list. If something is out of stock, it says so instead of guessing.' },
  { icon: MapPin, title: 'Address, timings, delivery', text: 'From the business details you fill in once: location, phone, website, opening hours.' },
  { icon: Store, title: 'Anything you teach it', text: 'Write your FAQs, fees and rules in plain words, like you would explain them to a new staff member.' },
  { icon: BellRing, title: 'And when it doesn’t know', text: 'It doesn’t make things up. The chat is marked “Needs you” so you can reply yourself.' },
];

const STEPS = [
  { icon: QrCode, title: 'Link your WhatsApp', text: 'Scan a QR code from your phone, the same way you open WhatsApp Web. Your number stays the same.' },
  { icon: Store, title: 'Tell it about your business', text: 'Add your shop details, products and prices, and a welcome message. No coding.' },
  { icon: Hand, title: 'Let it reply, step in anytime', text: 'Sarabot answers new messages. Reply from your dashboard whenever you want, and the bot steps back.' },
];

const CONTROL = [
  { icon: Clock3, title: 'Day bot and night bot', text: 'One bot during working hours, another after closing time. Or the same bot all day.' },
  { icon: UserRoundCheck, title: 'Take over any chat', text: 'The moment you type a reply, the bot pauses for that customer.' },
  { icon: Users, title: 'Your team in one place', text: 'Add staff as agents. Each one sees the chats assigned to them.' },
  { icon: ShieldCheck, title: 'Careful by design', text: 'Only replies to people who message you first. Never in groups. Customers can send STOP anytime.' },
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-tint/70 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-navy sm:text-6xl">
              Customer WhatsApp karta hai. Sarabot turant jawab deta hai.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">
              Sarabot replies to your customers on WhatsApp in Hindi, English or Hinglish, day and night. Prices, stock, address, delivery: it answers from your own shop details, and hands the chat to you when it should.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
              <Link href="/how-it-works" className="btn-secondary h-12 rounded-full px-7 text-base">See how it works</Link>
            </div>
            <ul className="mt-8 grid max-w-lg gap-2.5 text-sm text-ink sm:grid-cols-2">
              {['Works with WhatsApp and WhatsApp Business', 'Set up in about 10 minutes', 'No new number needed', 'Free trial, no card needed'].map((t) => (
                <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-none text-brand" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
          <ChatDemo />
        </div>
      </section>

      {/* What it answers */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Answers from your shop, not from the internet</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Most customer messages are the same ten questions. Sarabot answers them with the facts you give it, in the language the customer wrote in.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-dark"><Languages className="h-5 w-5" aria-hidden /> Hindi, English, Hinglish and more</p>
          </div>
          <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {ANSWERS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t-2 border-brand pt-5">
                <dt className="flex items-center gap-2.5 font-display text-lg font-semibold text-navy"><Icon className="h-5 w-5 text-brand" aria-hidden />{title}</dt>
                <dd className="mt-2 leading-relaxed text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works (a real sequence) */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Live in three steps</h2>
            <Link href="/how-it-works" className="font-semibold text-brand-dark underline-offset-4 hover:underline">Full setup guide</Link>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <span className="font-display text-5xl font-bold text-brand/25" aria-hidden>{i + 1}</span>
                <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold text-navy"><Icon className="h-5 w-5 text-brand" aria-hidden />{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WhatsApp Web teaser */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-10 rounded-3xl bg-navy p-8 text-white md:grid-cols-[1.3fr_1fr] md:p-12">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Connects like WhatsApp Web</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/80">
              No Facebook business approval and no new number. Open WhatsApp on your phone, go to Linked devices, and scan the code in your Sarabot dashboard. That’s the whole connection.
            </p>
            <Link href="/whatsapp-web" className="mt-6 inline-block font-semibold text-brand-glow underline-offset-4 hover:underline">How linking works, and how to stay safe</Link>
          </div>
          <ol className="space-y-3 text-sm">
            {['Open WhatsApp on your phone', 'Tap Linked devices', 'Tap Link a device', 'Scan the QR code in Sarabot'].map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-glow font-display font-bold text-navy">{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Control */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">You stay in charge</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {CONTROL.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-brand" aria-hidden />
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-tint">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy">Try Sarabot on your own WhatsApp</h2>
            <p className="mt-2 text-ink">Start with a free trial. Pick a plan only if it works for your shop.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary h-12 rounded-full px-7 text-base">Start free trial</Link>
            <Link href="/pricing" className="btn-secondary h-12 rounded-full px-7 text-base">See pricing</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
