import Link from 'next/link';
import { Header, Footer } from '@/components/Layout';

export function LegalDocument({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10">
        <article className="mx-auto max-w-3xl">
          <p className="text-[15px] text-muted">
            <Link href="/" className="hover:text-gray-900">
              ← Back to home
            </Link>
          </p>
          <h1 className="mt-6 text-[32px] font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-[15px] text-muted">Last updated: {lastUpdated}</p>
          <div className="card mt-8 space-y-6 px-6 py-8 text-[16px] leading-relaxed text-gray-800 sm:px-8">
            {children}
          </div>
        </article>
      </main>
      <Footer variant="landing" />
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[18px] font-semibold text-gray-900">{heading}</h2>
      <div className="mt-3 space-y-3 text-muted [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}
