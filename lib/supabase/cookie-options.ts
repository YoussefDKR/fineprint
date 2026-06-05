import type { CookieOptions } from '@supabase/ssr';

/** Keep sessions across browser restarts (Supabase default is ~400 days). */
export const supabaseCookieOptions: CookieOptions = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 400 * 24 * 60 * 60,
};
