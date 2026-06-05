'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/app/login/actions';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('mode') === 'signup';
  const redirect = searchParams.get('redirect') || '/dashboard';
  const configError = searchParams.get('error') === 'config';

  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('redirect', redirect);

    startTransition(async () => {
      try {
        if (mode === 'signup') {
          const result = await signUp(formData);
          if (result?.error) {
            setError(result.error);
          } else if (result?.message) {
            setMessage(result.message);
          }
        } else {
          const result = await signIn(formData);
          if (result?.error) {
            setError(result.error);
          }
        }
      } catch (err) {
        // redirect() throws — expected on successful login
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
          return;
        }
        setError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold text-navy">
          Fineprint
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-gray-500">
          {mode === 'login'
            ? 'Log in to review your contracts'
            : 'Start reviewing contracts for free'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-4">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            placeholder="••••••••"
          />
        </div>

        {configError && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Supabase is not configured yet. Add your API keys to{' '}
            <code className="rounded bg-amber-100 px-1">.env.local</code> and
            restart the dev server.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        {message && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50"
        >
          {isPending
            ? 'Please wait…'
            : mode === 'login'
              ? 'Log in'
              : 'Create account'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-medium text-navy hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-medium text-navy hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
