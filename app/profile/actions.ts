'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfileName(formData: FormData) {
  const fullName = (formData.get('fullName') as string)?.trim();
  if (!fullName) return { error: 'Name is required' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, display_name: fullName },
  });

  if (error) return { error: error.message };
  revalidatePath('/profile');
  revalidatePath('/dashboard');
  return { message: 'Name updated' };
}

export async function updateProfileEmail(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  if (!email) return { error: 'Email is required' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) return { error: error.message };
  return {
    message: 'Check your inbox to confirm your new email address.',
  };
}

export async function updateProfilePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirm = formData.get('confirmPassword') as string;

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { message: 'Password updated' };
}

export async function updateAvatarUrl(avatarUrl: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (error) return { error: error.message };
  revalidatePath('/profile');
  return { message: 'Profile photo updated' };
}
