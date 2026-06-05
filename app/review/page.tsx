import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import ReviewClient from '@/components/ReviewClient';
import { AppHeader, Footer } from '@/components/Layout';
import type { Contract } from '@/types';

type ReviewPageProps = {
  searchParams: { id?: string };
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { id } = searchParams;
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
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-10">
        <Suspense fallback={<div className="text-[13px] text-muted">Loading…</div>}>
          <ReviewClient existingContract={existingContract} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
