import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('waitlist').insert({ email });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { message: "You're already on the list — we'll be in touch soon." },
        { status: 200 },
      );
    }

    console.error('Waitlist insert error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "You're on the list — we'll email you when we launch." });
}
