import Link from 'next/link';
import type { Metadata } from 'next';
import { BellRing, Bot, Check, HeartHandshake, ShoppingBag, ShoppingBasket, Clock3, Hand, Languages, MapPin, PackageSearch, ShieldCheck, Store, UserRoundCheck, Users } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import JsonLd from '@/components/site/JsonLd';
import { SOLUTIONS } from '@/components/site/solutions';
import { pageMetadata } from '@/lib/seo';
import { faqSchema, organizationSchema, softwareSchema, websiteSchema } from '@/lib/schema';
import Container from '@/components/site/Container';
import PhoneChat from '@/components/site/PhoneChat';
import Typewriter from '@/components/site/Typewriter';
import BusinessMarquee from '@/components/site/BusinessMarquee';
import { FormArt, InboxArt, QrArt, ReplyArt } from '@/components/site/Visuals';

export const metadata: Metadata = pageMetadata({
  title: 'Sarabot – AI WhatsApp Chatbot for Business in India | Auto Reply 24/7',
  description: 'Sarabot is an AI WhatsApp chatbot that auto-replies to your customers 24/7 with prices, stock, delivery and order details. Link your number with a QR code, no API needed. Free trial for e-commerce, grocery stores, NGOs and small businesses.',
  path: '/',
  absoluteTitle: true,
  keywords: ['best WhatsApp chatbot India', 'WhatsApp chatbot free trial', 'WhatsApp AI assistant for business', 'automatic WhatsApp reply for shop'],
});

const FAQ = [
  { q: 'What is Sarabot?', a: 'Sarabot is an AI WhatsApp chatbot for businesses. It links to your WhatsApp number with a QR code and automatically replies to customer messages using your own product list and business information.' },
  { q: 'Do I need the WhatsApp Business API?', a: 'No. Sarabot connects as a linked device, the same way WhatsApp Web does, so you can use your existing WhatsApp or WhatsApp Business number without API approval.' },
  { q: 'Which languages does the chatbot reply in?', a: 'It replies in the language the customer writes in, including English, Hindi and other Indian languages.' },
  { q: 'How long does setup take?', a: 'About ten minutes: create an account, scan the QR code, add your business details and products, and test your bot.' },
  { q: 'Is there a free trial?', a: 'Yes. New accounts get a free trial with no card needed, so you can test Sarabot on your own WhatsApp number before choosing a plan.' },
  { q: 'Which businesses use Sarabot?', a: 'Online stores, grocery and daily-use product shops, NGOs, clinics, coaching centres, salons, restaurants and any business that gets customer questions on WhatsApp.' },
];

/** Rotating words in the hero heading (short enough for one line on phones). */
const HERO_WORDS = ['online stores', 'grocery shops', 'NGOs', 'clinics', 'restaurants', 'salons', 'your business'];

const ANSWERS = [
  { icon: PackageSearch, title: 'Prices and stock', text: 'From your product list. If something is out of stock, it says so instead of guessing.' },
  { icon: MapPin, title: 'Address, timings, delivery', text: 'From the business details you fill in once: location, phone, website, opening hours.' },
  { icon: Store, title: 'Anything you teach it', text: 'Write your FAQs, fees and rules in plain words, like you would explain them to a new staff member.' },
  { icon: BellRing, title: 'And when it doesn’t know', text: 'It doesn’t make things up. The chat is marked “Needs you” so you can reply yourself.' },
];

const STEPS = [
  { art: <QrArt />, title: 'Link your WhatsApp', text: 'Scan a QR code from your phone, the same way you open WhatsApp Web. Your number stays the same.' },
  { art: <FormArt />, title: 'Tell it about your business', text: 'Add your shop details, products and prices, and a welcome message. No coding.' },
  { art: <ReplyArt />, title: 'Let it reply, step in anytime', text: 'Sarabot answers new messages. Reply from your dashboard whenever you want, and the bot steps back.' },
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
      <JsonLd data={[organizationSchema, websiteSchema, softwareSchema, faqSchema(FAQ)]} />
      {/* Hero: the late-night chat is the star */}
      <section className="hero-bg relative overflow-hidden text-white">
        <Container className="grid items-center gap-14 py-16 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="sr-only">The AI WhatsApp chatbot that answers your customers 24/7, for online stores, grocery shops, NGOs and every business</span>
              <span aria-hidden>
                The AI WhatsApp chatbot for{' '}
                <Typewriter words={HERO_WORDS} className="block whitespace-nowrap text-[#25D366]" />
                <span className="block text-white/90">replying 24/7.</span>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              Sarabot auto-replies on your WhatsApp number with prices, stock, delivery and order details from your own business information. It works day and night in your customer’s language, and hands the chat to you when a person is needed.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center rounded-full bg-[#25D366] px-8 py-3.5 text-base font-semibold text-[#07122A] shadow-lg shadow-[#25D366]/20 hover:bg-white">Start free trial</Link>
              <Link href="/how-it-works" className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10">See how it works</Link>
            </div>
            <ul className="mt-9 grid max-w-xl gap-3 text-sm text-white/85 sm:grid-cols-2">
              {['Works with WhatsApp and WhatsApp Business', 'Set up in about 10 minutes', 'No new number needed', 'Free trial, no card needed'].map((t) => (
                <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-none text-[#25D366]" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <PhoneChat />
              <div className="absolute right-full top-[30%] -mr-4 hidden w-44 items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-navy shadow-xl xl:flex" aria-hidden>
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-tint"><Bot className="h-4 w-4 text-brand" /></span>
                <span className="leading-tight"><span className="block text-[13px] font-semibold">Replied by Sarabot</span><span className="block text-[11px] text-muted">in seconds, day or night</span></span>
              </div>
              <div className="absolute left-full top-[56%] -ml-4 hidden w-44 items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-navy shadow-xl xl:flex" aria-hidden>
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-auto-tint"><Hand className="h-4 w-4 text-auto" /></span>
                <span className="leading-tight"><span className="block text-[13px] font-semibold">New order</span><span className="block text-[11px] text-muted">needs you in the morning</span></span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Who it's for: colourful strip that keeps moving */}
      <BusinessMarquee />

      {/* What it answers */}
      <section className="bg-white">
        <Container className="grid gap-14 py-20 md:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">Answers from your shop, not from the internet</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Most customer messages are the same ten questions. Sarabot answers them with the facts you give it, in the language the customer wrote in.
            </p>
            <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-tint px-4 py-2 text-sm font-semibold text-brand-dark"><Languages className="h-4 w-4" aria-hidden /> Replies in English, Hindi and more</p>
          </div>
          <dl className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {ANSWERS.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <dt>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-sm"><Icon className="h-6 w-6" aria-hidden /></span>
                  <span className="mt-5 block font-display text-xl font-semibold text-navy">{title}</span>
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Three steps, each with its own picture */}
      <section className="bg-canvas">
        <Container className="py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">Live in three steps</h2>
            <Link href="/how-it-works" className="font-semibold text-brand-dark underline underline-offset-4">Full setup guide</Link>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map(({ art, title, text }, i) => (
              <li key={title} className="relative flex flex-col rounded-3xl bg-white ring-1 ring-line">
                <div className="steps-panel flex h-72 items-center justify-center rounded-t-3xl p-6">{art}</div>
                <span className="absolute left-7 top-72 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-navy font-display text-lg font-bold text-white ring-4 ring-white" aria-hidden>{i + 1}</span>
                <div className="px-7 pb-8 pt-10">
                  <p className="font-display text-sm font-bold text-brand">Step {i + 1}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-navy">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="absolute -right-9 top-36 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#25D366] text-xl font-bold text-navy shadow-lg md:grid" aria-hidden>→</span>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Dashboard */}
      <section className="bg-white">
        <Container className="grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
          <div className="order-2 lg:order-1"><InboxArt /></div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">Every chat, in one place</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              See what the bot answered, which customers need you, and who on your team is replying. Open any chat and reply yourself, from a laptop or your phone’s browser.
            </p>
            <ul className="mt-8 space-y-3">
              {['Chats that need you are counted and highlighted', 'Assign chats to your staff', 'Download your subscriber list anytime'].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-ink"><Check className="mt-1 h-4 w-4 flex-none text-brand" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* WhatsApp Web */}
      <section className="hero-bg text-white">
        <Container className="grid items-center gap-12 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Connects like WhatsApp Web</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              No Facebook business approval and no new number. Open WhatsApp on your phone, go to Linked devices, and scan the code in your Sarabot dashboard. That’s the whole connection.
            </p>
            <Link href="/whatsapp-web" className="mt-7 inline-block font-semibold text-[#25D366] underline underline-offset-4">How linking works, and how to stay safe</Link>
          </div>
          <ol className="space-y-3">
            {['Open WhatsApp on your phone', 'Tap Linked devices', 'Tap Link a device', 'Scan the QR code in Sarabot'].map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-2xl bg-white/[0.07] px-5 py-4 ring-1 ring-white/10">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#25D366] font-display font-bold text-[#07122A]">{i + 1}</span>
                <span className="text-base">{s}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Control */}
      <section className="bg-white">
        <Container className="py-20 md:py-28">
          <h2 className="font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">You stay in charge</h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {CONTROL.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t-2 border-navy pt-6">
                <Icon className="h-7 w-7 text-brand" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Solutions: internal links to industry pages */}
      <section className="bg-canvas">
        <Container className="py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">Built for online stores, grocery shops and NGOs</h2>
            <Link href="/solutions" className="font-semibold text-brand-dark underline underline-offset-4">All solutions</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SOLUTIONS.map((sol) => {
              const Icon = sol.slug === 'ngo' ? HeartHandshake : sol.slug === 'grocery' ? ShoppingBasket : ShoppingBag;
              return (
                <Link key={sol.slug} href={`/solutions/${sol.slug}`} className="group flex flex-col rounded-3xl bg-white p-8 ring-1 ring-line transition-colors hover:ring-brand">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-tint"><Icon className="h-7 w-7 text-brand" aria-hidden /></span>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-navy">WhatsApp chatbot for {sol.phrase}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{sol.short}</p>
                  <span className="mt-6 font-semibold text-brand-dark group-hover:underline">See how it works for {sol.slug === 'ngo' ? 'NGOs' : sol.slug === 'grocery' ? 'grocery stores' : 'online stores'}</span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ (also sent to Google as FAQPage data) */}
      <section className="bg-white">
        <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">Questions about Sarabot</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">Can’t find an answer? <Link href="/about" className="font-semibold text-brand-dark underline underline-offset-4">Contact our team</Link> and we’ll reply.</p>
          </div>
          <div className="divide-y divide-line rounded-2xl ring-1 ring-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-navy">{f.q}<span className="text-2xl text-brand transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-dark via-brand to-[#16a36a] text-white">
        <Container className="flex flex-wrap items-center justify-between gap-8 py-16 md:py-20">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Try Sarabot on your own WhatsApp</h2>
            <p className="mt-3 text-lg text-white/85">Start with a free trial. Pick a plan only if it works for your shop.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-dark hover:bg-[#07122A] hover:text-white">Start free trial</Link>
            <Link href="/pricing" className="inline-flex items-center rounded-full border border-white/50 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10">See pricing</Link>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
