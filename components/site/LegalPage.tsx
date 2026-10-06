import { ReactNode } from 'react';
import SiteShell from './SiteShell';
import PageIntro from './PageIntro';
import Container from './Container';
import JsonLd from './JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

/** Shared layout for Privacy, Terms and Refund pages. */
export default function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <SiteShell>
      <JsonLd data={breadcrumbSchema([{ name: title, path }])} />
      <PageIntro title={title}>Last updated: {updated}</PageIntro>
      <section className="bg-white">
        <Container className="py-14 md:py-20">
          <div className="legal max-w-3xl">{children}</div>
        </Container>
      </section>
    </SiteShell>
  );
}
