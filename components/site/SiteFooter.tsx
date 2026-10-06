import Link from 'next/link';
import Brand from '../Brand';
import { NAV } from './nav';

export default function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Automatic WhatsApp replies for shops and small businesses in India. Your number, your products, your language.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold text-white">Website</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-white hover:underline">{n.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold text-white">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li><Link href="/login" className="hover:text-white hover:underline">Log in</Link></li>
            <li><Link href="/signup" className="hover:text-white hover:underline">Create an account</Link></li>
            <li><a href="mailto:designersaifali@gmail.com" className="hover:text-white hover:underline">designersaifali@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/60">© {new Date().getFullYear()} Sarabot.in. WhatsApp is a trademark of WhatsApp LLC. Sarabot is not made by or affiliated with WhatsApp or Meta.</p>
      </div>
    </footer>
  );
}
