import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeContract } from '@/lib/claude';
import { consumeReviewCredit, getUserBilling, NO_CREDITS_ERROR } from '@/lib/credits';

export async function POST(request: Request) {
  let contractId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = body as {
      contractId: string;
      extractedText: string;
    };
    contractId = parsed.contractId;
    const { extractedText } = parsed;

    if (!contractId || !extractedText) {
      return NextResponse.json(
        { error: 'contractId and extractedText are required' },
        { status: 400 },
      );
    }

    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const billing = await getUserBilling(user.id);
    if (!billing.canReview && !contract.credit_consumed) {
      return NextResponse.json(
        { error: NO_CREDITS_ERROR, code: 'NO_CREDITS' },
        { status: 402 },
      );
    }

    const includeEmail = billing.hasNegotiationAccess;

    const consumed = await consumeReviewCredit(user.id, contractId);
    if (!consumed) {
      return NextResponse.json(
        { error: NO_CREDITS_ERROR, code: 'NO_CREDITS' },
        { status: 402 },
      );
    }

    const analysis = await analyzeContract(extractedText, {
      includeNegotiationEmail: includeEmail,
    });

    const { data: updated, error: updateError } = await supabase
      .from('contracts')
      .update({
        status: 'analyzed',
        overall_risk: analysis.overall_risk,
        summary: analysis.summary,
        clauses: analysis.clauses,
        negotiation_email: includeEmail ? analysis.negotiation_email : null,
      })
      .eq('id', contractId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    const updatedBilling = await getUserBilling(user.id);

    return NextResponse.json({
      contract: updated,
      analysis,
      creditBalance: updatedBilling.creditBalance,
    });
  } catch (error) {
    console.error('Analyze error:', error);

    if (contractId) {
      const supabase = await createClient();
      await supabase.from('contracts').update({ status: 'error' }).eq('id', contractId);
    }

    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
