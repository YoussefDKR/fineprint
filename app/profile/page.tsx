import { getAppUser } from '@/lib/app-user';
import AppShell from '@/components/AppShell';
import ProfileForm from '@/components/ProfileForm';
import type { UserProfile } from '@/lib/profile';

export default async function ProfilePage() {
  const appUser = await getAppUser();

  const profile: UserProfile = {
    id: appUser!.id,
    email: appUser!.email,
    fullName: appUser!.fullName,
    avatarUrl: appUser!.avatarUrl,
  };

  return (
    <AppShell
      user={appUser!}
      plan={appUser!.plan}
      creditBalance={appUser!.creditBalance}
      hasNegotiationAccess={appUser!.hasNegotiationAccess}
      activeNav="account"
    >
      <main className="mx-auto w-full max-w-2xl px-6 py-8 sm:px-10">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
            Account
          </h1>
          <p className="mt-1.5 text-[16px] text-muted">
            Manage your photo, name, email, and password
          </p>
        </div>
        <ProfileForm profile={profile} />
      </main>
    </AppShell>
  );
}
