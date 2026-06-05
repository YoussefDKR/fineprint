'use client';

import { useState } from 'react';
import { ButtonGhost } from '@/components/ui/Button';

type NegotiationEmailProps = {
  email: string;
};

function highlightPlaceholders(text: string) {
  const parts = text.split(/(\[CLIENT NAME\]|\[YOUR NAME\])/g);
  return parts.map((part, i) => {
    if (part === '[CLIENT NAME]' || part === '[YOUR NAME]') {
      return (
        <span key={i} className="font-medium text-placeholder">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function NegotiationEmail({ email }: NegotiationEmailProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-gray-900">
          Negotiation email
        </h3>
        <ButtonGhost onClick={handleCopy} className="px-4 py-2 text-[15px]">
          {copied ? 'Copied!' : 'Copy'}
        </ButtonGhost>
      </div>
      <div className="rounded-xl bg-canvas p-5">
        <pre className="whitespace-pre-wrap font-sans text-[16px] leading-relaxed text-gray-800">
          {highlightPlaceholders(email)}
        </pre>
      </div>
    </div>
  );
}
