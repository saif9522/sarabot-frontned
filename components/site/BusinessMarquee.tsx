import { Building2, Dumbbell, GraduationCap, HeartHandshake, Pill, Plane, Scissors, Shirt, ShoppingBag, ShoppingBasket, Smartphone, Stethoscope, Store, UtensilsCrossed, type LucideIcon } from 'lucide-react';

/** Each business type gets its own colour, so the strip reads as a lively, varied crowd. */
const ITEMS: { label: string; icon: LucideIcon; bg: string; fg: string }[] = [
  { label: 'E-commerce stores', icon: ShoppingBag, bg: '#E0F2FE', fg: '#0369A1' },
  { label: 'Grocery and daily-use products', icon: ShoppingBasket, bg: '#DCFCE7', fg: '#15803D' },
  { label: 'NGOs and non-profits', icon: HeartHandshake, bg: '#FCE7F3', fg: '#BE185D' },
  { label: 'Clinics and doctors', icon: Stethoscope, bg: '#E0E7FF', fg: '#4338CA' },
  { label: 'Coaching centres', icon: GraduationCap, bg: '#FEF3C7', fg: '#B45309' },
  { label: 'Salons and spas', icon: Scissors, bg: '#F3E8FF', fg: '#7E22CE' },
  { label: 'Restaurants and cafés', icon: UtensilsCrossed, bg: '#FFEDD5', fg: '#C2410C' },
  { label: 'Pharmacies', icon: Pill, bg: '#CCFBF1', fg: '#0F766E' },
  { label: 'Fashion boutiques', icon: Shirt, bg: '#FFE4E6', fg: '#BE123C' },
  { label: 'Mobile and electronics', icon: Smartphone, bg: '#DBEAFE', fg: '#1D4ED8' },
  { label: 'Real estate', icon: Building2, bg: '#ECFCCB', fg: '#4D7C0F' },
  { label: 'Gyms and fitness', icon: Dumbbell, bg: '#FAE8FF', fg: '#A21CAF' },
  { label: 'Travel agencies', icon: Plane, bg: '#CFFAFE', fg: '#0E7490' },
  { label: 'Local shops', icon: Store, bg: '#FEF9C3', fg: '#A16207' },
];

function Row({ copy }: { copy?: boolean }) {
  return (
    <ul className={`marquee-row flex flex-none gap-3 pr-3 ${copy ? 'marquee-copy' : ''}`} aria-hidden={copy || undefined}>
      {ITEMS.map(({ label, icon: Icon, bg, fg }) => (
        <li key={label} className="flex flex-none items-center gap-2.5 rounded-full py-2 pl-2 pr-5 text-[15px] font-semibold shadow-sm ring-1 ring-black/5" style={{ backgroundColor: bg, color: fg }}>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/80"><Icon className="h-4 w-4" aria-hidden /></span>
          {label}
        </li>
      ))}
    </ul>
  );
}

/** "Made for" strip: a colourful row that scrolls right to left, forever. Pauses on hover. */
export default function BusinessMarquee() {
  return (
    <section className="border-y border-line bg-white" aria-label="Businesses that use Sarabot">
      <div className="flex items-center gap-6 py-6">
        <p className="hidden flex-none pl-12 font-display text-lg font-bold text-navy md:block">Made for</p>
        <div className="marquee min-w-0 flex-1">
          <div className="marquee-track flex w-max">
            <Row />
            <Row copy />
          </div>
        </div>
      </div>
    </section>
  );
}
