import type { User } from '@supabase/supabase-js';

export type UserPlan = 'free' | 'credits' | 'pro';

export function getUserPlan(user: User): UserPlan {
  const plan = user.user_metadata?.plan as string | undefined;
  if (plan === 'pro' || plan === 'credits') return plan;
  return 'free';
}

export function hasNegotiationAccess(plan: UserPlan): boolean {
  return plan === 'pro' || plan === 'credits';
}

export function planLabel(plan: UserPlan): string {
  if (plan === 'pro') return 'Pro plan';
  if (plan === 'credits') return 'Credits';
  return 'Free plan';
}

export function planDescription(plan: UserPlan): string {
  if (plan === 'pro') return 'Unlimited reviews';
  if (plan === 'credits') return '3 contract reviews';
  return '1 contract review';
}
