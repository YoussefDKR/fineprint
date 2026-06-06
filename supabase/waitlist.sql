-- Run in Supabase SQL Editor

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- No public policies: inserts go through the API using the service role key.
