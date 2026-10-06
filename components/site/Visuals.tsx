/** Small product illustrations for the website. Decorative: hidden from screen readers. */

/** A QR-code-like pattern (decorative, not scannable): three finder squares and a fixed pseudo-random fill. */
const N = 21;
function qrCell(x: number, y: number) {
  const finder = (fx: number, fy: number) => {
    const dx = x - fx, dy = y - fy;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
    const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6;
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return edge || core;
  };
  for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
    const f = finder(fx, fy);
    if (f !== null) return f;
  }
  if ((x === 7 || y === 7) && (x < 8 || y < 8)) return false; // quiet ring around finders
  if (x === N - 8 && y < 8) return false;
  if (y === N - 8 && x < 8) return false;
  return ((x * 7 + y * 13 + x * y * 3) % 5) < 2;
}
export function QrArt() {
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (qrCell(x, y)) cells.push([x, y]);
  return (
    <div className="w-[250px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5" aria-hidden>
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" /><span className="h-2 w-2 rounded-full bg-[#FEBC2E]" /><span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[10px] font-semibold text-slate-500">Sarabot · WhatsApp numbers</span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-[88px] w-[88px] flex-none rounded-md ring-1 ring-slate-200" shapeRendering="crispEdges">
          <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
          {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0B1B3A" />)}
        </svg>
        <div className="space-y-1.5 text-[10px] leading-tight text-slate-600">
          <p className="text-[11px] font-semibold text-[#0B1B3A]">Scan to link</p>
          <p>1. Open WhatsApp</p>
          <p>2. Linked devices</p>
          <p>3. Link a device</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[10px]">
        <span className="text-slate-500">+91 98XXX XXX10</span>
        <span className="rounded-full bg-[#E8F6F1] px-2 py-0.5 font-semibold text-[#0B7A5C]">● Connected</span>
      </div>
    </div>
  );
}

/** A mini business-info form. */
export function FormArt() {
  const rows = [['Shop name', 'Sharma Grocery Store'], ['Address', 'Station Road, New Delhi'], ['Delivery', 'Free up to 3 km, same day']];
  return (
    <div className="w-[250px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5" aria-hidden>
      <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold text-[#0B1B3A]">Business info</div>
      <div className="space-y-2 p-3 text-[10.5px]">
        {rows.map(([k, v]) => (
          <div key={k}>
            <p className="font-semibold text-slate-500">{k}</p>
            <p className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[#0B1B3A]">{v}</p>
          </div>
        ))}
        <div className="flex justify-end pt-1"><span className="rounded-md bg-[#0B7A5C] px-3 py-1 text-[10.5px] font-semibold text-white">Save</span></div>
      </div>
    </div>
  );
}

/** A short chat answered by the bot. */
export function ReplyArt() {
  return (
    <div className="w-[250px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5" aria-hidden>
      <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2 text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-[9px] font-bold text-[#075E54]">SG</span>
        <span className="text-[11px] font-semibold">Sharma Grocery Store</span>
      </div>
      <div className="chat-wallpaper flex flex-col gap-1.5 p-3 text-[11px] leading-snug text-[#111B21]">
        <p className="self-end rounded-lg rounded-tr-none bg-[#D9FDD3] px-2.5 py-1.5">Are you open tomorrow?</p>
        <p className="self-start rounded-lg rounded-tl-none bg-white px-2.5 py-1.5">Yes, we are open from 9 am to 9 pm.</p>
        <p className="self-end rounded-lg rounded-tr-none bg-[#D9FDD3] px-2.5 py-1.5">Great, thanks!</p>
        <p className="mt-0.5 self-start rounded-full bg-[#0B7A5C] px-2 py-0.5 text-[9.5px] font-semibold text-white">Replied by Sarabot in 3 sec</p>
      </div>
    </div>
  );
}

/** A slice of the Chat history screen. */
export function InboxArt() {
  const rows = [
    { name: 'Ramesh Kumar', msg: 'Please add 2 more packets to my order', tag: 'Bot replying', tone: 'bg-brand-tint text-brand-dark' },
    { name: 'Priya S.', msg: 'My order has not arrived yet', tag: 'Needs you', tone: 'bg-auto-tint text-auto' },
    { name: 'Anil Traders', msg: 'Is there a discount on bulk orders?', tag: 'You are replying', tone: 'bg-c-blue-tint text-c-blue' },
    { name: 'Neha', msg: 'Thank you!', tag: 'Bot replying', tone: 'bg-brand-tint text-brand-dark' },
  ];
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-line" aria-hidden>
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <p className="font-display font-semibold text-navy">Chat history</p>
        <span className="rounded-full bg-c-orange px-2 py-0.5 text-xs font-semibold text-white">1 needs you</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 px-5 py-3.5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-canvas font-display text-sm font-bold text-navy">{r.name[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-navy">{r.name}</span>
              <span className="block truncate text-xs text-muted">{r.msg}</span>
            </span>
            <span className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.tone}`}>{r.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
