'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const WHATSAPP_NUMBER = '212605085665'

const TRANSLATIONS = {
  fr: {
    title: 'Merci pour votre achat\u00a0!',
    subtitle: 'Votre code d\u2019acc\u00e8s unique est pr\u00eat. Envoyez-le sur notre WhatsApp pour activer votre abonnement.',
    codeLabel: 'Votre code d\u2019acc\u00e8s',
    codeLoading: 'G\u00e9n\u00e9ration de votre code\u2026',
    codeError: 'Impossible de charger le code. Veuillez contacter le support.',
    copyBtn: 'Copier le code',
    copied: 'Copi\u00e9\u00a0!',
    step1: 'Copiez votre code unique ci-dessus',
    step2: 'Envoyez-le sur notre WhatsApp',
    step3: 'Nous activons votre acc\u00e8s',
    waLabel: 'Envoyez votre code au',
    waBtn: 'Envoyer le code sur WhatsApp',
    waMessage: 'Mon code d\'acc\u00e8s est\u00a0:',
    backHome: '\u2190 Retour \u00e0 l\u2019accueil',
  },
  en: {
    title: 'Thank you for your purchase!',
    subtitle: 'Your unique access code is ready. Send it to our WhatsApp to activate your subscription.',
    codeLabel: 'Your Access Code',
    codeLoading: 'Generating your code\u2026',
    codeError: 'Could not load code. Please contact support.',
    copyBtn: 'Copy Code',
    copied: 'Copied!',
    step1: 'Copy your unique code above',
    step2: 'Send it to our WhatsApp',
    step3: 'We activate your access',
    waLabel: 'Send your code to',
    waBtn: 'Send Code on WhatsApp',
    waMessage: 'My access code is:',
    backHome: '\u2190 Back to home',
  },
} as const

type Lang = keyof typeof TRANSLATIONS

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [lang, setLang] = useState<Lang>('fr')
  const t = TRANSLATIONS[lang]

  const [code, setCode] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)

  const fetchCode = useCallback(async () => {
    if (!sessionId) return
    try {
      const res = await fetch(`/api/code?session_id=${sessionId}`)
      if (res.status === 202) {
        // Webhook not yet processed — retry up to 10 times
        if (attempt < 10) {
          setTimeout(() => setAttempt((a) => a + 1), 2000)
        } else {
          setFailed(true)
        }
        return
      }
      const data = await res.json()
      if (data.code) {
        setCode(data.code)
        setPlan(data.plan)
      } else {
        setFailed(true)
      }
    } catch {
      setFailed(true)
    }
  }, [sessionId, attempt])

  useEffect(() => {
    fetchCode()
  }, [fetchCode])

  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const waMessage = code ? `${t.waMessage} ${code}` : ''
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`


  return (
    <div className="success-root">
      {/* Animated background blobs */}
      <div className="success-blob success-blob--1" />
      <div className="success-blob success-blob--2" />
      <div className="success-blob success-blob--3" />

      <div className="success-card">
        {/* Language toggle */}
        <button
          id="lang-toggle-btn"
          className="success-lang-toggle"
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          aria-label="Switch language"
        >
          <span className={lang === 'fr' ? 'success-lang-active' : ''}>FR</span>
          <span className="success-lang-sep">|</span>
          <span className={lang === 'en' ? 'success-lang-active' : ''}>EN</span>
        </button>

        {/* Checkmark */}
        <div className="success-icon-wrap">
          <svg className="success-check" viewBox="0 0 52 52" fill="none">
            <circle className="success-check-circle" cx="26" cy="26" r="25" />
            <path className="success-check-tick" d="M14 26l8 8 16-16" />
          </svg>
        </div>

        <h1 className="success-title">{t.title}</h1>
        {plan && <p className="success-plan-badge">{plan}</p>}
        <p className="success-subtitle">{t.subtitle}</p>

        {/* Code display with inline copy icon */}
        <div className="success-code-section">
          <p className="success-code-label">{t.codeLabel}</p>
          {code ? (
            <div className="success-code-box">
              <span className="success-code-text">{code}</span>
              <button
                id="copy-code-btn"
                className={`success-copy-icon${copied ? ' success-copy-icon--done' : ''}`}
                onClick={handleCopy}
                aria-label={t.copyBtn}
                title={t.copyBtn}
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          ) : failed ? (
            <div className="success-code-box success-code-box--error">
              <span className="success-code-text" style={{ fontSize: '0.85rem', color: '#f87171' }}>
                {t.codeError}
              </span>
            </div>
          ) : (
            <div className="success-code-box success-code-box--loading">
              <span className="success-loading-dots">
                <span /><span /><span />
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                {t.codeLoading}
              </span>
            </div>
          )}
        </div>

        {/* WhatsApp CTA — only main action */}
        <a
          id="whatsapp-btn"
          href={code ? waUrl : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`success-wa-btn${!code ? ' success-wa-btn--disabled' : ''}`}
          onClick={(e) => !code && e.preventDefault()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t.waBtn}
        </a>

        <a href="/" className="success-home-link">{t.backHome}</a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .success-root {
          min-height: 100vh;
          background: #070711;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }

        /* Background animated blobs */
        .success-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: blobFloat 8s ease-in-out infinite alternate;
        }
        .success-blob--1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, transparent);
          top: -150px; left: -100px;
          animation-delay: 0s;
        }
        .success-blob--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #22d3ee, transparent);
          bottom: -100px; right: -80px;
          animation-delay: 3s;
        }
        .success-blob--3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #a78bfa, transparent);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 1.5s;
        }
        @keyframes blobFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.1); }
        }
        .success-blob--3 {
          animation-name: blobFloat3;
        }
        @keyframes blobFloat3 {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(calc(-50% + 20px), calc(-50% - 15px)) scale(1.08); }
        }

        /* Language toggle */
        .success-lang-toggle {
          position: absolute;
          top: 1.1rem;
          right: 1.25rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.28rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.35);
          transition: background 0.2s, border-color 0.2s;
        }
        .success-lang-toggle:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .success-lang-sep {
          color: rgba(255,255,255,0.15);
          font-weight: 400;
        }
        .success-lang-active {
          color: #fff;
        }

        /* Card */
        .success-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          animation: cardIn 0.6s cubic-bezier(.22,.68,0,1.3) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Checkmark */
        .success-icon-wrap {
          animation: popIn 0.7s cubic-bezier(.22,.68,0,1.4) 0.2s both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        .success-check {
          width: 64px; height: 64px;
        }
        .success-check-circle {
          stroke: #22d3ee;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: strokeDash 0.8s ease 0.4s forwards;
          fill: rgba(34,211,238,0.08);
        }
        .success-check-tick {
          stroke: #22d3ee;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: strokeDash 0.5s ease 1s forwards;
        }
        @keyframes strokeDash {
          to { stroke-dashoffset: 0; }
        }

        .success-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #fff;
          text-align: center;
          line-height: 1.2;
        }
        .success-plan-badge {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
        }
        .success-subtitle {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          text-align: center;
          line-height: 1.6;
          max-width: 360px;
        }

        /* Code section */
        .success-code-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
        }
        .success-code-label {
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .success-code-box {
          width: 100%;
          background: rgba(99,102,241,0.08);
          border: 1.5px solid rgba(99,102,241,0.35);
          border-radius: 14px;
          padding: 1rem 1rem 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-height: 64px;
          transition: border-color 0.3s;
        }
        .success-code-box:hover {
          border-color: rgba(99,102,241,0.6);
        }

        /* Inline copy icon */
        .success-copy-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .success-copy-icon:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
        .success-copy-icon--done {
          background: rgba(34,211,238,0.12);
          border-color: rgba(34,211,238,0.4);
          color: #22d3ee;
        }
        .success-code-box--loading {
          border-color: rgba(255,255,255,0.1);
        }
        .success-code-box--error {
          border-color: rgba(248,113,113,0.35);
          background: rgba(248,113,113,0.05);
        }
        .success-code-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.15rem;
          font-weight: 700;
          color: #e0e7ff;
          letter-spacing: 0.12em;
          word-break: break-all;
          text-align: center;
        }

        /* Loading dots */
        .success-loading-dots {
          display: inline-flex;
          gap: 6px;
          align-items: center;
        }
        .success-loading-dots span {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(99,102,241,0.6);
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .success-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .success-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        /* (steps and standalone copy btn removed) */


        /* WhatsApp button */
        .success-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #25D366;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          padding: 0.8rem 1.8rem;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(37,211,102,0.3);
        }
        .success-wa-btn:hover:not(.success-wa-btn--disabled) {
          background: #20bd5a;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37,211,102,0.4);
        }
        .success-wa-btn--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .success-home-link {
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.2s;
          margin-top: -0.5rem;
        }
        .success-home-link:hover { color: rgba(255,255,255,0.6); }

        @media (max-width: 480px) {
          .success-card { padding: 2rem 1.25rem; }
          .success-title { font-size: 1.35rem; }
          .success-code-text { font-size: 0.95rem; letter-spacing: 0.06em; }
          .success-instructions { gap: 0.3rem; }
          .success-step-arrow { display: none; }
        }
      `}</style>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
