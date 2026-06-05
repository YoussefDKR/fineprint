import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  canReview,
  hasNegotiationAccess,
  resolveUserPlan,
  type BillingPlan,
  type UserPlan,
} from '@/lib/plan';

export type UserBilling = {
  userId: string;
  billingPlan: BillingPlan;
  creditBalance: number;
  userPlan: UserPlan;
  canReview: boolean;
  hasNegotiationAccess: boolean;
};

type ProfileRow = {
  credit_balance: number;
  plan: BillingPlan;
};

export async function ensureProfile(userId: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from('profiles').upsert({ id: userId }, { onConflict: 'id' });
}

export async function getUserBilling(userId: string): Promise<UserBilling> {
  const admin = createAdminClient();
  await ensureProfile(userId);

  const { data, error } = await admin
    .from('profiles')
    .select('credit_balance, plan')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error('Could not load billing profile');
  }

  const profile = data as ProfileRow;
  const billingPlan = profile.plan === 'pro' ? 'pro' : 'free';
  const creditBalance = profile.credit_balance ?? 0;
  const userPlan = resolveUserPlan(billingPlan, creditBalance);

  return {
    userId,
    billingPlan,
    creditBalance,
    userPlan,
    canReview: canReview(billingPlan, creditBalance),
    hasNegotiationAccess: hasNegotiationAccess(userPlan),
  };
}

export async function getUserBillingForSession(userId: string): Promise<UserBilling> {
  const supabase = await createClient();
  await ensureProfile(userId);

  const { data, error } = await supabase
    .from('profiles')
    .select('credit_balance, plan')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return getUserBilling(userId);
  }

  const profile = data as ProfileRow;
  const billingPlan = profile.plan === 'pro' ? 'pro' : 'free';
  const creditBalance = profile.credit_balance ?? 0;
  const userPlan = resolveUserPlan(billingPlan, creditBalance);

  return {
    userId,
    billingPlan,
    creditBalance,
    userPlan,
    canReview: canReview(billingPlan, creditBalance),
    hasNegotiationAccess: hasNegotiationAccess(userPlan),
  };
}

export async function consumeReviewCredit(
  userId: string,
  contractId: string,
): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc('consume_review_credit', {
    p_user_id: userId,
    p_contract_id: contractId,
  });

  if (error) {
    console.error('consume_review_credit error:', error);
    return false;
  }

  return data === true;
}

export async function addReviewCredits(userId: string, amount: number): Promise<number> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc('add_review_credits', {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    throw error;
  }

  return data as number;
}

export async function setUserProPlan(userId: string, isPro: boolean): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc('set_user_pro_plan', {
    p_user_id: userId,
    p_is_pro: isPro,
  });

  if (error) {
    throw error;
  }
}

export const NO_CREDITS_ERROR =
  'No review credits left. Buy a review for €3 or a 3-pack for €9 on the billing page.';
