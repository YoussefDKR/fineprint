function IssueRow({
  title,
  risk,
  desc,
  question,
}: {
  title: string;
  risk: 'high' | 'medium';
  desc: string;
  question: string;
}) {
  const isHigh = risk === 'high';
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-gray-900">{title}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isHigh ? 'bg-[#FCEBEB] text-[#A32D2D]' : 'bg-[#FAEEDA] text-[#854F0B]'
          }`}
        >
          {isHigh ? 'High risk' : 'Medium risk'}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-muted">{desc}</p>
      <p className="mt-2 text-[11px] font-medium text-brand">Suggested question</p>
      <p className="mt-0.5 text-[12px] text-gray-700">{question}</p>
    </div>
  );
}

export default function ProductPreview() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.12)]">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* PDF panel */}
        <div className="border-b border-border bg-canvas p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-muted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-gray-900">Freelance Agreement.pdf</span>
          </div>
          <div className="space-y-3 rounded-xl bg-white p-4 text-[11px] leading-relaxed text-muted">
            <p>
              <span className="font-medium text-gray-800">1. Services.</span> Contractor shall
              perform design and development services as described in applicable Statements of Work…
            </p>
            <p>
              <span className="font-medium text-gray-800">2. Payment.</span> Client shall pay
              Contractor within ninety (90) days of invoice receipt…
            </p>
            <p className="rounded-lg bg-[#FCEBEB]/60 px-2 py-1.5 text-[#A32D2D]">
              <span className="font-medium">3. Termination.</span> Client may terminate this
              Agreement at any time, for any reason, without notice or liability…
            </p>
            <p>
              <span className="font-medium text-gray-800">4. Indemnification.</span> Contractor
              shall defend and indemnify Client against all claims arising from the work…
            </p>
          </div>
        </div>

        {/* Analysis panel */}
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-3">
            {['Analysis', 'Plain English Summary', 'Negotiation Email'].map((tab, i) => (
              <span
                key={tab}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
                  i === 0 ? 'bg-[#EAF3DE] text-brand' : 'text-muted'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e8e8e6" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#E24B4A"
                  strokeWidth="3"
                  strokeDasharray="59 94"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-gray-900">
                82
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">Risk score</p>
              <p className="text-[12px] text-[#A32D2D]">High risk — review before signing</p>
            </div>
          </div>

          <div className="space-y-3">
            <IssueRow
              title="Unlimited cancellation by client"
              risk="high"
              desc="The client can end the contract anytime without paying for work in progress."
              question="Can we add a 30-day notice period and payment for work completed?"
            />
            <IssueRow
              title="Net 90 payment terms"
              risk="medium"
              desc="You may wait up to three months after invoicing to get paid."
              question="Can payment terms be changed to Net 30?"
            />
            <IssueRow
              title="Indemnity clause"
              risk="high"
              desc="You could be liable for claims beyond your control."
              question="Can indemnification be limited to your own negligence?"
            />
          </div>
          <p className="mt-3 text-center text-[12px] text-muted">Show 3 more issues ↓</p>
        </div>
      </div>
    </div>
  );
}
