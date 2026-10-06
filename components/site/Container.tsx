import { ReactNode } from 'react';

/** Wide page container: uses the full screen up to 1440px, with comfortable side padding. */
export default function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
