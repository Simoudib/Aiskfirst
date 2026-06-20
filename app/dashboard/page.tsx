'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { icon: '⬡', label: 'Overview', active: true },
    { icon: '✦', label: 'Requests', active: false },
    { icon: '◈', label: 'Audit Log', active: false },
    { icon: '⚡', label: 'Integrations', active: false },
    { icon: '◎', label: 'API Keys', active: false },
    { icon: '◆', label: 'Settings', active: false },
  ]

  const stats = [
    { label: 'Total Requests', value: '—', sub: 'No data yet', accent: false },
    { label: 'Approved', value: '—', sub: 'No data yet', accent: true },
    { label: 'Denied', value: '—', sub: 'No data yet', accent: false },
    { label: 'Avg. Response Time', value: '—', sub: 'No data yet', accent: false },
  ]

  return (
    <div className="dash-root">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`dash-sidebar${sidebarOpen ? '' : ' dash-sidebar--closed'}`}>
        <div className="dash-sidebar-header">
          <a href="/" className="dash-logo-link">
            <img src="/logoaiskfirst.svg" alt="AskFirst" className="dash-logo" />
          </a>
          <button
            className="dash-sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`dash-nav-item${item.active ? ' dash-nav-item--active' : ''}`}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="dash-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          {sidebarOpen && (
            <div className="dash-user-pill">
              <div className="dash-user-avatar">
                {userEmail ? userEmail[0].toUpperCase() : '?'}
              </div>
              <div className="dash-user-info">
                <p className="dash-user-email">{userEmail ?? 'Loading…'}</p>
                <p className="dash-user-plan">Free plan</p>
              </div>
            </div>
          )}
          <button className="dash-signout-btn" onClick={handleSignOut} title="Sign out">
            <span>↩</span>
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <main className="dash-main">
        {/* Top bar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <p className="dash-topbar-label">Overview</p>
            <h1 className="dash-topbar-title">Dashboard</h1>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-env-badge">
              <span className="dash-env-dot" />
              sandbox
            </div>
            <a href="/dashboard" className="dash-new-btn">+ New request</a>
          </div>
        </header>

        {/* Stats row */}
        <section className="dash-stats-row">
          {stats.map(s => (
            <div key={s.label} className={`dash-stat-card${s.accent ? ' dash-stat-card--accent' : ''}`}>
              <p className="dash-stat-label">{s.label}</p>
              <p className="dash-stat-value">{s.value}</p>
              <p className="dash-stat-sub">{s.sub}</p>
            </div>
          ))}
        </section>

        {/* Two-column grid */}
        <div className="dash-grid">
          {/* Recent requests */}
          <section className="dash-panel">
            <div className="dash-panel-header">
              <p className="dash-panel-title">Recent Requests</p>
              <span className="dash-panel-badge">0</span>
            </div>
            <div className="dash-empty-state">
              <div className="dash-empty-icon">✦</div>
              <p className="dash-empty-title">No requests yet</p>
              <p className="dash-empty-sub">
                Make your first API call to see approval requests appear here in real time.
              </p>
              <a
                href="https://docs.aiskfirst.com"
                target="_blank"
                rel="noopener noreferrer"
                className="dash-empty-link"
              >
                Read the docs →
              </a>
            </div>
          </section>

          {/* Quick start */}
          <section className="dash-panel">
            <div className="dash-panel-header">
              <p className="dash-panel-title">Quick Start</p>
            </div>
            <div className="dash-quickstart">
              <div className="dash-qs-step">
                <div className="dash-qs-num">01</div>
                <div>
                  <p className="dash-qs-step-title">Get your API key</p>
                  <p className="dash-qs-step-sub">Go to API Keys and generate your first key.</p>
                </div>
              </div>
              <div className="dash-qs-divider" />
              <div className="dash-qs-step">
                <div className="dash-qs-num">02</div>
                <div>
                  <p className="dash-qs-step-title">Install the SDK</p>
                  <div className="dash-qs-code">pip install aiskfirst</div>
                </div>
              </div>
              <div className="dash-qs-divider" />
              <div className="dash-qs-step">
                <div className="dash-qs-num">03</div>
                <div>
                  <p className="dash-qs-step-title">Make your first call</p>
                  <div className="dash-qs-code">{`result = askfirst.ask(\n  question="Proceed?",\n  notify="you@example.com"\n)`}</div>
                </div>
              </div>
              <div className="dash-qs-divider" />
              <div className="dash-qs-step">
                <div className="dash-qs-num">04</div>
                <div>
                  <p className="dash-qs-step-title">Approve from email</p>
                  <p className="dash-qs-step-sub">Click Approve or Deny in the notification email — no login needed.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Activity feed placeholder */}
        <section className="dash-panel dash-activity-panel">
          <div className="dash-panel-header">
            <p className="dash-panel-title">Audit Log</p>
            <span className="dash-panel-tag">Coming soon</span>
          </div>
          <div className="dash-empty-state dash-empty-state--inline">
            <p className="dash-empty-sub">
              Every approval, denial, and timeout will be logged here with full context — who acted, when, and on what.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
