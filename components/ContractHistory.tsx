import type { Contract, RiskLevel } from '@/types';
import { riskStyles } from '@/lib/risk-styles';
import RiskScore from './RiskScore';
import { ButtonGhost, ButtonPrimary } from '@/components/ui/Button';

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

function FileIcon({ risk }: { risk?: RiskLevel | null }) {
  const style = risk ? riskStyles[risk] : { iconBg: 'bg-canvas text-muted' };

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    </div>
  );
}

export default function ContractHistory({ contracts }: ContractHistoryProps) {
  if (contracts.length === 0) {
    return (
      <div className="card p-14 text-center">
        <p className="mb-2 text-[20px] font-semibold text-gray-900">
          No contracts reviewed yet
        </p>
        <p className="mb-8 text-[16px] text-muted">
          Upload your first client contract to get a plain-English breakdown.
        </p>
        <ButtonPrimary href="/review" className="px-6 py-3 text-[16px]">
          Review your first contract
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <div className="card divide-y divide-border">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          className="flex items-center gap-5 px-6 py-5"
        >
          <FileIcon
            risk={
              contract.status === 'analyzed' ? contract.overall_risk : null
            }
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-medium text-gray-900">
              {contract.file_name}
            </p>
            <p className="mt-0.5 text-[15px] text-muted">
              {formatDate(contract.created_at)}
              {contract.status === 'pending' && ' · Analyzing…'}
              {contract.status === 'error' && ' · Analysis failed'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {contract.overall_risk && contract.status === 'analyzed' && (
              <RiskScore risk={contract.overall_risk} size="sm" />
            )}
            <ButtonGhost
              href={`/review?id=${contract.id}`}
              className="px-5 py-2.5 text-[15px]"
            >
              View
            </ButtonGhost>
          </div>
        </div>
      ))}
    </div>
  );
}
