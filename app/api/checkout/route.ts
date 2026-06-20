import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()

    const planConfig = PLANS[plan]
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!planConfig.priceId || planConfig.priceId.startsWith('price_...')) {
      return NextResponse.json(
        { error: 'This plan is not configured yet. Price ID is missing in environment variables.' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get('host')}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      metadata: { plan },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
