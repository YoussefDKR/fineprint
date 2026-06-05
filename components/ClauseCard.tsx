import type { Clause } from '@/types';

type ClauseCardProps = {
  clause: Clause;
};

const riskStyles = {
  high: {
    border: 'border-l-risk-high',
    badge: 'bg-red-50 text-risk-high',
    dot: 'bg-risk-high',
  },
  medium: {
    border: 'border-l-risk-medium',
    badge: 'bg-amber-50 text-risk-medium',
    dot: 'bg-risk-medium',
  },
  low: {
    border: 'border-l-risk-low',
    badge: 'bg-green-50 text-risk-low',
    dot: 'bg-risk-low',
  },
};

const riskLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function ClauseCard({ clause }: ClauseCardProps) {
  const styles = riskStyles[clause.risk];

  return (
    <article
      className={`rounded-xl border border-gray-200 border-l-4 bg-white p-6 shadow-sm ${styles.border}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">{clause.title}</h3>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          {riskLabels[clause.risk]} risk
        </span>
      </div>

      {clause.original_text && (
        <blockquote className="mb-4 border-l-2 border-gray-200 pl-4 text-sm italic text-gray-500">
          &ldquo;{clause.original_text}&rdquo;
        </blockquote>
      )}

      <p className="mb-4 text-gray-800 leading-relaxed">{clause.plain_english}</p>

      {clause.risk !== 'low' && clause.reason && (
        <div className="mb-3 rounded-lg bg-gray-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Why it matters
          </p>
          <p className="text-sm text-gray-700">{clause.reason}</p>
        </div>
      )}

      {clause.risk !== 'low' && clause.suggestion && (
        <div className="rounded-lg bg-navy/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy">
            Suggested ask
          </p>
          <p className="text-sm text-gray-700">{clause.suggestion}</p>
        </div>
      )}
    </article>
  );
}
