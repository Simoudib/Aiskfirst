import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Stripe from 'stripe'
import crypto from 'crypto'

/** Generates a cryptographically random 24-character alphanumeric code */
function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.randomBytes(24)
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join('')
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_email ?? session.customer_details?.email
      const planKey = session.metadata?.plan ?? '1m'
      const planConfig = PLANS[planKey]
      const months = planConfig?.months ?? 1

      // Calculate access expiry from purchase date
      const accessUntil = new Date()
      accessUntil.setMonth(accessUntil.getMonth() + months)

      // Generate unique access code
      const accessCode = generateAccessCode()

      if (email) {
        await supabaseAdmin.from('subscribers').upsert(
          {
            email: email.toLowerCase(),
            plan: planKey,
            paid: true,
            stripe_customer_id: session.customer as string | null,
            stripe_session_id: session.id,
            stripe_status: 'active',
            access_until: accessUntil.toISOString(),
            access_code: accessCode,
          },
          { onConflict: 'email' }
        )
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const receiptEmail = charge.receipt_email ?? charge.billing_details?.email
      if (receiptEmail) {
        await supabaseAdmin
          .from('subscribers')
          .update({ stripe_status: 'refunded', paid: false })
          .eq('email', receiptEmail.toLowerCase())
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
