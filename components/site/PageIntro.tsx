import { ReactNode } from 'react';

/** Title band at the top of website pages. */
export default function PageIntro({ title, children, width = 'max-w-4xl' }: { title: string; children?: ReactNode; width?: 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' }) {
  return (
    <section className="bg-gradient-to-b from-brand-tint/70 to-white">
      <div className={`mx-auto ${width} px-5 pb-10 pt-14 md:pt-20`}>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink">{children}</div>}
      </div>
    </section>
  );
}
