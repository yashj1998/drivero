import { type ReactNode, type ElementType } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'scale';
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: ElementType;
}

const delayClass: Record<number, string> = {
  0: '',
  1: 'reveal-delay-1',
  2: 'reveal-delay-2',
  3: 'reveal-delay-3',
  4: 'reveal-delay-4',
};

export function Reveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const base = variant === 'scale' ? 'reveal-scale' : 'reveal';
  const shown = visible ? 'is-visible' : '';

  return (
    <Tag
      ref={ref}
      className={`${base} ${delayClass[delay]} ${shown} ${className}`}
    >
      {children}
    </Tag>
  );
}
