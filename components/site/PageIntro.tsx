import { ReactNode } from 'react';
import Container from './Container';

/** Dark title band at the top of website pages, matching the home hero. */
export default function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="hero-bg relative overflow-hidden text-white">
      <Container className="relative py-16 md:py-24">
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{children}</div>}
      </Container>
    </section>
  );
}
