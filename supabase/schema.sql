-- Run this in your Supabase SQL editor

create table if not exists public.subscribers (
  id                      uuid primary key default gen_random_uuid(),
  email                   text unique not null,
  plan                    text check (plan in ('free', 'starter', 'pro', 'scale')),
  paid                    boolean not null default false,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  stripe_status           text,
  source                  text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_subscribers_updated
  before update on public.subscribers
  for each row execute procedure public.handle_updated_at();

-- Only your service role can read/write (no public access)
alter table public.subscribers enable row level security;

create policy "Service role full access"
  on public.subscribers
  using (auth.role() = 'service_role');
