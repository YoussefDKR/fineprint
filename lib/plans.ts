export type ProductId = 'single' | 'credits' | 'pro';

export type ProductDefinition = {
  id: ProductId;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  accent: boolean;
  includesNegotiationEmail: boolean;
};

/** Purchasable options shown on landing & billing */
export const PRODUCTS: ProductDefinition[] = [
  {
    id: 'single',
    name: 'Pay per contract',
    price: '€3',
    period: 'per contract',
    features: [
      'One full contract review',
      'Plain-English summary & risk score',
      'Negotiation email generator',
      'No subscription',
    ],
    cta: 'Buy one review',
    accent: false,
    includesNegotiationEmail: true,
  },
  {
    id: 'credits',
    name: '3-pack',
    price: '€9',
    period: 'one-time',
    features: [
      '3 contract reviews (€3 each)',
      'Everything in single review',
      'Credits never expire',
      'No subscription',
    ],
    cta: 'Buy 3-pack',
    accent: true,
    includesNegotiationEmail: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€19',
    period: '/ month',
    features: [
      'Unlimited contract reviews',
      'Contract history dashboard',
      'Priority analysis',
      'Negotiation email generator',
    ],
    cta: 'Start Pro',
    accent: false,
    includesNegotiationEmail: true,
  },
];

export const LANDING_PLANS = PRODUCTS.map((product) => ({
  ...product,
  href: '/login',
}));

export function getProduct(id: ProductId): ProductDefinition {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}

/** @deprecated use ProductId */
export type PlanId = ProductId;

/** @deprecated use PRODUCTS */
export const PLANS = PRODUCTS;

/** @deprecated use getProduct */
export function getPlanDefinition(id: ProductId): ProductDefinition {
  return getProduct(id);
}
