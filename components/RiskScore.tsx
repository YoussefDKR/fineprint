import type { RiskLevel } from '@/types';

type RiskScoreProps = {
  risk: RiskLevel;
  size?: 'sm' | 'lg';
};

const config: Record<
  RiskLevel,
  { label: string; bg: string; text: string; dot: string }
> = {
  low: {
    label: 'Low Risk',
    bg: 'bg-green-50',
    text: 'text-risk-low',
    dot: 'bg-risk-low',
  },
  medium: {
    label: 'Medium Risk',
    bg: 'bg-amber-50',
    text: 'text-risk-medium',
    dot: 'bg-risk-medium',
  },
  high: {
    label: 'High Risk',
    bg: 'bg-red-50',
    text: 'text-risk-high',
    dot: 'bg-risk-high',
  },
};

export default function RiskScore({ risk, size = 'lg' }: RiskScoreProps) {
  const { label, bg, text, dot } = config[risk];

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-xl px-5 py-3 ${bg}`}
    >
      <span className={`h-3 w-3 rounded-full ${dot}`} />
      <span className={`text-lg font-semibold ${text}`}>{label}</span>
    </div>
  );
}
