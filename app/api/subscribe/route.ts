import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { email, source } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('subscribers')
    .upsert(
      { email: email.toLowerCase().trim(), plan: 'free', source: source ?? null },
      { onConflict: 'email', ignoreDuplicates: true }
    )

  if (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
