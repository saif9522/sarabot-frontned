import { MessagesSquare } from 'lucide-react';

/** The Sarabot mark: a chat bubble on the brand green. */
export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-xl';
  return (
    <span className={`grid ${box} flex-none place-items-center bg-gradient-to-br from-brand-glow to-brand-dark shadow-sm`} aria-hidden>
      <MessagesSquare className={size === 'sm' ? 'h-4 w-4 text-white' : 'h-5 w-5 text-white'} />
    </span>
  );
}

/** Mark + word. `light` for use on dark or coloured backgrounds. */
export default function Brand({ light = false, size = 'md' }: { light?: boolean; size?: 'sm' | 'md' }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={size} />
      <span className={`font-display font-bold tracking-tight ${size === 'sm' ? 'text-lg' : 'text-xl'} ${light ? 'text-white' : 'text-navy'}`}>Sarabot</span>
    </span>
  );
}
