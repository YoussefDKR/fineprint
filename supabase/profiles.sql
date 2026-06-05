-- Run in Supabase SQL Editor

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  credit_balance integer not null default 0 check (credit_balance >= 0),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

alter table public.contracts
  add column if not exists credit_consumed boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for existing users
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Atomic credit consumption (returns false if insufficient credits)
create or replace function public.consume_review_credit(p_user_id uuid, p_contract_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_balance integer;
  v_already_consumed boolean;
begin
  select credit_consumed into v_already_consumed
  from public.contracts
  where id = p_contract_id and user_id = p_user_id;

  if not found then
    return false;
  end if;

  if v_already_consumed then
    return true;
  end if;

  select plan, credit_balance into v_plan, v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    return false;
  end if;

  if v_plan = 'pro' then
    update public.contracts
    set credit_consumed = true
    where id = p_contract_id and user_id = p_user_id;
    return true;
  end if;

  if v_balance <= 0 then
    return false;
  end if;

  update public.profiles
  set credit_balance = credit_balance - 1,
      updated_at = now()
  where id = p_user_id;

  update public.contracts
  set credit_consumed = true
  where id = p_contract_id and user_id = p_user_id;

  return true;
end;
$$;

-- Add credits after purchase
create or replace function public.add_review_credits(p_user_id uuid, p_amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'Credit amount must be positive';
  end if;

  insert into public.profiles (id, credit_balance)
  values (p_user_id, p_amount)
  on conflict (id) do update
  set credit_balance = public.profiles.credit_balance + p_amount,
      updated_at = now()
  returning credit_balance into v_balance;

  return v_balance;
end;
$$;

-- Set Pro subscription status
create or replace function public.set_user_pro_plan(p_user_id uuid, p_is_pro boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan)
  values (p_user_id, case when p_is_pro then 'pro' else 'free' end)
  on conflict (id) do update
  set plan = case when p_is_pro then 'pro' else 'free' end,
      updated_at = now();
end;
$$;
