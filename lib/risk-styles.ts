import type { RiskLevel } from '@/types';

export const riskStyles: Record<
  RiskLevel,
  {
    label: string;
    pillBg: string;
    pillText: string;
    border: string;
    dot: string;
    iconBg: string;
    reasonBg: string;
    reasonText: string;
  }
> = {
  high: {
    label: 'High risk',
    pillBg: 'bg-[#FCEBEB]',
    pillText: 'text-[#A32D2D]',
    border: 'border-l-[#E24B4A]',
    dot: 'bg-[#E24B4A]',
    iconBg: 'bg-[#FCEBEB] text-[#A32D2D]',
    reasonBg: 'bg-[#FCEBEB]',
    reasonText: 'text-[#A32D2D]',
  },
  medium: {
    label: 'Medium risk',
    pillBg: 'bg-[#FAEEDA]',
    pillText: 'text-[#854F0B]',
    border: 'border-l-[#EF9F27]',
    dot: 'bg-[#EF9F27]',
    iconBg: 'bg-[#FAEEDA] text-[#854F0B]',
    reasonBg: 'bg-[#FAEEDA]',
    reasonText: 'text-[#854F0B]',
  },
  low: {
    label: 'Low risk',
    pillBg: 'bg-[#EAF3DE]',
    pillText: 'text-[#3B6D11]',
    border: 'border-l-[#639922]',
    dot: 'bg-[#639922]',
    iconBg: 'bg-[#EAF3DE] text-[#3B6D11]',
    reasonBg: 'bg-[#EAF3DE]',
    reasonText: 'text-[#3B6D11]',
  },
};
