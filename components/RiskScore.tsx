import type { RiskLevel } from '@/types';
import { riskStyles } from '@/lib/risk-styles';

type RiskScoreProps = {
  risk: RiskLevel;
  size?: 'sm' | 'lg';
};

export default function RiskScore({ risk, size = 'lg' }: RiskScoreProps) {
  const { label, pillBg, pillText, dot } = riskStyles[risk];

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium ${pillBg} ${pillText}`}
      >
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium ${pillBg} ${pillText}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
