import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';
import { Header, Footer } from '@/components/Layout';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Suspense fallback={<div className="text-[13px] text-muted">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
