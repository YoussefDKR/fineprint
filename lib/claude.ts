import type { ContractAnalysis } from '@/types';

const SYSTEM_PROMPT = `You are a legal assistant specialized in freelance and agency contracts. Your job is to analyze contracts and help freelancers understand what they are agreeing to. You are a risk assessment and plain-language translation tool, NOT a lawyer. Always frame your analysis as "things to be aware of" not "legal advice." Respond ONLY with valid JSON. No text outside the JSON object.`;

function buildUserPrompt(contractText: string): string {
  return `Analyze this freelance/agency contract and return a JSON object with this exact structure:
{
  "summary": "2-3 sentence plain-English overview of what this contract is about",
  "overall_risk": "low" | "medium" | "high",
  "clauses": [
    {
      "title": "clause name",
      "original_text": "exact text from contract, max 2 sentences",
      "plain_english": "what this means in simple language",
      "risk": "low" | "medium" | "high",
      "reason": "why it's risky (empty string if low)",
      "suggestion": "what to ask for instead (empty string if low)"
    }
  ],
  "negotiation_email": "polite firm email requesting changes to risky clauses, use [CLIENT NAME] and [YOUR NAME] as placeholders, 150-200 words"
}

Flag as high risk: IP ownership transferred to client, net-60+ payment, unlimited revisions, broad indemnification, non-compete clauses.
Flag as medium risk: net-30 to net-59 payment, limited liability caps, vague scope of work.
Flag as low risk: standard confidentiality, reasonable termination.
Only include clauses that actually appear in the contract.

CONTRACT TEXT: ${contractText}`;
}

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const truncatedText = contractText.slice(0, 100_000);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(truncatedText),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content || typeof content !== 'string') {
    throw new Error('Unexpected response from Claude API');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as ContractAnalysis;
  return parsed;
}
