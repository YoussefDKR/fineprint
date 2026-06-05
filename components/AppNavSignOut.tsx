'use client';

import { useTransition } from 'react';
import { signOut } from '@/app/login/actions';

export default function AppNavSignOut() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await signOut(); })}
      disabled={isPending}
      className="text-[16px] font-medium text-muted hover:text-gray-900 disabled:opacity-50"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
