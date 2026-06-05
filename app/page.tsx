import Link from 'next/link';
import { Header, Footer } from '@/components/Layout';

const features = [
  {
    title: 'Plain-English Summary',
    description:
      'Get a clear 2–3 sentence overview of what the contract actually says — no legal jargon.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    ),
  },
  {
    title: 'Risk Scoring',
    description:
      'Every clause gets a traffic-light rating so you instantly know what needs attention.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    ),
  },
  {
    title: 'Negotiation Email',
    description:
      'Get a ready-to-send email requesting changes to risky clauses — copy and customize in one click.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    ),
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Understand any freelance contract in 30 seconds
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
            No lawyer needed. No legal jargon. Just clear answers.
          </p>
          <Link
            href="/login?mode=signup"
            className="mt-10 inline-flex rounded-lg bg-navy px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-navy/90"
          >
            Review your first contract free →
          </Link>
        </section>

        <section className="border-t border-gray-200 bg-white py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface">
                  <svg
                    className="h-6 w-6 text-navy"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
              <p className="mt-4 text-4xl font-bold text-navy">Free</p>
              <p className="mt-2 text-gray-600">for now</p>
              <p className="mt-4 text-sm text-gray-500">
                Unlimited contract reviews. Stripe payments coming later.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
