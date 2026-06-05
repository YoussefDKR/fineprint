'use client';

import { useState } from 'react';
import { ButtonPrimary } from '@/components/ui/Button';
import { PRODUCTS, type ProductId } from '@/lib/plans';
import {
  planBillingDetail,
  planDescription,
  planLabel,
  type UserPlan,
} from '@/lib/plan';

type BillingViewProps = {
  currentPlan: UserPlan;
  creditBalance: number;
};

export default function BillingView({ currentPlan, creditBalance }: BillingViewProps) {
  const [loadingPlan, setLoadingPlan] = useState<ProductId | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleCheckout(productId: ProductId) {
    if (productId === 'pro' && currentPlan === 'pro') return;

    setLoadingPlan(productId);
    setNotice(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: productId }),
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
          Pay per contract, grab a 3-pack, or go Pro for unlimited reviews.
        </p>
      </div>

      <div className="card mb-8 p-6 sm:p-8">
        <p className="text-[13px] font-medium uppercase tracking-wide text-muted">
          Current plan
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[24px] font-semibold text-gray-900">{planLabel(currentPlan)}</p>
            <p className="mt-1 text-[15px] text-muted">{planDescription(currentPlan, creditBalance)}</p>
            <p className="mt-1 text-[14px] text-muted">{planBillingDetail(currentPlan, creditBalance)}</p>
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

      <h2 className="mb-4 text-[18px] font-semibold text-gray-900">Buy reviews</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {PRODUCTS.map((product) => {
          const isCurrent = product.id === 'pro' && currentPlan === 'pro';
          return (
            <div
              key={product.id}
              className={`card flex flex-col p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-[0_16px_48px_-12px_rgba(22,101,52,0.18)] ${
                product.accent ? 'border-brand' : ''
              } ${isCurrent ? 'ring-2 ring-brand/20' : ''}`}
            >
              {product.accent && (
                <span className="mb-3 w-fit rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-brand">
                  Best value
                </span>
              )}
              {isCurrent && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-[#3B6D11]">
                  Current plan
                </span>
              )}
              <h3 className="text-[16px] font-semibold text-gray-900">{product.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-[32px] font-semibold text-gray-900">{product.price}</span>
                {product.period && (
                  <span className="text-[14px] text-muted"> {product.period}</span>
                )}
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px] text-muted">
                    <span className="mt-0.5 text-brand">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonPrimary
                onClick={() => handleCheckout(product.id)}
                disabled={isCurrent || loadingPlan !== null}
                className={`w-full py-3 text-[15px] ${isCurrent ? 'opacity-50' : ''}`}
              >
                {isCurrent
                  ? 'Current plan'
                  : loadingPlan === product.id
                    ? 'Loading…'
                    : product.cta}
              </ButtonPrimary>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[14px] text-muted">
        Secure checkout powered by Stripe. Credits never expire. Need help? Use the{' '}
        <a href="/contact" className="font-medium text-brand hover:underline">
          contact form
        </a>
        .
      </p>
    </div>
  );
}
