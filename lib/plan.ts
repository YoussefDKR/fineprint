import type { User } from '@supabase/supabase-js';

export type BillingPlan = 'free' | 'pro';
export type UserPlan = 'free' | 'credits' | 'pro';

/** @deprecated use resolveUserPlan with profile data */
export function getUserPlan(user: User): UserPlan {
  const plan = user.user_metadata?.plan as string | undefined;
  if (plan === 'pro') return 'pro';
  if (plan === 'credits') return 'credits';
  return 'free';
}

export function resolveUserPlan(billingPlan: BillingPlan, creditBalance: number): UserPlan {
  if (billingPlan === 'pro') return 'pro';
  if (creditBalance > 0) return 'credits';
  return 'free';
}

export function canReview(billingPlan: BillingPlan, creditBalance: number): boolean {
  return billingPlan === 'pro' || creditBalance > 0;
}

export function hasNegotiationAccess(userPlan: UserPlan): boolean {
  return userPlan === 'pro' || userPlan === 'credits';
}

export function planLabel(plan: UserPlan): string {
  if (plan === 'pro') return 'Pro';
  if (plan === 'credits') return 'Credits';
  return 'Pay as you go';
}

export function planDescription(plan: UserPlan, creditBalance?: number): string {
  if (plan === 'pro') return 'Unlimited contracts · Priority analysis';
  if (plan === 'credits') {
    const n = creditBalance ?? 0;
    return `${n} review${n === 1 ? '' : 's'} remaining · Credits never expire`;
  }
  return '€3 per contract · No subscription';
}

export function planBillingDetail(plan: UserPlan, creditBalance?: number): string {
  if (plan === 'pro') return '€19 / month · Unlimited reviews';
  if (plan === 'credits') {
    return `${creditBalance ?? 0} credit${creditBalance === 1 ? '' : 's'} · Buy more anytime`;
  }
  return 'Buy a review for €3, or a 3-pack for €9';
}
