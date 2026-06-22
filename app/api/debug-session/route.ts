import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { stripe } from '@/lib/stripe'

/**
 * TEMPORARY DEBUG ENDPOINT — remove after fixing
 * GET /api/debug-session?session_id=cs_xxx
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  // 1. Check what's in Supabase
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  // 2. Fetch the Stripe session directly
  let stripeSession = null
  let stripeError = null
  try {
    stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    })
  } catch (e) {
    stripeError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    supabase: {
      found: !!data,
      data: data ?? null,
      error: error?.message ?? null,
    },
    stripe: {
      found: !!stripeSession,
      session_id: stripeSession?.id ?? null,
      email: stripeSession?.customer_email ?? stripeSession?.customer_details?.email ?? null,
      payment_status: stripeSession?.payment_status ?? null,
      metadata: stripeSession?.metadata ?? null,
      error: stripeError,
    },
    env: {
      has_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
      has_stripe_key: !!process.env.STRIPE_SECRET_KEY,
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.slice(0, 7) ?? 'missing',
      webhook_secret_prefix: process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 10) ?? 'missing',
    },
  })
}
