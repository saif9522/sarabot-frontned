import { CheckCheck } from 'lucide-react';

type Line = { from: 'customer' | 'bot'; text: string; time: string };

/** A late-night conversation at a kirana store, the moment Sarabot is made for. */
const LINES: Line[] = [
  { from: 'customer', text: 'Bhaiya, chakki atta 5 kg ka rate kya hai?', time: '10:42 pm' },
  { from: 'bot', text: 'Chakki Atta 5 kg ₹265 ka hai, abhi stock mein hai. Order karna ho to "order" likh dijiye.', time: '10:42 pm' },
  { from: 'customer', text: 'Delivery hoti hai?', time: '10:43 pm' },
  { from: 'bot', text: 'Haan ji, 3 km tak free delivery. Kal subah 10 baje tak pahuncha denge.', time: '10:43 pm' },
  { from: 'customer', text: 'order', time: '10:44 pm' },
  { from: 'bot', text: 'Bahut badhiya! Apna naam aur address bhej dijiye, hum order confirm kar dete hain.', time: '10:44 pm' },
];

export default function ChatDemo() {
  return (
    <figure className="relative mx-auto w-full max-w-[380px]" aria-label="Example: a customer asks a shop on WhatsApp at night and Sarabot replies">
      <div className="overflow-hidden rounded-[2rem] border-[10px] border-navy bg-navy shadow-2xl">
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-display text-sm font-bold" aria-hidden>SK</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Sharma Kirana Store</span>
            <span className="block text-xs text-white/80">online</span>
          </span>
        </div>
        <ol className="chat-wallpaper flex min-h-[460px] flex-col gap-2 px-3 py-4 text-[13.5px] leading-snug">
          {LINES.map((l, i) => (
            <li key={i} className={`chat-in max-w-[82%] rounded-lg px-3 py-2 shadow-sm ${l.from === 'customer' ? 'self-end rounded-tr-none bg-[#D9FDD3]' : 'self-start rounded-tl-none bg-white'}`}
              style={{ animationDelay: `${0.35 + i * 0.9}s` }}>
              <span className="sr-only">{l.from === 'customer' ? 'Customer: ' : 'Sarabot: '}</span>
              {l.text}
              <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 float-right pl-2 pt-1 text-[10.5px] text-slate-500">
                {l.time}{l.from === 'customer' && <CheckCheck className="h-3.5 w-3.5 text-sky-500" aria-hidden />}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-4 text-center text-sm text-muted">10:42 pm. The shop is closed. Sarabot is not.</figcaption>
    </figure>
  );
}
