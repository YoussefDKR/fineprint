import { createClient } from '@/lib/supabase/server';
import { getAppUser } from '@/lib/app-user';
import AppShell from '@/components/AppShell';
import ContractsTable from '@/components/ContractsTable';
import { ButtonPrimary } from '@/components/ui/Button';
import type { Contract } from '@/types';

export default async function ContractsPage() {
  const appUser = await getAppUser();
  const supabase = await createClient();

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  const list = (contracts as Contract[]) ?? [];
  const analyzed = list.filter((c) => c.status === 'analyzed');

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      creditBalance={appUser!.creditBalance}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="contracts"
    >
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
              Contracts
            </h1>
            <p className="mt-1.5 text-[16px] text-muted">
              All contracts you&apos;ve reviewed, newest first.
            </p>
          </div>
          <ButtonPrimary href="/review" className="shrink-0 px-6 py-3 text-[15px]">
            + Review new contract
          </ButtonPrimary>
        </div>

        <div className="card overflow-hidden">
          {analyzed.length === 0 ? (
            <div className="p-12 text-center">
              <p className="mb-2 text-[18px] font-semibold text-gray-900">No contracts yet</p>
              <p className="mb-6 text-[15px] text-muted">
                Upload a client PDF to get your first analysis.
              </p>
              <ButtonPrimary href="/review">Review your first contract</ButtonPrimary>
            </div>
          ) : (
            <ContractsTable contracts={list} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
