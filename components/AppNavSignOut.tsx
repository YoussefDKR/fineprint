'use client';

import { useTransition } from 'react';
import { signOut } from '@/app/login/actions';

export default function AppNavSignOut() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => { await signOut(); })}
      disabled={isPending}
      className="inline-flex w-full items-center justify-center rounded-xl border border-danger-border bg-white px-4 py-2.5 text-[15px] font-medium text-danger transition-colors hover:border-red-300 hover:bg-danger-muted hover:text-danger-hover disabled:opacity-50"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
