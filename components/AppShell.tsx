'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import AppNavSignOut from '@/components/AppNavSignOut';
import { planDescription, planLabel, type UserPlan } from '@/lib/plan';

export type AppNavId =
  | 'dashboard'
  | 'contracts'
  | 'negotiation'
  | 'billing'
  | 'account';

type AppShellProps = {
  children: React.ReactNode;
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
  plan: UserPlan;
  creditBalance: number;
  hasNegotiationAccess: boolean;
  activeNav: AppNavId;
};

const navItems: { id: AppNavId; label: string; href: string; locked?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'contracts', label: 'Contracts', href: '/contracts' },
  { id: 'negotiation', label: 'Negotiation emails', href: '/negotiation', locked: true },
  { id: 'billing', label: 'Billing', href: '/billing' },
  { id: 'account', label: 'Account', href: '/profile' },
];

function NavIcon({ id }: { id: AppNavId }) {
  const className = 'h-5 w-5 shrink-0';
  switch (id) {
    case 'dashboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case 'contracts':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'negotiation':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case 'billing':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case 'account':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
  }
}

export default function AppShell({
  children,
  user,
  plan,
  creditBalance,
  hasNegotiationAccess,
  activeNav,
}: AppShellProps) {
  const initials = user.fullName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-white">
        <div className="border-b border-border px-5 py-5">
          <Logo href="/dashboard" size="nav" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isLocked = item.locked && !hasNegotiationAccess;
            const isActive = activeNav === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EAF3DE] text-brand'
                    : 'text-muted hover:bg-canvas hover:text-gray-900'
                }`}
              >
                <NavIcon id={item.id} />
                <span className="flex-1">{item.label}</span>
                {isLocked && (
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-border p-4">
          <div className="rounded-xl border border-brand/30 bg-[#EAF3DE]/40 p-4">
            <p className="text-[14px] font-semibold text-gray-900">{planLabel(plan)}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {plan === 'pro'
                ? planDescription(plan)
                : plan === 'credits'
                  ? `${creditBalance} review${creditBalance === 1 ? '' : 's'} left`
                  : planDescription(plan)}
            </p>
            {plan === 'free' && (
              <Link
                href="/billing"
                className="mt-3 inline-block text-[13px] font-medium text-brand hover:underline"
              >
                Buy reviews →
              </Link>
            )}
          </div>

          <Link
            href="/profile"
            className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
              activeNav === 'account'
                ? 'border-brand/40 bg-[#EAF3DE]/40'
                : 'border-border bg-white hover:border-gray-300 hover:bg-canvas'
            }`}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-[13px] font-semibold text-brand">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-gray-900">{user.fullName}</p>
              <p className="truncate text-[12px] text-muted">{user.email}</p>
            </div>
          </Link>
          <AppNavSignOut />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
