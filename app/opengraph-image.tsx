import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sarabot – AI WhatsApp chatbot for business in India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** The picture shown when a Sarabot link is shared on WhatsApp, LinkedIn, Facebook or X. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #0B1B3A 0%, #0B1B3A 55%, #0B7A5C 100%)', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, fontWeight: 800, color: '#0B1B3A' }}>S</div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>Sarabot</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 950 }}>AI WhatsApp chatbot that replies to your customers 24/7</div>
          <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.8)' }}>For e-commerce, grocery stores, NGOs and small businesses in India</div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#25D366', fontWeight: 700 }}>sarabot.in · Free trial</div>
      </div>
    ),
    size,
  );
}
