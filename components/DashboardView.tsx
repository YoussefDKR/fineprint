import Link from 'next/link';
import RiskDonut from '@/components/RiskDonut';
import NegotiationUpsell from '@/components/NegotiationUpsell';
import ContractsTable from '@/components/ContractsTable';
import { ButtonGhost, ButtonPrimary } from '@/components/ui/Button';
import {
  contractDisplayName,
  countRiskyClauses,
  formatDashboardDate,
  monthOverMonthLabel,
  riskDistribution,
  topRiskCategories,
} from '@/lib/dashboard-stats';
import type { Contract } from '@/types';

type DashboardViewProps = {
  userName: string;
  hasNegotiationAccess: boolean;
  contracts: Contract[];
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string | null;
}) {
  return (
    <div className="card p-5">
      <p className="text-[14px] text-muted">{label}</p>
      <p className="mt-2 text-[32px] font-semibold tracking-tight text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}
    </div>
  );
}

export default function DashboardView({
  userName,
  hasNegotiationAccess,
  contracts,
}: DashboardViewProps) {
  const analyzed = contracts.filter((c) => c.status === 'analyzed');
  const highRisk = analyzed.filter((c) => c.overall_risk === 'high');
  const riskyClauses = countRiskyClauses(analyzed);
  const withEmail = analyzed.filter((c) => c.negotiation_email);
  const distribution = riskDistribution(contracts);
  const categories = topRiskCategories(analyzed);
  const maxCategory = categories[0]?.count ?? 1;
  const recent = analyzed.slice(0, 5);
  const recentEmails = withEmail.slice(0, 4);
  const latestHighRisk = highRisk[0] ?? analyzed[0];

  const firstName = userName.split(' ')[0];

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
            Dashboard
          </h1>
          <p className="mt-1.5 text-[16px] text-muted">
            Welcome back, {firstName}! Here&apos;s what&apos;s happening with your contracts.
          </p>
        </div>
        <ButtonPrimary href="/review" className="shrink-0 px-6 py-3 text-[15px]">
          + Review new contract
        </ButtonPrimary>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Contracts reviewed"
          value={analyzed.length}
          sub={monthOverMonthLabel(contracts, (c) => c.status === 'analyzed')}
        />
        <StatCard
          label="High risk contracts"
          value={highRisk.length}
          sub={monthOverMonthLabel(contracts, (c) => c.overall_risk === 'high')}
        />
        <StatCard
          label="Risky clauses found"
          value={riskyClauses}
          sub={monthOverMonthLabel(contracts, (c) =>
            Boolean(c.clauses?.some((cl) => cl.risk !== 'low')),
          )}
        />
        <StatCard
          label="Negotiation emails"
          value={hasNegotiationAccess ? withEmail.length : 0}
          sub={
            hasNegotiationAccess
              ? monthOverMonthLabel(contracts, (c) => Boolean(c.negotiation_email))
              : 'Upgrade to unlock'
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-[17px] font-semibold text-gray-900">Recent contracts</h2>
              {recent.length > 0 && (
                <Link href="/contracts" className="text-[13px] font-medium text-brand hover:underline">
                  View all →
                </Link>
              )}
            </div>
            {recent.length === 0 ? (
              <div className="p-10 text-center">
                <p className="mb-2 text-[16px] font-medium text-gray-900">No contracts yet</p>
                <p className="mb-6 text-[14px] text-muted">
                  Upload your first PDF to get a risk breakdown.
                </p>
                <ButtonPrimary href="/review">Review your first contract</ButtonPrimary>
              </div>
            ) : (
              <>
                <ContractsTable contracts={recent} />
                <div className="border-t border-border px-5 py-3 sm:px-6">
                  <Link
                    href="/contracts"
                    className="text-[13px] font-medium text-brand hover:underline"
                  >
                    View all contracts →
                  </Link>
                </div>
              </>
            )}
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-[17px] font-semibold text-gray-900">
                Recent negotiation emails
              </h2>
              {hasNegotiationAccess && recentEmails.length > 0 && (
                <Link href="/negotiation" className="text-[13px] font-medium text-brand hover:underline">
                  View all →
                </Link>
              )}
            </div>
            {!hasNegotiationAccess ? (
              <div className="p-5 sm:p-6">
                <NegotiationUpsell compact />
              </div>
            ) : recentEmails.length === 0 ? (
              <div className="p-8 text-center text-[14px] text-muted">
                Review a contract to generate your first negotiation email.
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {recentEmails.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-gray-900">
                          {contractDisplayName(contract.file_name)}
                        </p>
                        <p className="mt-0.5 text-[13px] text-muted">
                          {formatDashboardDate(contract.created_at)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#EAF3DE] px-3 py-1 text-[12px] font-medium text-[#3B6D11]">
                        Ready
                      </span>
                      <ButtonGhost
                        href={`/review?id=${contract.id}`}
                        className="shrink-0 px-4 py-2 text-[13px]"
                      >
                        View
                      </ButtonGhost>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-3 sm:px-6">
                  <Link
                    href="/negotiation"
                    className="text-[13px] font-medium text-brand hover:underline"
                  >
                    View all negotiation emails →
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 text-[17px] font-semibold text-gray-900">Risk overview</h2>
            <RiskDonut
              high={distribution.high}
              medium={distribution.medium}
              low={distribution.low}
            />
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-[17px] font-semibold text-gray-900">Top risk categories</h2>
            {categories.length === 0 ? (
              <p className="text-[14px] text-muted">No risky clauses flagged yet.</p>
            ) : (
              <div className="space-y-4">
                {categories.map(({ name, count }) => (
                  <div key={name}>
                    <div className="mb-1.5 flex justify-between text-[13px]">
                      <span className="text-gray-900">{name}</span>
                      <span className="text-muted">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${(count / maxCategory) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-2 text-[17px] font-semibold text-gray-900">Quick action</h2>
            <p className="mb-4 text-[14px] leading-relaxed text-muted">
              Generate a negotiation email for your client based on the issues we found.
            </p>
            {hasNegotiationAccess && latestHighRisk ? (
              <ButtonPrimary
                href={`/review?id=${latestHighRisk.id}`}
                className="w-full gap-2 py-3 text-[14px]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Generate negotiation email
              </ButtonPrimary>
            ) : (
              <NegotiationUpsell compact />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
