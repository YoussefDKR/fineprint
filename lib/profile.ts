export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
};

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: '', color: 'bg-border' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-[#E24B4A]' };
  if (score === 3) return { score: 50, label: 'Fair', color: 'bg-[#EF9F27]' };
  if (score === 4) return { score: 75, label: 'Good', color: 'bg-[#639922]' };
  return { score: 100, label: 'Strong', color: 'bg-brand' };
}
