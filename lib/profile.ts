export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
};

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  barColor: string;
} {
  if (!password) {
    return { score: 0, label: '', barColor: '#e8e8e6' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 25, label: 'Weak', barColor: '#E24B4A' };
  if (score === 3) return { score: 50, label: 'Fair', barColor: '#EF9F27' };
  if (score === 4) return { score: 75, label: 'Good', barColor: '#639922' };
  return { score: 100, label: 'Strong', barColor: '#166534' };
}
