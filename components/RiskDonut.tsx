type RiskDonutProps = {
  high: number;
  medium: number;
  low: number;
};

export default function RiskDonut({ high, medium, low }: RiskDonutProps) {
  const total = high + medium + low;
  const displayTotal = total || 0;

  if (displayTotal === 0) {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-border bg-canvas">
          <div className="text-center">
            <p className="text-[28px] font-semibold text-gray-900">0</p>
            <p className="text-[12px] text-muted">Total</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] text-muted">No contracts analyzed yet</p>
      </div>
    );
  }

  const highPct = (high / total) * 100;
  const mediumPct = (medium / total) * 100;
  const lowPct = (low / total) * 100;

  const gradient = `conic-gradient(
    #E24B4A 0% ${highPct}%,
    #EF9F27 ${highPct}% ${highPct + mediumPct}%,
    #639922 ${highPct + mediumPct}% 100%
  )`;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-36 w-36 items-center justify-center rounded-full"
        style={{ background: gradient }}
      >
        <div className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full bg-white">
          <p className="text-[28px] font-semibold text-gray-900">{displayTotal}</p>
          <p className="text-[12px] text-muted">Total</p>
        </div>
      </div>
      <div className="mt-5 w-full space-y-2">
        <LegendRow color="#E24B4A" label="High" count={high} pct={highPct} />
        <LegendRow color="#EF9F27" label="Medium" count={medium} pct={mediumPct} />
        <LegendRow color="#639922" label="Low" count={low} pct={lowPct} />
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  count,
  pct,
}: {
  color: string;
  label: string;
  count: number;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="flex-1 text-muted">{label}</span>
      <span className="font-medium text-gray-900">{count}</span>
      <span className="w-10 text-right text-muted">{Math.round(pct)}%</span>
    </div>
  );
}
