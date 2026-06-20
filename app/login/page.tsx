'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '380px',
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: '16px', padding: '40px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--accent)', marginBottom: '8px', letterSpacing: '.1em', textTransform: 'uppercase' }}>Admin</p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>Sign in</h1>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="email-input"
            style={{ width: '100%' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="email-input"
            style={{ width: '100%' }}
          />
          {error && (
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
