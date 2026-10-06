import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Brand from '../Brand';
import Container from './Container';
import { NAV } from './nav';
import { CONTACT } from './contact';
import { SOLUTIONS } from './solutions';

export default function SiteFooter() {
  return (
    <footer className="bg-[#07122A] text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.3fr]">
        <div>
          <Brand light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Automatic WhatsApp replies for shops and small businesses in India. Your number, your products, your language.
          </p>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-[#07122A] hover:bg-white">
            <MessageCircle className="h-4 w-4" aria-hidden /> Chat with us on WhatsApp
          </a>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Website</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-white hover:underline">{n.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Solutions">
          <p className="text-sm font-semibold">Solutions</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {SOLUTIONS.map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`} className="hover:text-white hover:underline">{s.name}</Link></li>)}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">Account</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/login" className="hover:text-white hover:underline">Log in</Link></li>
            <li><Link href="/signup" className="hover:text-white hover:underline">Create an account</Link></li>
            <li><Link href="/pricing" className="hover:text-white hover:underline">Plans and pricing</Link></li>
            <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white hover:underline">Terms of Service</Link></li>
            <li><Link href="/refund-policy" className="hover:text-white hover:underline">Refund Policy</Link></li>
          </ul>
        </div>
        <address className="not-italic">
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 hover:text-white"><Mail className="h-4 w-4 text-[#25D366]" aria-hidden />{CONTACT.email}</a></li>
            <li><a href={`tel:${CONTACT.tel}`} className="flex items-center gap-2.5 hover:text-white"><Phone className="h-4 w-4 text-[#25D366]" aria-hidden />{CONTACT.phone}</a></li>
            <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-[#25D366]" aria-hidden />{CONTACT.address}</li>
          </ul>
        </address>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-wrap justify-between gap-2 py-5 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Sarabot.in</p>
          <p>WhatsApp is a trademark of WhatsApp LLC. Sarabot is not made by or affiliated with WhatsApp or Meta.</p>
        </Container>
      </div>
    </footer>
  );
}
