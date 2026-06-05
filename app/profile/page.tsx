import { createClient } from '@/lib/supabase/server';
import { AppHeader, Footer } from '@/components/Layout';
import ProfileForm from '@/components/ProfileForm';
import type { UserProfile } from '@/lib/profile';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile: UserProfile = {
    id: user!.id,
    email: user!.email ?? '',
    fullName:
      (user!.user_metadata?.full_name as string) ||
      (user!.user_metadata?.display_name as string) ||
      '',
    avatarUrl: (user!.user_metadata?.avatar_url as string) || null,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:px-10">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
            Profile
          </h1>
          <p className="mt-1.5 text-[16px] text-muted">
            Manage your photo, name, email, and password
          </p>
        </div>
        <ProfileForm profile={profile} />
      </main>
      <Footer />
    </div>
  );
}
