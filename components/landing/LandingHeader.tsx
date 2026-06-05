import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { ButtonPrimary, ButtonText } from '@/components/ui/Button';

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Examples', href: '#examples' },
];

type LandingHeaderProps = {
  isLoggedIn?: boolean;
};

export default function LandingHeader({ isLoggedIn = false }: LandingHeaderProps) {
  return (
    <header className="nav-bar sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 sm:px-10 lg:px-12">
        <div className="justify-self-start">
          <Logo href="/" size="nav" />
        </div>

        <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[16px] font-medium text-muted hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center justify-end gap-5 justify-self-end sm:gap-6">
          {isLoggedIn ? (
            <ButtonPrimary href="/dashboard" className="px-6 py-3 text-[16px]">
              Go to dashboard
            </ButtonPrimary>
          ) : (
            <>
              <ButtonText href="/login" className="text-[17px]">
                Log in
              </ButtonText>
              <ButtonPrimary href="/login" className="px-6 py-3 text-[16px]">
                Get started free
              </ButtonPrimary>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
