import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@/components/Layout';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — YourFineprint',
  description: 'Get in touch with the YourFineprint team.',
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-xl">
          <p className="text-[15px] text-muted">
            <Link href="/" className="hover:text-gray-900">
              ← Back to home
            </Link>
          </p>
          <h1 className="mt-6 text-[32px] font-semibold tracking-tight text-gray-900">
            Contact us
          </h1>
          <p className="mt-2 text-[16px] text-muted">
            Have a question or feedback? Send us a message and we&apos;ll reply as soon as we can.
          </p>
          <div className="card mt-8 p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer variant="landing" />
    </div>
  );
}
