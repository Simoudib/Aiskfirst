import { supabaseAdmin } from '@/lib/supabase-admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{
          background: 'var(--bg2)', border: '1px solid rgba(255,90,90,0.3)',
          borderRadius: '12px', padding: '32px', maxWidth: '520px', width: '100%',
        }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#ff7070', marginBottom: '12px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Database error
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
            {error.message}
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
            Have you run the SQL schema? Go to your Supabase dashboard → SQL editor and run the contents of <strong>supabase/schema.sql</strong>.
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginTop: '12px' }}>
            Error code: {error.code}
          </p>
        </div>
      </div>
    )
  }

  const subscribers = data ?? []
  const total = subscribers.length
  const paid = subscribers.filter(s => s.paid).length
  const free = total - paid

  return <AdminClient subscribers={subscribers} stats={{ total, paid, free }} />
}
