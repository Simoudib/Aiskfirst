'use client'

import { useState } from 'react'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubscribe() {
    setErrorMsg('')
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: document.referrer || 'direct' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      setStatus('success')
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  async function handleCheckout(plan: string) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? 'Checkout failed. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <>
      <nav>
        <a href="#" className="logo-link">
          <img src="/logoaiskfirst.svg" alt="AskFirst" className="logo-img" />
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#integrations">Integrations</a>
          <a href="#pricing">Pricing</a>
        </div>
        <a href="#waitlist" className="nav-cta">Join waitlist</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="status-badge">
          <div className="status-dot" />
          Now in early access — join the waitlist
        </div>

        <h1>
          Your AI agent<br />
          should <span className="accent">ask first.</span>
        </h1>

        <p className="hero-sub">
          A single API call that pauses your AI agent, notifies a human, and waits for approval before continuing. Works with any agent framework in minutes.
        </p>

        <div className="hero-actions">
          <a href="#waitlist" className="btn-primary">Get early access</a>
          <a href="#how" className="btn-secondary">See how it works →</a>
        </div>

        <div className="code-demo">
          <div className="code-toolbar">
            <div className="code-dot cd1" />
            <div className="code-dot cd2" />
            <div className="code-dot cd3" />
            <span className="code-title">agent.py — powered by aiskfirst.com</span>
          </div>
          <div className="code-body">
            <span className="c-comment"># Before: your agent just did it</span><br />
            <span className="c-key">delete_files</span>(<span className="c-str">&quot;*.log&quot;</span>, <span className="c-key">count</span>=<span className="c-val">847</span>)  <span className="c-comment"># 😬 no way to stop this</span><br />
            <hr className="code-divider" />
            <span className="c-comment"># After: your agent asks a human first</span><br />
            <span className="c-key">result</span> = askfirst.<span className="c-method">ask</span>(<br />
            &nbsp;&nbsp;<span className="c-key">question</span>=<span className="c-str">&quot;Delete 847 log files?&quot;</span>,<br />
            &nbsp;&nbsp;<span className="c-key">context</span>=<span className="c-str">&quot;Total: 12GB, oldest: 2021&quot;</span>,<br />
            &nbsp;&nbsp;<span className="c-key">notify</span>=<span className="c-str">&quot;email&quot;</span>,<br />
            &nbsp;&nbsp;<span className="c-key">timeout</span>=<span className="c-str">&quot;30m&quot;</span><br />
            )<br /><br />
            <span className="c-key">if</span> result.<span className="c-method">approved</span>:<br />
            &nbsp;&nbsp;<span className="c-key">delete_files</span>(<span className="c-str">&quot;*.log&quot;</span>)  <span className="c-comment c-success"># ✅ human said yes</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" id="problem">
        <p className="section-label">The problem</p>
        <h2 className="section-title">AI agents are powerful.<br />That&apos;s exactly the risk.</h2>
        <p className="section-sub">Every developer building production agents hits the same wall — your agent is smart enough to do dangerous things, but not wise enough to know when it shouldn&apos;t.</p>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">⚠️</div>
            <h3>Irreversible actions</h3>
            <p>Deleting records, sending emails, making purchases, calling external APIs — once done, they can&apos;t be undone. Your agent shouldn&apos;t do these alone.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">🧱</div>
            <h3>Painful to wire up yourself</h3>
            <p>Building human approval into an agent means email systems, webhook handlers, polling loops, timeout logic, and a database — hours of work for every project.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">📋</div>
            <h3>No audit trail</h3>
            <p>When something goes wrong, teams need to know who approved what, when, and why. Logging this correctly across async agent workflows is genuinely hard.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-wrap" id="how">
        <div style={{ textAlign: 'center' }}>
          <p className="section-label">How it works</p>
          <h2 className="section-title">Four steps. One API call.</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-circle">01</div>
            <h3>Agent calls the API</h3>
            <p>When your agent reaches a decision point, it fires a POST request with the question and context.</p>
          </div>
          <div className="step">
            <div className="step-circle">02</div>
            <h3>Human gets notified</h3>
            <p>An email (or Slack message) arrives instantly with Approve and Deny buttons. No login needed.</p>
          </div>
          <div className="step">
            <div className="step-circle">03</div>
            <h3>Agent waits</h3>
            <p>The request stays open until a human responds or the timeout triggers your fallback behavior.</p>
          </div>
          <div className="step">
            <div className="step-circle">04</div>
            <h3>Decision returned</h3>
            <p>Your agent receives <code style={{ fontFamily: 'var(--mono)', fontSize: '12px', background: 'var(--bg3)', padding: '2px 6px', borderRadius: '4px' }}>approved: true/false</code> and continues with full audit log saved.</p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section" id="usecases">
        <p className="section-label">Use cases</p>
        <h2 className="section-title">Any agent that touches<br />the real world needs this.</h2>
        <div className="use-grid">
          <div className="use-card"><span className="use-tag">Finance</span><h3>Payment &amp; billing agents</h3><p>Approve before charging a card, issuing a refund, or transferring funds. Turn compliance into one API call.</p></div>
          <div className="use-card"><span className="use-tag">DevOps</span><h3>Infra &amp; deployment agents</h3><p>Human sign-off before a production deploy, database migration, or auto-scaling event that costs money.</p></div>
          <div className="use-card"><span className="use-tag">Sales</span><h3>Outreach &amp; CRM agents</h3><p>Review and approve emails before they go to prospects. No agent should fire off 500 cold emails unsupervised.</p></div>
          <div className="use-card"><span className="use-tag">Legal</span><h3>Document agents</h3><p>Get approval before sending contracts, NDAs, or any document that creates legal obligations.</p></div>
          <div className="use-card"><span className="use-tag">Data</span><h3>Cleanup &amp; deletion agents</h3><p>Confirm before bulk deletes, schema changes, or any operation that can&apos;t be rolled back.</p></div>
          <div className="use-card"><span className="use-tag">Any agent</span><h3>Anything irreversible</h3><p>Works with Claude Agents, OpenAI SDK, LangChain, CrewAI, LlamaIndex, and any custom agent — via a plain REST call.</p></div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="section" id="integrations" style={{ paddingBottom: 0 }}>
        <p className="section-label">Integrations</p>
        <h2 className="section-title">Works with every agent<br />framework you already use.</h2>
        <p className="section-sub">One API call. No SDKs required. Drop it into your existing agent in under 5 minutes.</p>

        <div className="integrations-grid">
          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-claude">C</div>
              <div><div className="int-name">Claude Agents</div><div className="int-sub">Anthropic</div></div>
              <span className="int-badge">5 min setup</span>
            </div>
            <div className="int-code">{`# In your Claude tool definition
result = askfirst.ask(
  question="Send report to CEO?",
  notify="you@company.com"
)
if result["approved"]: send_report()`}</div>
          </div>

          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-openai">⬡</div>
              <div><div className="int-name">OpenAI Agents SDK</div><div className="int-sub">OpenAI</div></div>
              <span className="int-badge">5 min setup</span>
            </div>
            <div className="int-code">{`# As an OpenAI function tool
tools = [{
  "name": "ask_human",
  "description": "Request human approval",
  "url": "https://api.aiskfirst.com/v1/ask"
}]`}</div>
          </div>

          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-langchain">L</div>
              <div><div className="int-name">LangChain</div><div className="int-sub">LangChain AI</div></div>
              <span className="int-badge">5 min setup</span>
            </div>
            <div className="int-code">{`# As a LangChain tool
from langchain.tools import tool

@tool
def ask_human(question: str):
  """Get human approval before acting"""
  return askfirst.ask(question)`}</div>
          </div>

          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-crewai">⚡</div>
              <div><div className="int-name">CrewAI</div><div className="int-sub">CrewAI Inc</div></div>
              <span className="int-badge">5 min setup</span>
            </div>
            <div className="int-code">{`# As a CrewAI tool
class AskHumanTool(BaseTool):
  name = "ask_human"
  def _run(self, question):
    return askfirst.ask(question)`}</div>
          </div>

          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-llamaindex">🦙</div>
              <div><div className="int-name">LlamaIndex</div><div className="int-sub">LlamaIndex</div></div>
              <span className="int-badge">5 min setup</span>
            </div>
            <div className="int-code">{`# As a LlamaIndex FunctionTool
from llama_index.tools import FunctionTool

ask_tool = FunctionTool.from_defaults(
  fn=askfirst.ask,
  name="ask_human"
)`}</div>
          </div>

          <div className="integration-card">
            <div className="int-header">
              <div className="int-logo int-custom">{'{ }'}</div>
              <div><div className="int-name">Any custom agent</div><div className="int-sub">REST API — any language</div></div>
              <span className="int-badge">2 min setup</span>
            </div>
            <div className="int-code">{`# Plain HTTP — works everywhere
curl -X POST \\
  https://api.aiskfirst.com/v1/ask \\
  -H "Authorization: Bearer sk-..." \\
  -d '{"question":"Proceed?"}'`}</div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-wrap" id="pricing">
        <p className="section-label">Pricing</p>
        <h2 className="section-title">One-time access. No subscriptions.</h2>
        <p style={{ fontSize: '16px', color: 'var(--muted)', marginTop: '12px' }}>Pay once, use for the full period. No auto-renewals.</p>

        <div className="pricing-grid">
          <div className="price-card">
            <p className="price-label">Accès 1 mois</p>
            <div className="price-amount">€9.99</div>
            <div className="price-period">EUR · paiement unique</div>
            <ul className="price-features">
              <li>Accès complet 30 jours</li>
              <li>Toutes les intégrations</li>
              <li>Notifications email</li>
              <li>Journal d'audit</li>
              <li>Sans renouvellement</li>
            </ul>
            <button className="btn-plan btn-plan-outline" onClick={() => handleCheckout('1m')} disabled={checkoutLoading !== null}>{checkoutLoading === '1m' ? 'Chargement...' : "Accès 1 mois"}</button>
          </div>

          <div className="price-card">
            <p className="price-label">Accès 3 mois</p>
            <div className="price-amount">€23</div>
            <div className="price-period">EUR · paiement unique</div>
            <ul className="price-features">
              <li>Accès complet 90 jours</li>
              <li>Toutes les intégrations</li>
              <li>Notifications email + Slack</li>
              <li>Journal d'audit complet</li>
              <li>Sans renouvellement</li>
            </ul>
            <button className="btn-plan btn-plan-outline" onClick={() => handleCheckout('3m')} disabled={checkoutLoading !== null}>{checkoutLoading === '3m' ? 'Chargement...' : "Accès 3 mois"}</button>
          </div>

          <div className="price-card featured">
            <p className="price-featured-label">Meilleur rapport qualité-prix</p>
            <p className="price-label">Accès 6 mois</p>
            <div className="price-amount">€32</div>
            <div className="price-period">EUR · paiement unique</div>
            <ul className="price-features">
              <li>Accès complet 180 jours</li>
              <li>Toutes les intégrations</li>
              <li>Notifications email + Slack</li>
              <li>Journal d'audit + export</li>
              <li>Sans renouvellement</li>
            </ul>
            <button className="btn-plan btn-plan-filled" onClick={() => handleCheckout('6m')} disabled={checkoutLoading !== null}>{checkoutLoading === '6m' ? 'Chargement...' : "Accès 6 mois"}</button>
          </div>

          <div className="price-card">
            <p className="price-label">Accès 12 mois</p>
            <div className="price-amount">€45</div>
            <div className="price-period">EUR · paiement unique</div>
            <ul className="price-features">
              <li>Accès complet 365 jours</li>
              <li>Toutes les intégrations</li>
              <li>Email + Slack + webhook</li>
              <li>Analytiques avancées</li>
              <li>Support prioritaire</li>
            </ul>
            <button className="btn-plan btn-plan-outline" onClick={() => handleCheckout('12m')} disabled={checkoutLoading !== null}>{checkoutLoading === '12m' ? 'Chargement...' : "Accès 12 mois"}</button>
          </div>
        </div>
      </section>


      {/* WAITLIST */}
      <section className="waitlist-section" id="waitlist">
        <div className="waitlist-glow" />
        <div className="waitlist-box">
          <h2>Get early access</h2>
          <p>Join the waitlist and be first when we launch. Early members get 3 months of Pro free.</p>

          {status === 'success' ? (
            <div className="success-msg">✓ You&apos;re on the list. We&apos;ll email you when we launch.</div>
          ) : (
            <div id="form-area">
              <div className="input-row">
                <input
                  type="email"
                  className="email-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={status === 'error' ? { borderColor: 'rgba(255,90,90,0.6)' } : {}}
                />
                <button
                  className="submit-btn"
                  onClick={handleSubscribe}
                  disabled={status === 'loading'}
                  style={status === 'loading' ? { opacity: 0.7 } : {}}
                >
                  {status === 'loading' ? 'Joining...' : 'Join waitlist'}
                </button>
              </div>
              {errorMsg && <div className="error-msg">{errorMsg}</div>}
            </div>
          )}
          <p className="waitlist-note">No spam. One email when we launch. Unsubscribe anytime.</p>
        </div>
      </section>

      <footer>
        <a href="#" className="logo-link">
          <img src="/logoaiskfirst.svg" alt="AskFirst" className="logo-img" />
        </a>
        <div className="footer-links">
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <p>© 2025 AskFirst. Built for AI agent builders.</p>
      </footer>
    </>
  )
}
