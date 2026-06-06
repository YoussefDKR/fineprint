import Link from 'next/link';

type LogoProps = {
  href?: string;
  className?: string;
};

export default function Logo({ href = '/', className = '', size = 'default' }: LogoProps & { size?: 'default' | 'nav' }) {
  const sizeClasses =
    size === 'nav'
      ? 'gap-3 text-[20px] font-semibold'
      : 'gap-2 text-[16px] font-medium';
  const dotClasses = size === 'nav' ? 'h-3 w-3' : 'h-2 w-2';

  const content = (
    <span className={`inline-flex items-center text-gray-900 ${sizeClasses} ${className}`}>
      <span className={`rounded-full bg-brand ${dotClasses}`} />
      YourFineprint
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function LogoLarge({ href = '/' }: { href?: string }) {
  return <Logo href={href} className="text-base" />;
}
