'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Subscriber = {
  id: string
  email: string
  plan: string | null
  paid: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_status: string | null
  source: string | null
  created_at: string
}

type Stats = { total: number; paid: number; free: number }

const PLAN_COLORS: Record<string, string> = {
  free: '#7a7a8a',
  starter: '#60b4f0',
  pro: '#e8ff5a',
  scale: '#5affb0',
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: '11px',
      padding: '2px 8px', borderRadius: '4px',
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: `1px solid ${accent ? 'rgba(232,255,90,0.3)' : 'var(--border)'}`,
      borderRadius: '12px', padding: '20px 24px',
    }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</p>
    </div>
  )
}

export default function AdminClient({ subscribers, stats }: { subscribers: Subscriber[]; stats: Stats }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all')
  const [search, setSearch] = useState('')

  const filtered = subscribers.filter(s => {
    const matchFilter = filter === 'all' || (filter === 'paid' ? s.paid : !s.paid)
    const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function exportCSV() {
    const header = 'Email,Plan,Paid,Stripe Customer ID,Source,Signed Up\n'
    const rows = filtered.map(s =>
      `${s.email},${s.plan ?? 'free'},${s.paid},${s.stripe_customer_id ?? ''},${s.source ?? ''},${new Date(s.created_at).toLocaleDateString()}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aiskfirst-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>AskFirst</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Subscribers</h1>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)',
            background: 'transparent', border: '1px solid var(--border2)',
            borderRadius: '6px', padding: '8px 14px', cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <StatCard label="Total subscribers" value={stats.total} />
        <StatCard label="Paid customers" value={stats.paid} accent />
        <StatCard label="Free / waitlist" value={stats.free} />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="email-input"
          style={{ width: '240px' }}
        />
        {(['all', 'paid', 'free'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--mono)', fontSize: '12px', padding: '8px 14px',
              borderRadius: '6px', cursor: 'pointer', border: '1px solid',
              borderColor: filter === f ? 'rgba(232,255,90,0.5)' : 'var(--border2)',
              background: filter === f ? 'rgba(232,255,90,0.08)' : 'transparent',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          onClick={exportCSV}
          style={{
            marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '12px',
            padding: '8px 14px', borderRadius: '6px', cursor: 'pointer',
            background: 'var(--accent)', color: '#0a0a0b', border: 'none', fontWeight: 500,
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Email', 'Plan', 'Status', 'Source', 'Signed up'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'var(--mono)', fontSize: '11px',
                  color: 'var(--muted)', fontWeight: 500,
                  letterSpacing: '.05em', textTransform: 'uppercase',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>
                  No subscribers yet.
                </td>
              </tr>
            ) : filtered.map((s, i) => (
              <tr
                key={s.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '13px 16px', fontFamily: 'var(--mono)', fontSize: '13px' }}>{s.email}</td>
                <td style={{ padding: '13px 16px' }}>
                  <Badge label={s.plan ?? 'free'} color={PLAN_COLORS[s.plan ?? 'free'] ?? '#7a7a8a'} />
                </td>
                <td style={{ padding: '13px 16px' }}>
                  {s.paid
                    ? <Badge label="paid" color="#5affb0" />
                    : <Badge label="waitlist" color="#7a7a8a" />
                  }
                </td>
                <td style={{ padding: '13px 16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
                  {s.source ?? '—'}
                </td>
                <td style={{ padding: '13px 16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
                  {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginTop: '12px' }}>
        {filtered.length} of {subscribers.length} subscribers shown
      </p>
    </div>
  )
}
