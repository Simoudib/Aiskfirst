import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export const PLANS: Record<string, { priceId: string; name: string; amount: number; months: number }> = {
  '1m': {
    priceId: process.env.STRIPE_PRICE_1M!,
    name: '1 Month Access',
    amount: 1900,
    months: 1,
  },
  '3m': {
    priceId: process.env.STRIPE_PRICE_3M!,
    name: '3 Months Access',
    amount: 4900,
    months: 3,
  },
  '6m': {
    priceId: process.env.STRIPE_PRICE_6M!,
    name: '6 Months Access',
    amount: 8900,
    months: 6,
  },
  '12m': {
    priceId: process.env.STRIPE_PRICE_12M!,
    name: '12 Months Access',
    amount: 14900,
    months: 12,
  },
}
