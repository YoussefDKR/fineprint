'use client';

import { useState } from 'react';

type NegotiationEmailProps = {
  email: string;
};

export default function NegotiationEmail({ email }: NegotiationEmailProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Negotiation email
        </h3>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-navy hover:text-navy"
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>
      <div className="rounded-lg bg-surface p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
          {email}
        </pre>
      </div>
    </div>
  );
}
