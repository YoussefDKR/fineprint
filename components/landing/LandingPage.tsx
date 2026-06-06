'use client';

import { useState } from 'react';
import { Footer } from '@/components/Layout';
import LandingHeader from '@/components/landing/LandingHeader';
import ProductPreview from '@/components/landing/ProductPreview';
import WaitlistModal from '@/components/landing/WaitlistModal';
import { ClauseCardPreview } from '@/components/ClauseCard';
import { ButtonPrimary, ButtonGhost } from '@/components/ui/Button';
import { LANDING_PLANS } from '@/lib/plans';

const steps = [
  {
    title: 'Upload your contract',
    desc: 'Drag and drop any PDF. NDA, MSA, SOW, freelance agreement — we handle them all.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    ),
  },
  {
    title: 'Get your analysis',
    desc: 'Plain-English summary, clause-by-clause risk scoring, and flagged red lines in under 30 seconds.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    ),
  },
  {
    title: 'Negotiate with confidence',
    desc: 'Copy your AI-generated negotiation email and send it directly to your client.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    ),
  },
];

const benefits = [
  {
    title: 'Built for freelancers',
    desc: 'Designed around the contracts freelancers actually sign — not corporate legal templates.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: 'Your data stays private',
    desc: 'Contracts are stored securely and never used to train AI models.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    ),
  },
  {
    title: 'AI that explains like a lawyer',
    desc: 'Every clause translated into plain English with clear risk flags — not legal jargon.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
  },
  {
    title: 'Save hours on every deal',
    desc: 'Skip reading 20 pages of legalese. Know what matters in under 30 seconds.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

const testimonials = [
  {
    quote:
      'YourFineprint caught a non-compete clause I would have signed without reading. Saved me from a bad deal.',
    name: 'Sarah M.',
    role: 'UX Designer',
  },
  {
    quote:
      'The negotiation email alone is worth it. I sent it to my client and got three clauses changed.',
    name: 'James K.',
    role: 'Independent Developer',
  },
  {
    quote:
      'Finally understand what I am agreeing to. The risk scores make it obvious what to push back on.',
    name: 'Elena R.',
    role: 'Brand Consultant',
  },
];

const faqs = [
  {
    q: 'Is YourFineprint legal advice?',
    a: 'No. YourFineprint is a risk assessment and plain-language translation tool, not a law firm. Always consult a qualified lawyer for important legal decisions.',
  },
  {
    q: 'What contracts can I upload?',
    a: 'Any freelance or agency PDF — NDAs, MSAs, SOWs, freelance agreements, and more. If it is a PDF, we can analyze it.',
  },
  {
    q: 'How does pricing work?',
    a: 'Pay €3 per contract with no subscription, or buy a 3-pack for €9 one-time. Credits never expire. Pro is €19/month for unlimited reviews, your contract history dashboard, and priority analysis.',
  },
  {
    q: 'Do credits expire?',
    a: 'No. Whether you buy a single review or a 3-pack, your credits stay on your account until you use them.',
  },
  {
    q: 'How is my data handled?',
    a: 'Your contracts are stored securely for your review history. We do not sell your data or use contracts to train AI models.',
  },
];

function Stars() {
  return (
    <div className="mb-3 flex gap-0.5 text-[#EF9F27]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const openWaitlist = () => setWaitlistOpen(true);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <LandingHeader onJoinWaitlist={openWaitlist} />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 pb-12 pt-10 text-center sm:pb-14 sm:pt-12">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-[#EAF3DE]/50 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              AI contract review for freelancers &amp; agencies
            </span>
            <h1 className="mt-6 text-[52px] font-bold leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-[68px] lg:text-[80px]">
              Read every contract like a lawyer.
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[18px] leading-relaxed text-muted sm:text-[20px]">
              YourFineprint analyzes your freelance contracts in seconds — plain English
              summaries, risk scores, and negotiation advice.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonPrimary onClick={openWaitlist} className="px-5 py-2.5 text-[16px]">
                Join waitlist
              </ButtonPrimary>
              <ButtonGhost href="#how-it-works" className="px-5 py-2.5 text-[16px]">
                See how it works
              </ButtonGhost>
            </div>
            <p className="mt-5 text-[15px] text-muted sm:text-[16px]">
              From €3 per contract · No subscription · Credits never expire
            </p>
          </div>

          <div id="examples" className="mx-auto mt-12 max-w-5xl scroll-mt-24 sm:mt-14">
            <ProductPreview />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-border px-6 py-14">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-10">
            {steps.map((step) => (
              <div key={step.title}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {step.icon}
                  </svg>
                </div>
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

        {/* Benefits */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div key={item.title} className="card p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-gray-900 sm:text-[18px]">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted sm:text-[16px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-wide text-muted">
              Trusted by freelancers worldwide
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6">
                  <Stars />
                  <p className="text-[15px] leading-relaxed text-gray-800 sm:text-[16px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3DE] text-[14px] font-semibold text-brand">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-gray-900">{t.name}</p>
                      <p className="text-[14px] text-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clause example */}
        <section className="border-t border-border px-6 py-14">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-muted">
              Example output
            </p>
            <h2 className="mb-6 text-[24px] font-semibold text-gray-900">
              See what you&apos;ll get
            </h2>
            <ClauseCardPreview />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-border px-6 py-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-[24px] font-semibold text-gray-900">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-border rounded-xl border border-border bg-white">
              {faqs.map((faq, i) => (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="text-[16px] font-medium text-gray-900">{faq.q}</span>
                    <span className="shrink-0 text-[16px] text-muted">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <p className="border-t border-border px-5 pb-4 text-[15px] leading-relaxed text-muted sm:px-6 sm:text-[16px]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 border-t border-border px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-[24px] font-semibold text-gray-900">
              Pricing
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {LANDING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`card flex flex-col p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-[0_16px_48px_-12px_rgba(22,101,52,0.18)] ${
                    plan.accent ? 'border-brand' : ''
                  }`}
                >
                  {plan.accent && (
                    <span className="mb-3 w-fit rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-brand">
                      Best value
                    </span>
                  )}
                  <h3 className="text-[15px] font-medium text-gray-900">{plan.name}</h3>
                  <div className="mt-3 mb-5">
                    <span className="text-[32px] font-medium text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-[13px] text-muted"> {plan.period}</span>
                    )}
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-muted">
                        <span className="mt-0.5 text-brand">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonPrimary onClick={openWaitlist} className="w-full">
                    Join waitlist
                  </ButtonPrimary>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-[13px] text-muted">
              Stripe checkout coming soon — manage plans anytime from your billing page.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-brand px-6 py-14 text-center text-white">
          <h2 className="text-[24px] font-semibold sm:text-[28px]">
            Stop signing contracts you don&apos;t understand.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-white/80 sm:text-[17px]">
            From €3 per contract. No subscription required.
          </p>
          <button
            type="button"
            onClick={openWaitlist}
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-[16px] font-medium text-brand transition-colors hover:bg-white/90"
          >
            Join waitlist
          </button>
        </section>
      </main>

      <Footer variant="landing" />

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
