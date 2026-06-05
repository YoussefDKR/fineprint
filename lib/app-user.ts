import { createClient } from '@/lib/supabase/server';
import { getUserPlan, hasNegotiationAccess, type UserPlan } from '@/lib/plan';

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  plan: UserPlan;
  hasNegotiationAccess: boolean;
};

export async function getAppUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const plan = getUserPlan(user);

  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.display_name as string) ||
      user.email?.split('@')[0] ||
      'there',
    avatarUrl: (user.user_metadata?.avatar_url as string) || null,
    plan,
    hasNegotiationAccess: hasNegotiationAccess(plan),
  };
}
