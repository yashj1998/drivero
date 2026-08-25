import { type ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Variant = 'dark' | 'light';

interface PillButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  icon?: typeof ArrowRight;
}

export function PillButton({
  children,
  variant = 'dark',
  icon: Icon = ArrowRight,
  className = '',
  ...rest
}: PillButtonProps) {
  const base =
    variant === 'dark'
      ? 'bg-[var(--dark)] text-white btn-pill-dark'
      : 'bg-white text-[var(--dark)] btn-pill-light';

  return (
    <button
      className={`btn-pill inline-flex items-center gap-2 text-sm font-medium pl-6 pr-2 py-2.5 rounded-full ${base} ${className}`}
      {...rest}
    >
      {children}
      <span className="btn-icon-chip w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </span>
    </button>
  );
}

interface PillLinkProps extends Omit<ComponentProps<typeof Link>, 'ref'> {
  variant?: Variant;
  icon?: typeof ArrowRight;
}

export function PillLink({
  children,
  variant = 'dark',
  icon: Icon = ArrowRight,
  className = '',
  ...rest
}: PillLinkProps) {
  const base =
    variant === 'dark'
      ? 'bg-[var(--dark)] text-white btn-pill-dark'
      : 'bg-white text-[var(--dark)] btn-pill-light';

  return (
    <Link
      className={`btn-pill inline-flex items-center gap-2 text-sm font-medium pl-6 pr-2 py-2.5 rounded-full ${base} ${className}`}
      {...rest}
    >
      {children}
      <span className="btn-icon-chip w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </span>
    </Link>
  );
}
