'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import UploadZone from '@/components/UploadZone';
import RiskScore from '@/components/RiskScore';
import ClauseCard from '@/components/ClauseCard';
import NegotiationEmail from '@/components/NegotiationEmail';
import { AnalysisDisclaimer } from '@/components/Layout';
import type { Contract } from '@/types';

const LOADING_STEPS = [
  'Reading your contract…',
  'Identifying risky clauses…',
  'Writing your negotiation email…',
];

type ReviewClientProps = {
  existingContract?: Contract | null;
};

export default function ReviewClient({ existingContract }: ReviewClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractIdParam = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(
    existingContract ?? null
  );

  async function handleUpload(file: File) {
    setLoading(true);
    setError(null);
    setLoadingStep(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setLoadingStep(0);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { contract: uploaded, extractedText } = await uploadRes.json();
      setLoadingStep(1);

      await new Promise((r) => setTimeout(r, 600));
      setLoadingStep(2);

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: uploaded.id,
          extractedText,
        }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const { contract: analyzed } = await analyzeRes.json();
      setContract(analyzed);
      router.replace(`/review?id=${analyzed.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const showResults =
    contract?.status === 'analyzed' && contract.summary && contract.clauses;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Review contract
          </h1>
          <p className="mt-1 text-gray-500">
            Upload a client contract PDF for instant analysis
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>

      {!showResults && !loading && (
        <UploadZone onUpload={handleUpload} disabled={loading} />
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-navy" />
          <p className="text-lg font-medium text-gray-900">
            {LOADING_STEPS[loadingStep]}
          </p>
          <div className="mx-auto mt-6 flex max-w-xs justify-center gap-2">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= loadingStep ? 'bg-navy' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {showResults && (
        <div className="space-y-8">
          {contract.overall_risk && (
            <RiskScore risk={contract.overall_risk} />
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Summary
            </h2>
            <p className="leading-relaxed text-gray-700">{contract.summary}</p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Clause breakdown
            </h2>
            <div className="space-y-4">
              {contract.clauses!.map((clause, i) => (
                <ClauseCard key={`${clause.title}-${i}`} clause={clause} />
              ))}
            </div>
          </div>

          {contract.negotiation_email && (
            <NegotiationEmail email={contract.negotiation_email} />
          )}

          <AnalysisDisclaimer />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setContract(null);
                router.push('/review');
              }}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-navy hover:text-navy"
            >
              Review another contract
            </button>
          </div>
        </div>
      )}

      {contractIdParam &&
        contract?.status === 'pending' &&
        !loading &&
        !showResults && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">This contract is still being analyzed…</p>
          </div>
        )}

      {contract?.status === 'error' && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="mb-4 text-red-700">Analysis failed for this contract.</p>
          <button
            onClick={() => router.push('/review')}
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white"
          >
            Try a new upload
          </button>
        </div>
      )}
    </div>
  );
}
