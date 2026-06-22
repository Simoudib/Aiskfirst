import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'

/**
 * GET /api/checkout?plan=1m
 * Shareable direct-checkout link. Redirects to Stripe with no referrer
 * so the originating URL is never exposed to third parties.
 */
export async function GET(req: NextRequest) {
  try {
    const plan = req.nextUrl.searchParams.get('plan') ?? ''

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
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      // Always attribute these shareable links to Instagram ads.
      // no-referrer header hides the real source; metadata makes
      // Stripe always log "instagram" for payments from these links.
      metadata: {
        plan,
        utm_source: 'instagram',
        utm_medium: 'paid_social',
        utm_campaign: 'direct_link',
      },
      allow_promotion_codes: true,
    })

    // Redirect to Stripe with Referrer-Policy: no-referrer so the source
    // URL of this link is never transmitted to Stripe or any third party.
    return NextResponse.redirect(session.url!, {
      status: 307,
      headers: {
        'Referrer-Policy': 'no-referrer',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

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
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
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
