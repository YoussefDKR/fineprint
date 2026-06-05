'use client';

import { useState } from 'react';
import { ButtonPrimary } from '@/components/ui/Button';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-gray-900 outline-none focus:border-brand';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
      setEmail('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-[15px] font-medium text-gray-900">
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-[15px] font-medium text-gray-900">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className={`${inputClass} resize-y min-h-[140px]`}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-[#FCEBEB] p-4 text-[15px] text-[#A32D2D]">{error}</p>
      )}
      {success && (
        <p className="rounded-xl bg-[#EAF3DE] p-4 text-[15px] text-[#3B6D11]">
          Message sent. We&apos;ll get back to you soon.
        </p>
      )}

      <ButtonPrimary type="submit" disabled={sending} className="w-full py-3 text-[16px] sm:w-auto">
        {sending ? 'Sending…' : 'Send message'}
      </ButtonPrimary>
    </form>
  );
}
