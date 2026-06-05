import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';
import { Footer } from '@/components/Layout';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Suspense fallback={<div className="text-gray-500">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
