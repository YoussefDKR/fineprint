import { NextResponse, type NextRequest } from 'next/server';
import { WAITLIST_ONLY } from '@/lib/app-mode';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = new Set(['/', '/contact', '/privacy', '/terms']);

const PUBLIC_API_PREFIXES = ['/api/waitlist', '/api/contact'];

function isPublicWaitlistPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function waitlistOnlyResponse(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicWaitlistPath(pathname)) {
    return NextResponse.next({ request });
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'Fineprint is in private beta. Join the waitlist on our homepage.' },
      { status: 503 },
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}

export async function handleRequest(request: NextRequest) {
  if (WAITLIST_ONLY) {
    return waitlistOnlyResponse(request);
  }

  return updateSession(request);
}
