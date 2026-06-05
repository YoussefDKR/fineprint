# Fineprint

AI legal copilot for freelancers. Upload a client contract PDF and get a plain-English summary, traffic-light risk scores per clause, and a negotiation email.

## Stack

- Next.js 14 App Router
- Supabase (auth, storage, database)
- Claude API (`claude-sonnet-4-20250514`)
- Tailwind CSS

## Setup

1. Copy `.env.example` to `.env.local` and fill in your keys.
2. Run the Supabase SQL and storage setup (see project docs).
3. Install and run:

```bash
npm install
npm run dev
```

App runs at [http://localhost:3002](http://localhost:3002).

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL.
5. Update Supabase Auth redirect URLs to include your Vercel domain.
