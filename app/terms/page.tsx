import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/site/LegalPage';
import { CONTACT } from '@/components/site/contact';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Terms of Service', description: 'The terms for using Sarabot, the AI WhatsApp chatbot for businesses.', path: '/terms' });

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" path="/terms" updated="7 October 2026">
      <p>By creating an account or using Sarabot you agree to these terms. If you use Sarabot for a business, you confirm you are allowed to accept them for that business.</p>
      <h2>The service</h2>
      <p>Sarabot links to your WhatsApp number as a linked device and replies to messages automatically using the information you provide. Sarabot is not made by, endorsed by or affiliated with WhatsApp or Meta.</p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Use Sarabot only to reply to people who contact you. Do not use it for spam, bulk or unsolicited messages.</li>
        <li>Do not use it for anything illegal, harmful, misleading or that breaks WhatsApp’s terms.</li>
        <li>You are responsible for the information, prices and offers your bot shares.</li>
      </ul>
      <h2>WhatsApp account risk</h2>
      <p>This service uses WhatsApp’s linked-devices feature, not the official WhatsApp Business API. WhatsApp may limit or ban numbers it considers automated or abusive. We take steps to reduce this risk but cannot guarantee that WhatsApp will not take action on your number.</p>
      <h2>Plans and payment</h2>
      <p>Paid plans give a set number of automatic replies for a set period, as shown on the <Link href="/pricing">pricing page</Link>. Plans end automatically at the end of their period. See our <Link href="/refund-policy">Refund Policy</Link> for refunds.</p>
      <h2>AI replies</h2>
      <p>Automatic replies are generated from your information and may occasionally be wrong. Check your chats regularly and correct your business information when needed.</p>
      <h2>Availability</h2>
      <p>We work to keep Sarabot running at all times but do not guarantee uninterrupted service. We may update features from time to time.</p>
      <h2>Suspension</h2>
      <p>We may suspend accounts that break these terms or put other users or the service at risk.</p>
      <h2>Liability</h2>
      <p>To the extent allowed by law, our total liability for any claim is limited to the amount you paid us in the three months before the claim.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, with courts in New Delhi having jurisdiction.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, {CONTACT.phone}, {CONTACT.address}.</p>
    </LegalPage>
  );
}
