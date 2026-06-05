import Link from 'next/link';
import type { Contract } from '@/types';
import RiskScore from './RiskScore';

type ContractHistoryProps = {
  contracts: Contract[];
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContractHistory({ contracts }: ContractHistoryProps) {
  if (contracts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="mb-2 text-lg font-medium text-gray-900">
          No contracts reviewed yet
        </p>
        <p className="mb-6 text-gray-500">
          Upload your first client contract to get a plain-English breakdown.
        </p>
        <Link
          href="/review"
          className="inline-flex rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90"
        >
          Review your first contract
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ul className="divide-y divide-gray-100">
        {contracts.map((contract) => (
          <li
            key={contract.id}
            className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {contract.file_name}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(contract.created_at)}
                {contract.status === 'pending' && ' · Analyzing…'}
                {contract.status === 'error' && ' · Analysis failed'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {contract.overall_risk && contract.status === 'analyzed' && (
                <RiskScore risk={contract.overall_risk} size="sm" />
              )}
              <Link
                href={`/review?id=${contract.id}`}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-navy hover:text-navy"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
