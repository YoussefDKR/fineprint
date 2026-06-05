import RiskScore from '@/components/RiskScore';
import { ButtonGhost } from '@/components/ui/Button';
import {
  contractDisplayName,
  formatDashboardDate,
  inferContractType,
  riskScoreNumber,
} from '@/lib/dashboard-stats';
import type { Contract } from '@/types';

type ContractsTableProps = {
  contracts: Contract[];
  emptyMessage?: string;
};

export default function ContractsTable({
  contracts,
  emptyMessage = 'No contracts reviewed yet.',
}: ContractsTableProps) {
  const analyzed = contracts.filter((c) => c.status === 'analyzed');

  if (analyzed.length === 0) {
    return (
      <div className="p-10 text-center text-[14px] text-muted">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-border text-[13px] text-muted">
            <th className="px-5 py-3 font-medium sm:px-6">Contract</th>
            <th className="px-3 py-3 font-medium">Type</th>
            <th className="px-3 py-3 font-medium">Risk</th>
            <th className="px-3 py-3 font-medium">Score</th>
            <th className="px-3 py-3 font-medium">Reviewed</th>
            <th className="px-5 py-3 font-medium sm:px-6" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {analyzed.map((contract) => {
            const score = riskScoreNumber(contract.clauses);
            return (
              <tr key={contract.id} className="hover:bg-canvas/60">
                <td className="px-5 py-4 sm:px-6">
                  <p className="font-medium text-gray-900">
                    {contractDisplayName(contract.file_name)}
                  </p>
                </td>
                <td className="px-3 py-4 text-muted">
                  {inferContractType(contract.file_name, contract.summary)}
                </td>
                <td className="px-3 py-4">
                  {contract.overall_risk && (
                    <RiskScore risk={contract.overall_risk} size="sm" />
                  )}
                </td>
                <td className="px-3 py-4 font-medium text-gray-900">
                  {score !== null ? `${score}/100` : '—'}
                </td>
                <td className="px-3 py-4 text-muted">
                  {formatDashboardDate(contract.created_at)}
                </td>
                <td className="px-5 py-4 text-right sm:px-6">
                  <ButtonGhost
                    href={`/review?id=${contract.id}`}
                    className="px-4 py-2 text-[13px]"
                  >
                    View
                  </ButtonGhost>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
