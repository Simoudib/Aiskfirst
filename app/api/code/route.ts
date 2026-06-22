import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PLANS } from '@/lib/stripe'

/**
 * GET /api/code?session_id=cs_xxx
 * Returns the access code for a completed checkout session.
 * Polls every ~2s on the client to handle webhook latency.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('access_code, plan, access_until, email')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error || !data) {
    // Webhook may not have fired yet — client should retry
    return NextResponse.json({ pending: true }, { status: 202 })
  }

  const planConfig = PLANS[data.plan ?? '']

  return NextResponse.json({
    code: data.access_code,
    plan: planConfig?.name ?? data.plan,
    months: planConfig?.months ?? null,
    access_until: data.access_until,
    email: data.email,
  })
}
