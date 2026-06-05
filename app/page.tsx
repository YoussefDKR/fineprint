import { Header, Footer } from '@/components/Layout';
import { ClauseCardPreview } from '@/components/ClauseCard';
import { ButtonPrimary, ButtonGhost } from '@/components/ui/Button';

const steps = [
  {
    num: '1',
    title: 'Upload your contract',
    desc: 'Drag and drop any PDF. NDA, MSA, SOW, freelance agreement — we handle them all.',
  },
  {
    num: '2',
    title: 'Get your analysis',
    desc: 'Plain-English summary, clause-by-clause risk scoring, and flagged red lines in under 30 seconds.',
  },
  {
    num: '3',
    title: 'Negotiate with confidence',
    desc: 'Copy your AI-generated negotiation email and send it directly to your client.',
  },
];

const features = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
    title: 'Plain-English translation',
    desc: 'No more guessing what legalese means. Every clause explained in language you actually understand.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    ),
    title: 'Traffic-light risk scoring',
    desc: 'Every clause gets a red, amber, or green rating so you know exactly what to worry about and what\'s fine.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    ),
    title: 'Negotiation email generator',
    desc: 'Get a polished, professional email to send your client requesting changes — written for you, ready to copy.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: '',
    features: [
      '1 contract review',
      'Plain-English summary',
      'Risk score',
    ],
    cta: 'Get started free',
    href: '/login',
    accent: false,
  },
  {
    name: 'Credits',
    price: '€9',
    period: 'one-time',
    features: [
      '3 contract reviews',
      'Everything in Free',
      'Negotiation email generator',
    ],
    cta: 'Buy credits',
    href: '/login',
    accent: true,
  },
  {
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
    href: '/login',
    accent: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 pb-12 pt-10 text-center sm:pb-14 sm:pt-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[52px] font-bold leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-[68px] lg:text-[80px]">
              Read every contract like a lawyer.
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[18px] leading-relaxed text-muted sm:text-[20px]">
              Fineprint analyzes your freelance contracts in seconds — plain
              English summaries, risk scores, and a negotiation email ready to
              send.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonPrimary href="/login" className="px-5 py-2.5">
                Analyze your first contract free →
              </ButtonPrimary>
              <ButtonGhost href="#how-it-works" className="px-5 py-2.5">
                See how it works
              </ButtonGhost>
            </div>
            <p className="mt-5 text-[15px] text-muted sm:text-[16px]">
              No credit card required · First review is free · Trusted by
              freelancers
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border px-6 py-14">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-10">
            {steps.map((step) => (
              <div key={step.num}>
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[14px] font-semibold text-white">
                  {step.num}
                </span>
                <h3 className="mb-2 text-[17px] font-semibold text-gray-900 sm:text-[18px]">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted sm:text-[16px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-gray-900 sm:text-[18px]">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted sm:text-[16px]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Example output */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto max-w-lg">
            <p className="mb-2 text-center text-[13px] font-medium uppercase tracking-wide text-muted">
              Example output
            </p>
            <h2 className="mb-6 text-center text-[24px] font-semibold text-gray-900">
              See what you&apos;ll get
            </h2>
            <ClauseCardPreview />
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-[24px] font-semibold text-gray-900">
              Pricing
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`card flex flex-col p-6 ${
                    plan.accent ? 'border-brand' : ''
                  }`}
                >
                  <h3 className="text-[15px] font-medium text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-3 mb-5">
                    <span className="text-[32px] font-medium text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-[13px] text-muted">
                        {' '}
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[13px] text-muted"
                      >
                        <span className="mt-0.5 text-brand">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonPrimary href={plan.href} className="w-full">
                    {plan.cta}
                  </ButtonPrimary>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-[13px] text-muted">
              Stripe payments coming soon — all features free during beta.
            </p>
          </div>
        </section>
      </main>

      <Footer variant="landing" />
    </div>
  );
}
