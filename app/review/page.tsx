import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getAppUser } from '@/lib/app-user';
import ReviewClient from '@/components/ReviewClient';
import AppShell from '@/components/AppShell';
import type { Contract } from '@/types';

type ReviewPageProps = {
  searchParams: { id?: string };
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { id } = searchParams;
  const appUser = await getAppUser();
  let existingContract: Contract | null = null;

  if (id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      existingContract = data as Contract;
    }
  }

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      creditBalance={appUser!.creditBalance}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="contracts"
    >
      <main className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10">
        <Suspense fallback={<div className="text-[13px] text-muted">Loading…</div>}>
          <ReviewClient
            existingContract={existingContract}
            hasNegotiationAccess={appUser!.hasNegotiationAccess}
            canReview={appUser!.canReview}
          />
        </Suspense>
      </main>
    </AppShell>
  );
}
