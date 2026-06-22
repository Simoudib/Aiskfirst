-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kfcihpvvcddznavtgfzo/sql/new

-- 1. Allow email to be NULL (customers from shareable links may not have email in session)
ALTER TABLE public.subscribers
  ALTER COLUMN email DROP NOT NULL;

-- 2. Remove the old plan check constraint (it only allowed free/starter/pro/scale,
--    but your app uses 1m / 3m / 6m / 12m as plan keys)
ALTER TABLE public.subscribers
  DROP CONSTRAINT IF EXISTS subscribers_plan_check;

-- 3. Make sure stripe_session_id has a UNIQUE constraint (needed for upsert onConflict)
--    This is already in the schema but run this if the table was created before it was added
ALTER TABLE public.subscribers
  ADD CONSTRAINT IF NOT EXISTS subscribers_stripe_session_id_key UNIQUE (stripe_session_id);

-- Verify the table looks right:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns
-- WHERE table_name = 'subscribers' ORDER BY ordinal_position;
