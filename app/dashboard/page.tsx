import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ContractHistory from '@/components/ContractHistory';
import { AppHeader, Footer } from '@/components/Layout';
import DashboardSignOut from '@/components/DashboardSignOut';
import type { Contract } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">
              {user?.email ? `Signed in as ${user.email}` : 'Your contracts'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DashboardSignOut />
            <Link
              href="/review"
              className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
            >
              Review new contract
            </Link>
          </div>
        </div>

        <ContractHistory contracts={(contracts as Contract[]) ?? []} />
      </main>
      <Footer />
    </div>
  );
}
