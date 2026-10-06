'use client';
import { useEffect, useState } from 'react';

/**
 * Types a word, holds it, deletes it, then types the next one, forever.
 * Server render and reduced-motion users see the first word, fully typed.
 */
export default function Typewriter({ words, className = '' }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [phase, setPhase] = useState<'hold' | 'delete' | 'type'>('hold');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const word = words[index];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'hold') t = setTimeout(() => setPhase('delete'), 1900);
    else if (phase === 'delete') {
      if (text.length === 0) {
        setIndex((i) => (i + 1) % words.length);
        setPhase('type');
      } else t = setTimeout(() => setText((s) => s.slice(0, -1)), 35);
    } else {
      if (text === word) setPhase('hold');
      else t = setTimeout(() => setText(word.slice(0, text.length + 1)), 75);
    }
    return () => clearTimeout(t);
  }, [animate, phase, text, index, words]);

  return (
    <span className={className}>
      {text}
      <span className="typing-caret" aria-hidden />
    </span>
  );
}
