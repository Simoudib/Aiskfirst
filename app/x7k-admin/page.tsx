'use client'

import { useState } from 'react'

type LookupResult = {
  valid: boolean
  email?: string | null
  plan?: string
  months?: number | null
  paid?: boolean
  stripe_status?: string
  access_until?: string | null
  purchased_at?: string
}

export default function AdminLookupPage() {
  const [inputCode, setInputCode] = useState('')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const code = inputCode.trim()
    if (!code) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch(`/api/lookup?code=${encodeURIComponent(code)}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Network error — could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(iso?: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="admin-root">
      <div className="admin-card">
        <div className="admin-header">
          <div className="admin-lock">🔐</div>
          <h1 className="admin-title">Code Lookup</h1>
          <p className="admin-subtitle">Paste an access code to verify and view subscriber details.</p>
        </div>

        <form className="admin-form" onSubmit={handleLookup}>
          <div className="admin-input-wrap">
            <input
              id="code-input"
              className="admin-input"
              type="text"
              placeholder="Paste 24-character code…"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              maxLength={32}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            id="lookup-btn"
            type="submit"
            className="admin-btn"
            disabled={loading || inputCode.trim().length === 0}
          >
            {loading ? (
              <span className="admin-spinner" />
            ) : (
              'Look Up'
            )}
          </button>
        </form>

        {error && (
          <div className="admin-result admin-result--error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {result && (
          <div className={`admin-result ${result.valid ? 'admin-result--valid' : 'admin-result--invalid'}`}>
            {!result.valid ? (
              <div className="admin-invalid">
                <span className="admin-badge admin-badge--invalid">❌ Invalid Code</span>
                <p className="admin-invalid-msg">No subscriber found with this code.</p>
              </div>
            ) : (
              <div className="admin-info">
                <div className="admin-status-row">
                  <span className="admin-badge admin-badge--valid">✅ Valid Code</span>
                  {result.paid && <span className="admin-badge admin-badge--paid">💳 Paid</span>}
                  {result.stripe_status && (
                    <span className={`admin-badge admin-badge--status ${result.stripe_status === 'active' ? 'admin-badge--active' : 'admin-badge--other'}`}>
                      {result.stripe_status}
                    </span>
                  )}
                </div>

                <div className="admin-grid">
                  <div className="admin-field">
                    <span className="admin-field-label">Email</span>
                    <span className="admin-field-value">{result.email ?? '—'}</span>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field-label">Plan</span>
                    <span className="admin-field-value">{result.plan ?? '—'}</span>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field-label">Duration</span>
                    <span className="admin-field-value">
                      {result.months ? `${result.months} Month${result.months > 1 ? 's' : ''}` : '—'}
                    </span>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field-label">Access Until</span>
                    <span className="admin-field-value">{formatDate(result.access_until)}</span>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field-label">Purchased At</span>
                    <span className="admin-field-value">{formatDate(result.purchased_at)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          min-height: 100vh;
          background: #0a0a14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 2rem 1rem;
        }

        .admin-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }
        .admin-lock { font-size: 2rem; }
        .admin-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
        }
        .admin-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .admin-input-wrap {
          position: relative;
        }
        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          color: #e0e7ff;
          font-size: 0.9rem;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
        }
        .admin-input::placeholder {
          color: rgba(255,255,255,0.2);
          font-family: 'Inter', sans-serif;
          letter-spacing: normal;
        }

        .admin-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
        }
        .admin-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }
        .admin-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Spinner */
        .admin-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Results */
        .admin-result {
          border-radius: 14px;
          padding: 1.25rem;
          animation: fadeUp 0.3s ease both;
        }
        .admin-result--error {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.25);
          color: #f87171;
          font-size: 0.85rem;
        }
        .admin-result--invalid {
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.2);
        }
        .admin-result--valid {
          background: rgba(34,211,102,0.05);
          border: 1px solid rgba(34,211,102,0.2);
        }

        .admin-invalid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .admin-invalid-msg {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
        }

        .admin-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .admin-status-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
        }
        .admin-badge--valid {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
        }
        .admin-badge--invalid {
          background: rgba(248,113,113,0.15);
          border: 1px solid rgba(248,113,113,0.3);
          color: #f87171;
        }
        .admin-badge--paid {
          background: rgba(250,204,21,0.1);
          border: 1px solid rgba(250,204,21,0.3);
          color: #facc15;
        }
        .admin-badge--active {
          background: rgba(34,211,238,0.1);
          border: 1px solid rgba(34,211,238,0.3);
          color: #22d3ee;
          text-transform: capitalize;
        }
        .admin-badge--other {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
          text-transform: capitalize;
        }

        .admin-grid {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .admin-field {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .admin-field:last-child { border-bottom: none; }
        .admin-field-label {
          color: rgba(255,255,255,0.35);
          font-size: 0.78rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .admin-field-value {
          color: #e0e7ff;
          font-size: 0.88rem;
          font-weight: 500;
          text-align: right;
          word-break: break-all;
        }
      `}</style>
    </div>
  )
}
