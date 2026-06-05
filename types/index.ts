export type RiskLevel = 'low' | 'medium' | 'high';

export type Clause = {
  title: string;
  original_text: string;
  plain_english: string;
  risk: RiskLevel;
  reason: string;
  suggestion: string;
};

export type ContractAnalysis = {
  summary: string;
  overall_risk: RiskLevel;
  clauses: Clause[];
  negotiation_email: string;
};

export type Contract = {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  status: 'pending' | 'analyzed' | 'error';
  overall_risk: RiskLevel | null;
  summary: string | null;
  clauses: Clause[] | null;
  negotiation_email: string | null;
  created_at: string;
};
