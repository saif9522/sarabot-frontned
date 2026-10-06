'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BatteryFull, CheckCheck, Mic, Paperclip, Phone, Signal, Smile, Video, Wifi } from 'lucide-react';

type Line = { from: 'customer' | 'bot'; text: string };
type Conversation = { store: string; initials: string; time: string; lines: Line[] };

/** Three real-life chats that play one after another, forever. */
const CONVERSATIONS: Conversation[] = [
  {
    store: 'Sharma Grocery Store', initials: 'SG', time: '22:42',
    lines: [
      { from: 'customer', text: 'Hi, what is the price of 5 kg wheat flour?' },
      { from: 'bot', text: 'Whole Wheat Flour 5 kg is ₹265 and in stock. Reply "order" to place an order.' },
      { from: 'customer', text: 'Do you deliver at home?' },
      { from: 'bot', text: 'Yes, free delivery within 3 km. We can deliver tomorrow by 10 am.' },
      { from: 'customer', text: 'order' },
      { from: 'bot', text: 'Great! Please share your name and address and we will confirm your order.' },
    ],
  },
  {
    store: 'StyleKart Fashion', initials: 'SK', time: '23:15',
    lines: [
      { from: 'customer', text: 'Is the blue cotton kurta available in size L?' },
      { from: 'bot', text: 'Yes! The Blue Cotton Kurta is in stock in L for ₹899. Cash on delivery is available.' },
      { from: 'customer', text: 'How many days for delivery to Pune?' },
      { from: 'bot', text: 'Orders to Pune arrive in 3 to 5 working days. You get a tracking link once it ships.' },
      { from: 'customer', text: 'Can I return it if it doesn’t fit?' },
      { from: 'bot', text: 'Yes, free returns within 7 days of delivery. Just reply "return" to start.' },
    ],
  },
  {
    store: 'Hope Foundation', initials: 'HF', time: '06:05',
    lines: [
      { from: 'customer', text: 'How can I donate to your education program?' },
      { from: 'bot', text: 'Thank you! You can donate by UPI or bank transfer. Reply "donate" for the details.' },
      { from: 'customer', text: 'I want to volunteer on weekends.' },
      { from: 'bot', text: 'Wonderful! Weekend sessions run every Sunday, 10 am to 1 pm. Please share your name and city.' },
    ],
  },
];

/** "22:42" + minutes → "10:43 pm" */
const fmtTime = (base: string, add: number) => {
  const [h, m] = base.split(':').map(Number);
  const total = h * 60 + m + add;
  const hh = Math.floor(total / 60) % 24, mm = total % 60;
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'am' : 'pm'}`;
};
const clock = (base: string) => fmtTime(base, 0).replace(/ [ap]m$/, '');

/** A phone (not a tablet) with a WhatsApp chat that keeps playing. */
export default function PhoneChat() {
  const [conv, setConv] = useState(0);
  // Server render and reduced-motion users get the first conversation, complete.
  const [shown, setShown] = useState(CONVERSATIONS[0].lines.length);
  const [typing, setTyping] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [animate, setAnimate] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const lines = CONVERSATIONS[conv].lines;
    if (shown >= lines.length) {
      // Finished: hold, fade out, then start the next conversation.
      const t1 = setTimeout(() => setLeaving(true), 3500);
      const t2 = setTimeout(() => { setShown(0); setConv((c) => (c + 1) % CONVERSATIONS.length); setLeaving(false); }, 4100);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    let t: ReturnType<typeof setTimeout>;
    if (lines[shown].from === 'bot') {
      setTyping(true);
      t = setTimeout(() => { setTyping(false); setShown((n) => n + 1); }, 1500);
    } else {
      t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 600 : 1300);
    }
    return () => clearTimeout(t);
  }, [animate, conv, shown]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typing]);

  const c = CONVERSATIONS[conv];
  const visible = c.lines.slice(0, shown);

  return (
    <figure className="relative mx-auto w-[300px] sm:w-[320px]" aria-label="Example: customers message businesses on WhatsApp and Sarabot replies">
      <span className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-slate-700" aria-hidden />
      <span className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-slate-700" aria-hidden />
      <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-slate-700" aria-hidden />

      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[3rem] border-[11px] border-[#111827] bg-[#111827] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <div className="flex h-full flex-col overflow-hidden rounded-[2.2rem] bg-[#EFEAE2]">
          {/* status bar + island */}
          <div className="relative flex h-9 flex-none items-center justify-between bg-[#075E54] px-6 text-[11px] font-semibold text-white">
            <span>{clock(c.time)}</span>
            <span className="absolute left-1/2 top-1.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
            <span className="flex items-center gap-1" aria-hidden><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3.5 w-3.5" /></span>
          </div>

          {/* WhatsApp header */}
          <div className="flex flex-none items-center gap-2.5 bg-[#075E54] px-3 pb-2.5 pt-1 text-white">
            <ArrowLeft className="h-4 w-4 flex-none" aria-hidden />
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#25D366] font-display text-xs font-bold text-[#075E54]" aria-hidden>{c.initials}</span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13px] font-semibold">{c.store}</span>
              <span className="block text-[11px] text-white/80">{typing ? 'typing…' : 'online'}</span>
            </span>
            <Video className="h-4 w-4 flex-none" aria-hidden />
            <Phone className="h-4 w-4 flex-none" aria-hidden />
          </div>

          {/* chat */}
          <ol ref={listRef} className={`chat-wallpaper flex flex-1 flex-col gap-1.5 overflow-hidden px-2.5 py-3 text-[12.5px] leading-snug text-[#111B21] transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
            <li className="mt-auto" aria-hidden />
            <li className="mb-1 self-center rounded-md bg-white/80 px-2 py-0.5 text-[10.5px] text-slate-600 shadow-sm">Today</li>
            {visible.map((l, i) => (
              <li key={`${conv}-${i}`} className={`${animate ? 'chat-pop' : ''} max-w-[84%] flex-none rounded-lg px-2.5 py-1.5 shadow-sm ${l.from === 'customer' ? 'self-end rounded-tr-none bg-[#D9FDD3]' : 'self-start rounded-tl-none bg-white'}`}>
                <span className="sr-only">{l.from === 'customer' ? 'Customer: ' : 'Sarabot: '}</span>
                {l.text}
                <span className="float-right ml-2 mt-1.5 inline-flex items-center gap-0.5 text-[9.5px] text-slate-500">
                  {fmtTime(c.time, Math.floor(i / 2))}{l.from === 'customer' && <CheckCheck className="h-3 w-3 text-sky-500" aria-hidden />}
                </span>
              </li>
            ))}
            {typing && (
              <li className="chat-pop flex w-fit flex-none items-center gap-1 self-start rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                <span className="sr-only">Sarabot is typing</span>
                <span className="typing-dot" /><span className="typing-dot" style={{ animationDelay: '0.15s' }} /><span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </li>
            )}
          </ol>

          {/* input bar */}
          <div className="flex flex-none items-center gap-1.5 bg-[#EFEAE2] px-2 pb-4 pt-1.5" aria-hidden>
            <span className="flex h-9 flex-1 items-center gap-2 rounded-full bg-white px-3 text-[12px] text-slate-400 shadow-sm">
              <Smile className="h-4 w-4" /> Message <Paperclip className="ml-auto h-4 w-4" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#00A884] text-white shadow-sm"><Mic className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
    </figure>
  );
}
