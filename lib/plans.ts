export type PlanId = 'free' | 'credits' | 'pro';

export type PlanDefinition = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  accent: boolean;
  includesNegotiationEmail: boolean;
};

export const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: '',
    features: ['1 contract review', 'Plain-English summary', 'Risk score'],
    cta: 'Current plan',
    accent: false,
    includesNegotiationEmail: false,
  },
  {
    id: 'credits',
    name: 'Credits',
    price: '€9',
    period: 'one-time',
    features: [
      '3 contract reviews',
      'Everything in Free',
      'Negotiation email generator',
    ],
    cta: 'Buy credits',
    accent: true,
    includesNegotiationEmail: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€19',
    period: '/ month',
    features: [
      'Unlimited reviews',
      'Everything in Credits',
      'Contract history dashboard',
      'Priority analysis',
    ],
    cta: 'Start Pro',
    accent: false,
    includesNegotiationEmail: true,
  },
];

export function getPlanDefinition(id: PlanId): PlanDefinition {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
