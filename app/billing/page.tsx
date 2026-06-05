import { getAppUser } from '@/lib/app-user';
import AppShell from '@/components/AppShell';
import BillingView from '@/components/BillingView';

type BillingPageProps = {
  searchParams: { success?: string; canceled?: string };
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const appUser = await getAppUser();

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="billing"
    >
      {searchParams.success === '1' && (
        <div className="mx-6 mt-6 rounded-xl bg-[#EAF3DE] p-4 text-[15px] text-[#3B6D11] sm:mx-8 lg:mx-10">
          Payment received. Your plan will update shortly.
        </div>
      )}
      {searchParams.canceled === '1' && (
        <div className="mx-6 mt-6 rounded-xl bg-[#FAEEDA] p-4 text-[15px] text-[#854F0B] sm:mx-8 lg:mx-10">
          Checkout canceled. No charge was made.
        </div>
      )}
      <BillingView currentPlan={appUser!.plan} />
    </AppShell>
  );
}
