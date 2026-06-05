import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ProductId } from '@/lib/plans';

const PRODUCT_PRICES: Record<
  ProductId,
  { envKey: string; mode: 'payment' | 'subscription' }
> = {
  single: { envKey: 'STRIPE_PRICE_SINGLE', mode: 'payment' },
  credits: { envKey: 'STRIPE_PRICE_CREDITS', mode: 'payment' },
  pro: { envKey: 'STRIPE_PRICE_PRO', mode: 'subscription' },
};

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json(
      {
        error:
          'Online checkout is being set up. Please check back shortly or contact us for manual upgrade.',
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const plan =
    typeof body === 'object' && body !== null && 'plan' in body ? body.plan : null;

  if (plan !== 'single' && plan !== 'credits' && plan !== 'pro') {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
  }

  const priceConfig = PRODUCT_PRICES[plan];
  const priceId = process.env[priceConfig.envKey];
  if (!priceId) {
    return NextResponse.json(
      { error: 'This plan is not available for checkout yet.' },
      { status: 503 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002';

  const params = new URLSearchParams({
    mode: priceConfig.mode,
    success_url: `${appUrl}/billing?success=1`,
    cancel_url: `${appUrl}/billing?canceled=1`,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    customer_email: user.email ?? '',
    'metadata[user_id]': user.id,
    'metadata[plan]': plan,
  });

  if (plan === 'pro') {
    params.set('subscription_data[metadata][user_id]', user.id);
    params.set('subscription_data[metadata][plan]', 'pro');
  }

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error('Stripe checkout error:', session);
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
