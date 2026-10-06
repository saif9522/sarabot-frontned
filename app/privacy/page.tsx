import type { Metadata } from 'next';
import LegalPage from '@/components/site/LegalPage';
import { CONTACT } from '@/components/site/contact';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Privacy Policy', description: 'How Sarabot collects, uses and protects your data and your customers’ WhatsApp messages.', path: '/privacy' });

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="7 October 2026">
      <p>This policy explains what information Sarabot (“we”, “us”) collects when you use sarabot.in and the Sarabot dashboard, and how we use and protect it.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account details: your name, business name, email address, mobile number and password (stored only in encrypted, hashed form).</li>
        <li>Business content you add: business information, products, prices, bot flows, images and documents.</li>
        <li>WhatsApp data needed to run your bot: messages sent to and from your linked number, contact names and numbers of people who message you, and the session needed to stay linked.</li>
        <li>Payment records: plan, amount and payment status. Card and UPI details are handled by our payment partner Razorpay and are not stored by us.</li>
        <li>Basic technical data such as browser type and log records used to keep the service secure and working.</li>
      </ul>
      <h2>How we use information</h2>
      <ul>
        <li>To run your chatbot and show your chats, subscribers and usage in your dashboard.</li>
        <li>To generate automatic replies. Message text and your business information may be processed by our AI service provider only to create a reply.</li>
        <li>To send account emails such as sign-in codes and password resets.</li>
        <li>To process payments, prevent misuse and provide support.</li>
      </ul>
      <p>We do not sell your data or your customers’ data, and we do not use your customers’ numbers for our own marketing.</p>
      <h2>Your customers</h2>
      <p>You are responsible for using Sarabot lawfully with your customers. People who message your number can send STOP at any time to stop automatic replies.</p>
      <h2>Data retention and deletion</h2>
      <p>We keep your data while your account is active. You can ask us to delete your account and its data by writing to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
      <h2>Security</h2>
      <p>Each business can only access its own data. Passwords are hashed, secrets are encrypted and connections use HTTPS. No system is completely secure, but we work to protect your information.</p>
      <h2>Contact</h2>
      <p>Questions about privacy: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, {CONTACT.phone}, {CONTACT.address}.</p>
    </LegalPage>
  );
}
