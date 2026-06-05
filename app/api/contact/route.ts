import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const CONTACT_TO = 'admin@crosstalent.io';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Contact form is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string'
      ? body.email.trim()
      : '';
  const message =
    typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
      ? body.message.trim()
      : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: 'Please enter a message of at least 10 characters.' },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) {
    return NextResponse.json(
      { error: 'Contact form is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Fineprint contact — ${email}`,
      text: `Reply-to: ${email}\n\n${message}`,
    });

    if (error) {
      console.error('Resend contact error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}
