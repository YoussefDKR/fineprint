'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UploadZone from '@/components/UploadZone';
import RiskScore from '@/components/RiskScore';
import ClauseCard from '@/components/ClauseCard';
import NegotiationEmail from '@/components/NegotiationEmail';
import { AnalysisDisclaimer, PageHeader } from '@/components/Layout';
import { ButtonGhost, ButtonPrimary } from '@/components/ui/Button';
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

  const showResults =
    contract?.status === 'analyzed' && contract.summary && contract.clauses;

  return (
    <div>
      <PageHeader
        title="Review contract"
        subtitle="Upload a client contract PDF for instant analysis"
      />

      {!showResults && !loading && (
        <UploadZone onUpload={handleUpload} disabled={loading} />
      )}

      {loading && (
        <div className="card mx-auto max-w-lg p-12 text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="text-[17px] font-medium text-gray-900">
            {LOADING_STEPS[loadingStep]}
          </p>
          <div className="mx-auto mt-5 flex max-w-xs justify-center gap-1.5">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= loadingStep ? 'bg-brand' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="card mt-4 border-[#E24B4A] bg-[#FCEBEB] p-5 text-[15px] text-[#A32D2D]">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {showResults && (
        <div className="space-y-6">
          {contract.overall_risk && (
            <RiskScore risk={contract.overall_risk} />
          )}

          <div className="card p-6">
            <h2 className="mb-3 text-[18px] font-semibold text-gray-900">
              Summary
            </h2>
            <p className="text-[16px] leading-relaxed text-muted">
              {contract.summary}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-[18px] font-semibold text-gray-900">
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

          <ButtonGhost
            onClick={() => {
              setContract(null);
              router.push('/review');
            }}
            className="text-[15px]"
          >
            Review another contract
          </ButtonGhost>
        </div>
      )}

      {contractIdParam &&
        contract?.status === 'pending' &&
        !loading &&
        !showResults && (
          <div className="card p-12 text-center">
            <p className="text-[16px] text-muted">
              This contract is still being analyzed…
            </p>
          </div>
        )}

      {contract?.status === 'error' && !loading && (
        <div className="card p-10 text-center">
          <p className="mb-5 text-[16px] text-[#A32D2D]">
            Analysis failed for this contract.
          </p>
          <ButtonPrimary onClick={() => router.push('/review')}>
            Try a new upload
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}
