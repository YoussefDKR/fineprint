'use client';

import { useEffect, useState } from 'react';
import { ButtonPrimary } from '@/components/ui/Button';

type WaitlistModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setError(null);
      setSuccess(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(data.message || "You're on the list — we'll email you when we launch.");
      setEmail('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card relative w-full max-w-md p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[20px] leading-none text-muted hover:text-gray-900"
          aria-label="Close"
        >
          ×
        </button>

        <h2 id="waitlist-title" className="text-[24px] font-semibold text-gray-900">
          Join the waitlist
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          We&apos;re in private beta — drop your email and we&apos;ll give you free credits when we
          launch.
        </p>

        {success ? (
          <p className="mt-6 rounded-xl bg-[#EAF3DE] p-4 text-[15px] text-[#3B6D11]">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="waitlist-email" className="sr-only">
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-gray-900 outline-none focus:border-brand"
              />
            </div>
            {error && (
              <p className="rounded-xl bg-[#FCEBEB] p-4 text-[15px] text-[#A32D2D]">{error}</p>
            )}
            <ButtonPrimary type="submit" disabled={loading} className="w-full py-3 text-[16px]">
              {loading ? 'Joining…' : 'Join waitlist'}
            </ButtonPrimary>
          </form>
        )}
      </div>
    </div>
  );
}
