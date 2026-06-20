import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'

// Maps plan key → sub parameter expected by the reseller API
const PLAN_TO_SUB: Record<string, number> = {
  '1m':  1,
  '3m':  3,
  '6m':  6,
  '12m': 12,
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  // Verify the Stripe session is actually paid
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
  }

  const plan = session.metadata?.plan
  if (!plan || !PLANS[plan]) {
    return NextResponse.json({ error: 'Unknown plan in session metadata' }, { status: 400 })
  }

  const sub = PLAN_TO_SUB[plan]
  const apiKey = process.env.RESELLER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Reseller API key not configured' }, { status: 500 })
  }

  // Call the reseller API
  const url = new URL('https://8k.cms-only.ru/api/api.php')
  url.searchParams.set('action', 'new')
  url.searchParams.set('type', 'm3u')
  url.searchParams.set('sub', String(sub))
  url.searchParams.set('pack', '1')
  url.searchParams.set('api_key', apiKey)

  let resellerResponse: string
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })
    resellerResponse = await res.text()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to reach reseller API'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  return NextResponse.json({
    plan,
    months: PLANS[plan].months,
    result: resellerResponse,
  })
}
