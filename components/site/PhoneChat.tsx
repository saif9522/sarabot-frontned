import { ArrowLeft, BatteryFull, CheckCheck, Mic, Paperclip, Phone, Signal, Smile, Video, Wifi } from 'lucide-react';

type Line = { from: 'customer' | 'bot'; text: string; time: string };

/** A late-night conversation at a grocery store: the moment Sarabot is made for. */
const LINES: Line[] = [
  { from: 'customer', text: 'Hi, what is the price of 5 kg wheat flour?', time: '10:42 pm' },
  { from: 'bot', text: 'Whole Wheat Flour 5 kg is ₹265 and in stock. Reply "order" to place an order.', time: '10:42 pm' },
  { from: 'customer', text: 'Do you deliver at home?', time: '10:43 pm' },
  { from: 'bot', text: 'Yes, free delivery within 3 km. We can deliver tomorrow by 10 am.', time: '10:43 pm' },
  { from: 'customer', text: 'order', time: '10:44 pm' },
  { from: 'bot', text: 'Great! Please share your name and address and we will confirm your order.', time: '10:44 pm' },
];

/** A phone (not a tablet): tall 9:19.5 body, side buttons, island, status bar and WhatsApp chrome. */
export default function PhoneChat() {
  return (
    <figure className="relative mx-auto w-[300px] sm:w-[320px]" aria-label="Example: a customer asks a shop on WhatsApp at night and Sarabot replies">
      {/* side buttons */}
      <span className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-slate-700" aria-hidden />
      <span className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-slate-700" aria-hidden />
      <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-slate-700" aria-hidden />

      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[3rem] border-[11px] border-[#111827] bg-[#111827] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <div className="flex h-full flex-col overflow-hidden rounded-[2.2rem] bg-[#EFEAE2]">
          {/* status bar + island */}
          <div className="relative flex h-9 flex-none items-center justify-between bg-[#075E54] px-6 text-[11px] font-semibold text-white">
            <span>10:42</span>
            <span className="absolute left-1/2 top-1.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
            <span className="flex items-center gap-1" aria-hidden><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3.5 w-3.5" /></span>
          </div>

          {/* WhatsApp header */}
          <div className="flex flex-none items-center gap-2.5 bg-[#075E54] px-3 pb-2.5 pt-1 text-white">
            <ArrowLeft className="h-4 w-4 flex-none" aria-hidden />
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#25D366] font-display text-xs font-bold text-[#075E54]" aria-hidden>SK</span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13px] font-semibold">Sharma Grocery Store</span>
              <span className="block text-[11px] text-white/80">online</span>
            </span>
            <Video className="h-4 w-4 flex-none" aria-hidden />
            <Phone className="h-4 w-4 flex-none" aria-hidden />
          </div>

          {/* chat */}
          <ol className="chat-wallpaper flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 py-3 text-[12.5px] leading-snug text-[#111B21]">
            <li className="mb-1 self-center rounded-md bg-white/80 px-2 py-0.5 text-[10.5px] text-slate-600 shadow-sm">Today</li>
            {LINES.map((l, i) => (
              <li key={i} className={`chat-in max-w-[84%] rounded-lg px-2.5 py-1.5 shadow-sm ${l.from === 'customer' ? 'self-end rounded-tr-none bg-[#D9FDD3]' : 'self-start rounded-tl-none bg-white'}`}
                style={{ animationDelay: `${0.4 + i * 0.85}s` }}>
                <span className="sr-only">{l.from === 'customer' ? 'Customer: ' : 'Sarabot: '}</span>
                {l.text}
                <span className="float-right ml-2 mt-1.5 inline-flex items-center gap-0.5 text-[9.5px] text-slate-500">
                  {l.time}{l.from === 'customer' && <CheckCheck className="h-3 w-3 text-sky-500" aria-hidden />}
                </span>
              </li>
            ))}
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
