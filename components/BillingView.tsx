'use client';

import { useState } from 'react';
import { ButtonPrimary } from '@/components/ui/Button';
import { PLANS, getPlanDefinition, type PlanId } from '@/lib/plans';
import { planLabel, type UserPlan } from '@/lib/plan';

type BillingViewProps = {
  currentPlan: UserPlan;
};

export default function BillingView({ currentPlan }: BillingViewProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const current = getPlanDefinition(currentPlan);

  async function handleCheckout(planId: PlanId) {
    if (planId === 'free' || planId === currentPlan) return;

    setLoadingPlan(planId);
    setNotice(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setNotice(
        data.error ||
          'Checkout is not available yet. We are connecting payments — try again soon.',
      );
    } catch {
      setNotice('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
          Billing
        </h1>
        <p className="mt-1.5 text-[16px] text-muted">
          Manage your plan and upgrade when you need more reviews or negotiation emails.
        </p>
      </div>

      <div className="card mb-8 p-6 sm:p-8">
        <p className="text-[13px] font-medium uppercase tracking-wide text-muted">
          Current plan
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[24px] font-semibold text-gray-900">{planLabel(currentPlan)}</p>
            <p className="mt-1 text-[15px] text-muted">
              {current.price}
              {current.period ? ` ${current.period}` : ''}
              {currentPlan === 'free' && ' · 1 contract review included'}
              {currentPlan === 'credits' && ' · 3 reviews · negotiation emails included'}
              {currentPlan === 'pro' && ' · unlimited reviews · negotiation emails included'}
            </p>
          </div>
          {currentPlan !== 'pro' && (
            <ButtonPrimary
              onClick={() => handleCheckout('pro')}
              disabled={loadingPlan !== null}
              className="px-6 py-3 text-[15px]"
            >
              {loadingPlan === 'pro' ? 'Loading…' : 'Upgrade to Pro'}
            </ButtonPrimary>
          )}
        </div>
      </div>

      {notice && (
        <p className="mb-6 rounded-xl bg-[#FAEEDA] p-4 text-[15px] text-[#854F0B]">{notice}</p>
      )}

      <h2 className="mb-4 text-[18px] font-semibold text-gray-900">Available plans</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`card flex flex-col p-6 ${plan.accent ? 'border-brand' : ''} ${
                isCurrent ? 'ring-2 ring-brand/20' : ''
              }`}
            >
              {isCurrent && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-[#3B6D11]">
                  Current plan
                </span>
              )}
              <h3 className="text-[16px] font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-[32px] font-semibold text-gray-900">{plan.price}</span>
                {plan.period && (
                  <span className="text-[14px] text-muted"> {plan.period}</span>
                )}
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px] text-muted">
                    <span className="mt-0.5 text-brand">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonPrimary
                onClick={() => handleCheckout(plan.id)}
                disabled={isCurrent || plan.id === 'free' || loadingPlan !== null}
                className={`w-full py-3 text-[15px] ${
                  isCurrent || plan.id === 'free' ? 'opacity-50' : ''
                }`}
              >
                {isCurrent
                  ? 'Current plan'
                  : loadingPlan === plan.id
                    ? 'Loading…'
                    : plan.cta}
              </ButtonPrimary>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[14px] text-muted">
        Secure checkout powered by Stripe. Need help? Use the{' '}
        <a href="/contact" className="font-medium text-brand hover:underline">
          contact form
        </a>
        .
      </p>
    </div>
  );
}
