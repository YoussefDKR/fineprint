import type { Clause } from '@/types';
import { riskStyles } from '@/lib/risk-styles';
import RiskScore from './RiskScore';

type ClauseCardProps = {
  clause: Clause;
};

export default function ClauseCard({ clause }: ClauseCardProps) {
  const styles = riskStyles[clause.risk];

  return (
    <article
      className={`card overflow-hidden border-l-[3px] rounded-l-none ${styles.border}`}
    >
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
            <h3 className="text-[16px] font-medium text-gray-900">
              {clause.title}
            </h3>
          </div>
          <RiskScore risk={clause.risk} size="sm" />
        </div>

        {clause.original_text && (
          <p className="mb-2 text-[14px] italic text-muted">
            &ldquo;{clause.original_text}&rdquo;
          </p>
        )}

        <p className="text-[16px] leading-relaxed text-muted">
          {clause.plain_english}
        </p>

        {clause.risk !== 'low' && clause.reason && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-[15px] ${styles.reasonBg} ${styles.reasonText}`}
          >
            {clause.reason}
          </div>
        )}

        {clause.risk !== 'low' && clause.suggestion && (
          <div className="mt-3 rounded-lg bg-[#EAF3DE] px-4 py-3 text-[15px] text-[#3B6D11]">
            {clause.suggestion}
          </div>
        )}
      </div>
    </article>
  );
}

export function ClauseCardPreview() {
  return (
    <article className="card overflow-hidden border-l-[3px] rounded-l-none border-l-[#E24B4A]">
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E24B4A]" />
          <h3 className="text-[16px] font-medium text-gray-900">
            Intellectual property ownership
          </h3>
        </div>
        <p className="text-[16px] leading-relaxed text-muted">
          All work you create becomes the client&apos;s property immediately. You
          can&apos;t even show it in your portfolio.
        </p>
        <div className="mt-4 rounded-lg bg-[#FCEBEB] px-4 py-3 text-[15px] text-[#A32D2D]">
          High risk — you lose all rights to your own work
        </div>
        <div className="mt-3 rounded-lg bg-[#EAF3DE] px-4 py-3 text-[15px] text-[#3B6D11]">
          Ask to retain portfolio rights while client keeps commercial rights
        </div>
      </div>
    </article>
  );
}
