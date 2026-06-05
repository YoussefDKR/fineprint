import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAppUser } from '@/lib/app-user';
import AppShell from '@/components/AppShell';
import NegotiationUpsell from '@/components/NegotiationUpsell';
import { ButtonGhost, ButtonPrimary } from '@/components/ui/Button';
import { contractDisplayName, formatDashboardDate } from '@/lib/dashboard-stats';
import type { Contract } from '@/types';

export default async function NegotiationPage() {
  const appUser = await getAppUser();
  const supabase = await createClient();

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  const withEmail = ((contracts as Contract[]) ?? []).filter(
    (c) => c.status === 'analyzed' && c.negotiation_email,
  );

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      creditBalance={appUser!.creditBalance}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="negotiation"
    >
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
              Negotiation emails
            </h1>
            <p className="mt-1.5 text-[16px] text-muted">
              AI-drafted emails you can send to clients when a contract needs changes.
            </p>
          </div>
          {appUser!.hasNegotiationAccess && (
            <ButtonPrimary href="/review" className="shrink-0 px-6 py-3 text-[15px]">
              + Review new contract
            </ButtonPrimary>
          )}
        </div>

        {!appUser!.hasNegotiationAccess ? (
          <NegotiationUpsell />
        ) : withEmail.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="mb-2 text-[18px] font-semibold text-gray-900">No emails yet</p>
            <p className="mb-6 text-[15px] text-muted">
              Review a contract to generate your first negotiation email.
            </p>
            <ButtonPrimary href="/review">Review a contract</ButtonPrimary>
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {withEmail.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="text-[16px] font-medium text-gray-900">
                    {contractDisplayName(contract.file_name)}
                  </p>
                  <p className="mt-1 text-[14px] text-muted">
                    Generated {formatDashboardDate(contract.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-[#3B6D11]">
                    Ready
                  </span>
                  <ButtonGhost href={`/review?id=${contract.id}`} className="px-4 py-2 text-[13px]">
                    View email
                  </ButtonGhost>
                </div>
              </div>
            ))}
          </div>
        )}

        {appUser!.hasNegotiationAccess && (
          <p className="mt-6 text-[14px] text-muted">
            Open any contract to read and copy the full email.{' '}
            <Link href="/contracts" className="font-medium text-brand hover:underline">
              View all contracts →
            </Link>
          </p>
        )}
      </div>
    </AppShell>
  );
}
