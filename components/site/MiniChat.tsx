/** A compact WhatsApp-style conversation used on solution pages. */
export default function MiniChat({ lines, title }: { lines: { from: 'customer' | 'bot'; text: string }[]; title: string }) {
  return (
    <figure className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5" aria-label={`Example conversation: ${title}`}>
      <div className="flex items-center gap-3 bg-[#075E54] px-5 py-3.5 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-sm font-bold text-[#075E54]" aria-hidden>S</span>
        <span className="leading-tight"><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-white/80">replies instantly</span></span>
      </div>
      <ol className="chat-wallpaper flex flex-col gap-2 px-4 py-5 text-sm leading-snug text-[#111B21]">
        {lines.map((l, i) => (
          <li key={i} className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${l.from === 'customer' ? 'self-end rounded-tr-none bg-[#D9FDD3]' : 'self-start rounded-tl-none bg-white'}`}>
            <span className="sr-only">{l.from === 'customer' ? 'Customer: ' : 'Sarabot: '}</span>{l.text}
          </li>
        ))}
      </ol>
    </figure>
  );
}
