import type { Contract, Clause, RiskLevel } from '@/types';

export function formatDashboardDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function inferContractType(fileName: string, summary?: string | null): string {
  const text = `${fileName} ${summary ?? ''}`.toLowerCase();
  if (text.includes('nda') || text.includes('non-disclosure')) return 'NDA';
  if (text.includes('msa') || text.includes('master service')) return 'MSA';
  if (text.includes('sow') || text.includes('statement of work')) return 'SOW';
  return 'Agreement';
}

export function contractDisplayName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
}

export function riskScoreNumber(clauses: Clause[] | null): number | null {
  if (!clauses?.length) return null;
  const weights: Record<RiskLevel, number> = { high: 25, medium: 55, low: 88 };
  const avg =
    clauses.reduce((sum, c) => sum + weights[c.risk], 0) / clauses.length;
  return Math.round(avg);
}

export function countRiskyClauses(contracts: Contract[]): number {
  return contracts.reduce((sum, c) => {
    if (!c.clauses) return sum;
    return sum + c.clauses.filter((cl) => cl.risk !== 'low').length;
  }, 0);
}

export function riskDistribution(contracts: Contract[]) {
  const analyzed = contracts.filter((c) => c.status === 'analyzed' && c.overall_risk);
  return {
    high: analyzed.filter((c) => c.overall_risk === 'high').length,
    medium: analyzed.filter((c) => c.overall_risk === 'medium').length,
    low: analyzed.filter((c) => c.overall_risk === 'low').length,
    total: analyzed.length,
  };
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Payment terms': ['payment', 'invoice', 'fee', 'compensation', 'net-'],
  Liability: ['liability', 'indemn', 'damages', 'warranty'],
  Termination: ['terminat', 'cancel', 'notice period'],
  'IP & ownership': ['intellectual', 'ownership', 'copyright', 'ip '],
  Confidentiality: ['confidential', 'non-disclosure', 'nda'],
};

export function topRiskCategories(contracts: Contract[], limit = 4) {
  const counts = new Map<string, number>();

  for (const contract of contracts) {
    if (!contract.clauses) continue;
    for (const clause of contract.clauses) {
      if (clause.risk === 'low') continue;
      const haystack = `${clause.title} ${clause.reason}`.toLowerCase();
      let matched = false;
      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((k) => haystack.includes(k))) {
          counts.set(category, (counts.get(category) ?? 0) + 1);
          matched = true;
          break;
        }
      }
      if (!matched) {
        counts.set('Other clauses', (counts.get('Other clauses') ?? 0) + 1);
      }
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function isInMonth(dateString: string, year: number, month: number) {
  const d = new Date(dateString);
  return d.getFullYear() === year && d.getMonth() === month;
}

export function monthOverMonthLabel(
  contracts: Contract[],
  predicate: (c: Contract) => boolean,
): string | null {
  const now = new Date();
  const thisMonth = contracts.filter(
    (c) => predicate(c) && isInMonth(c.created_at, now.getFullYear(), now.getMonth()),
  ).length;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = contracts.filter(
    (c) =>
      predicate(c) &&
      isInMonth(c.created_at, prev.getFullYear(), prev.getMonth()),
  ).length;

  if (lastMonth === 0 && thisMonth === 0) return null;
  if (lastMonth === 0) return `${thisMonth} this month`;
  const delta = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta}% from last month`;
}
