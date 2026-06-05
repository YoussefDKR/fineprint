import { NextResponse } from 'next/server';
import { addReviewCredits, setUserProPlan } from '@/lib/credits';
import type { ProductId } from '@/lib/plans';

export const runtime = 'nodejs';

async function fulfillPurchase(userId: string, product: ProductId) {
  if (product === 'single') {
    await addReviewCredits(userId, 1);
    return;
  }
  if (product === 'credits') {
    await addReviewCredits(userId, 3);
    return;
  }
  if (product === 'pro') {
    await setUserProPlan(userId, true);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await request.text();

  let event: {
    type: string;
    data: { object: Record<string, unknown> };
  };

  try {
    const crypto = await import('crypto');
    const parts = signature.split(',').reduce(
      (acc, part) => {
        const [k, v] = part.split('=');
        if (k === 't') acc.t = v;
        if (k === 'v1') acc.v1 = v;
        return acc;
      },
      { t: '', v1: '' } as { t: string; v1: string },
    );

    if (!parts.t || !parts.v1) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const signedPayload = `${parts.t}.${body}`;
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    if (expected !== parts.v1) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata as Record<string, string> | undefined;
    const userId = metadata?.user_id;
    const plan = metadata?.plan as ProductId | undefined;

    if (userId && plan) {
      try {
        await fulfillPurchase(userId, plan);
      } catch (err) {
        console.error('Fulfill purchase error:', err);
        return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 });
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const metadata = subscription.metadata as Record<string, string> | undefined;
    const userId = metadata?.user_id;
    if (userId) {
      await setUserProPlan(userId, false);
    }
  }

  return NextResponse.json({ received: true });
}
