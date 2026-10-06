import type { Metadata } from 'next';
import LegalPage from '@/components/site/LegalPage';
import { CONTACT } from '@/components/site/contact';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Refund and Cancellation Policy', description: 'Refund and cancellation rules for Sarabot plans.', path: '/refund-policy' });

export default function RefundPage() {
  return (
    <LegalPage title="Refund and Cancellation Policy" path="/refund-policy" updated="7 October 2026">
      <p>Every new account can try Sarabot with a free trial before paying, so you can check that it works for your business first.</p>
      <h2>Cancellation</h2>
      <p>Plans are prepaid for a fixed period and do not renew automatically. To cancel, simply don’t buy another plan. Your current plan keeps working until it ends.</p>
      <h2>Refunds</h2>
      <ul>
        <li>If you were charged but your plan did not start, write to us and we will start the plan or refund the full amount.</li>
        <li>If you were charged twice for the same order, the extra payment is refunded in full.</li>
        <li>You can ask for a refund within 7 days of payment if fewer than 10% of the plan’s automatic replies have been used.</li>
        <li>Otherwise, payments for a plan that has started are not refundable.</li>
      </ul>
      <h2>How refunds are paid</h2>
      <p>Approved refunds go back to the original payment method through Razorpay, usually within 5 to 7 working days.</p>
      <h2>Contact</h2>
      <p>For refunds, write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call {CONTACT.phone} with your registered email and payment ID.</p>
    </LegalPage>
  );
}
