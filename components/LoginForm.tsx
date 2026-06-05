'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { signIn, signUp } from '@/app/login/actions';
import { ButtonPrimary } from '@/components/ui/Button';
import { getPasswordStrength } from '@/lib/profile';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-gray-900 outline-none focus:border-brand';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('mode') === 'signup';
  const redirect = searchParams.get('redirect') || '/dashboard';
  const configError = searchParams.get('error') === 'config';

  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  const strength = getPasswordStrength(password);

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
          if (result?.error) setError(result.error);
          else if (result?.message) setMessage(result.message);
        } else {
          const result = await signIn(formData);
          if (result?.error) setError(result.error);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) return;
        setError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10 text-center">
        <div className="flex justify-center">
          <Logo href="/" size="nav" />
        </div>
        <h1 className="mt-6 text-[32px] font-semibold text-gray-900">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-[16px] text-muted">
          {mode === 'login'
            ? 'Log in to review your contracts'
            : 'Start reviewing contracts for free'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 sm:p-10">
        {mode === 'signup' && (
          <div className="mb-5">
            <label htmlFor="fullName" className="mb-2 block text-[15px] font-medium text-gray-700">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className={inputClass}
              placeholder="Jane Freelancer"
            />
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="mb-2 block text-[15px] font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-[15px] font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
          {mode === 'signup' && password && (
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between text-[14px]">
                <span className="text-muted">Password strength</span>
                <span className="font-medium text-gray-900">{strength.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${strength.score}%`,
                    backgroundColor: strength.barColor,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {configError && (
          <p className="mb-4 rounded-xl bg-[#FAEEDA] p-4 text-[15px] text-[#854F0B]">
            Supabase is not configured yet. Add your API keys to{' '}
            <code className="rounded bg-white/60 px-1">.env.local</code> and restart the dev server.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-xl bg-[#FCEBEB] p-4 text-[15px] text-[#A32D2D]">{error}</p>
        )}
        {message && (
          <p className="mb-4 rounded-xl bg-[#EAF3DE] p-4 text-[15px] text-[#3B6D11]">{message}</p>
        )}

        <ButtonPrimary type="submit" disabled={isPending} className="w-full py-3 text-[16px]">
          {isPending ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </ButtonPrimary>

        <p className="mt-6 text-center text-[15px] text-muted">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')} className="font-medium text-brand hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="font-medium text-brand hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
