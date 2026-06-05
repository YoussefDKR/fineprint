import { ButtonPrimary } from '@/components/ui/Button';

export default function NegotiationUpsell({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-brand/20 bg-[#EAF3DE]/30 ${
        compact ? 'p-5' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-[16px] font-semibold text-gray-900">
            Negotiation emails — included with paid reviews
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            Upgrade to buy reviews or Pro to generate polished emails you can send to
            clients requesting contract changes.
          </p>
          <ButtonPrimary href="/billing" className="mt-4 px-5 py-2.5 text-[14px]">
            View plans
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
