'use client';

import { useTransition } from 'react';
import { signOut } from '@/app/login/actions';

export default function DashboardSignOut() {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
