import type { ReactNode } from 'react';
import Link from 'next/link';

const base =
  'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-[15px] font-medium transition-colors';

export function ButtonPrimary({
  children,
  href,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const classes = `${base} bg-brand text-white hover:bg-brand-hover disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function ButtonGhost({
  children,
  href,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const classes = `${base} border border-border bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900 disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function ButtonText({
  children,
  href,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const classes = `text-[15px] font-medium text-muted hover:text-gray-900 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
