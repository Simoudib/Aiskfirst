import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PLANS } from '@/lib/stripe'

/**
 * GET /api/lookup?code=XXXXXXXXXXXXXXXXXXXXXXXX
 * Admin route — looks up a subscriber by their access code.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.trim()

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('email, plan, paid, stripe_status, access_until, created_at')
    .eq('access_code', code)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false }, { status: 200 })
  }

  const planConfig = PLANS[data.plan ?? '']

  return NextResponse.json({
    valid: true,
    email: data.email ?? null,
    plan: planConfig?.name ?? data.plan ?? 'Unknown',
    months: planConfig?.months ?? null,
    paid: data.paid,
    stripe_status: data.stripe_status,
    access_until: data.access_until,
    purchased_at: data.created_at,
  })
}
