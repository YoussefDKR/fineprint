import { createClient } from '@/lib/supabase/server';
import ContractHistory from '@/components/ContractHistory';
import { AppHeader, Footer } from '@/components/Layout';
import { ButtonPrimary } from '@/components/ui/Button';
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

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    user?.email ||
    'Your contracts';

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1.5 text-[16px] text-muted">
              Signed in as {displayName}
            </p>
          </div>
          <ButtonPrimary href="/review" className="shrink-0 px-6 py-3 text-[16px]">
            Review new contract
          </ButtonPrimary>
        </div>

        <ContractHistory contracts={(contracts as Contract[]) ?? []} />
      </main>
      <Footer />
    </div>
  );
}
