import { createClient } from '@/lib/supabase/server';
import { getAppUser } from '@/lib/app-user';
import AppShell from '@/components/AppShell';
import DashboardView from '@/components/DashboardView';
import type { Contract } from '@/types';

export default async function DashboardPage() {
  const appUser = await getAppUser();
  const supabase = await createClient();

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      creditBalance={appUser!.creditBalance}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="dashboard"
    >
      <DashboardView
        userName={appUser!.fullName}
        hasNegotiationAccess={appUser!.hasNegotiationAccess}
        contracts={(contracts as Contract[]) ?? []}
      />
    </AppShell>
  );
}
