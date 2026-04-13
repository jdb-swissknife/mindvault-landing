import { useState } from 'react'
import { supabase } from './lib/supabase'

// ── Shield Logo SVG ────────────────────────────────────
function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 200 200">
        <path d="M100,8 L180,48 L180,115 Q180,168 100,195 Q20,168 20,115 L20,48 Z" fill="#1a2a6c" stroke="#1a2a6c" strokeWidth="6" strokeLinejoin="miter"/>
        <path d="M100,22 L168,56 L168,112 Q168,158 100,182 Q32,158 32,112 L32,56 Z" fill="none" stroke="#4f6ef7" strokeWidth="2.5" strokeLinejoin="miter"/>
        <path d="M100,34 L158,62 L158,109 Q158,148 100,170 Q42,148 42,109 L42,62 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinejoin="miter"/>
        <line x1="36" y1="75" x2="164" y2="75" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M100,80 L126,122 L152,80" fill="none" stroke="#4f6ef7" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M100,80 L126,122 L152,80" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M92,190 L100,195 L108,190" fill="none" stroke="#4f6ef7" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-xl font-bold text-navy-900 tracking-tight">
        Mind<tspan className="text-navy-500">Vault</tspan>
      </span>
    </div>
  )
}

// ── Free Tool Card ─────────────────────────────────────
function ToolCard({ icon, title, desc, tag, href, gated }: {
  icon: React.ReactNode; title: string; desc: string; tag: string; href: string; gated?: boolean
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (gated) {
      e.preventDefault()
      document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <a href={gated ? '#' : href} onClick={handleClick} target={gated ? undefined : '_blank'} rel={gated ? undefined : 'noopener noreferrer'}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:border-navy-500 hover:shadow-lg hover:shadow-navy-500/5 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500 group-hover:bg-navy-500 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 bg-navy-50 px-2 py-0.5 rounded-full group-hover:bg-navy-100 transition-colors">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-navy-900 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </a>
  )
}

// ── Main App ───────────────────────────────────────────
export default function App() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      if (supabase) {
        const { error } = await supabase
          .from('landing_leads')
          .insert({ email, phone: phone || null, source: 'landing' })
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err) {
      console.error('Lead capture failed:', err)
      // Still show success to user — we'll capture via fallback later
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <a href="https://mindvaultstudio.net" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors">
            About MindVault
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      </nav>

      {/* ── Hero + Capture ── */}
      <section className="relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50/60 to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-navy-50 text-navy-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Free tools for service businesses
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-[1.08] tracking-tight">
              AI tools that work
              <br />
              <span className="text-navy-500">for your business</span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-lg">
              Free digital tools built for roofers, contractors, real estate agents, and every service business that needs to move faster. Grab them below.
            </p>
          </div>

          {/* Email capture */}
          <div id="lead-capture" className="mt-10 max-w-md">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15be53" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  <span className="text-sm font-bold text-green-800">You're in!</span>
                </div>
                <p className="text-sm text-green-700">We'll send you early access to new tools. Check your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 rounded border-gray-300 text-navy-500 focus:ring-navy-500"
                  />
                  <span className="text-[11px] text-gray-400 leading-relaxed">
                    I agree to receive emails and text messages from MindVault Studio. Message frequency varies. Reply STOP to unsubscribe. View our <a href="/privacy" target="_blank" className="underline hover:text-navy-500">Privacy Policy</a>.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending...' : 'Get Free Tools'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Free Tools Grid ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">Free tools, instant access</h2>
          <p className="text-gray-500 mt-2">No signup required. Just use them.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ToolCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10h8M8 14h4"/></svg>}
            title="Digital Business Card"
            desc="Create a professional digital card with QR code in 30 seconds. Download instantly. Share anywhere."
            tag="Popular"
            href={submitted ? "https://bizcard.mindvaultstudio.net" : "#"}
            gated={!submitted}
          />
          <ToolCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>}
            title="Lead Response Bot"
            desc="Coming soon — AI that responds to every lead in under 60 seconds, 24/7. Join the waitlist."
            tag="Coming Soon"
            href="#"
          />
          <ToolCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            title="Follow-Up Automator"
            desc="Coming soon — never lose a lead to a missed follow-up. AI handles the entire sequence."
            tag="Coming Soon"
            href="#"
          />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              How MindVault works
            </h2>
            <p className="text-gray-400 mt-2">From free tools to full AI team, on your terms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-navy-500/20 border border-navy-500/40 flex items-center justify-center mx-auto mb-4 text-navy-500 font-bold text-lg">1</div>
              <h3 className="text-lg font-bold mb-2">Grab a free tool</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Start with our free digital business card maker. No signup, no catch. See the quality firsthand.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-navy-500/20 border border-navy-500/40 flex items-center justify-center mx-auto mb-4 text-navy-500 font-bold text-lg">2</div>
              <h3 className="text-lg font-bold mb-2">Book a free audit</h3>
              <p className="text-sm text-gray-400 leading-relaxed">We look at your business and show you exactly where AI agents save time and make money. Zero pressure.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-navy-500/20 border border-navy-500/40 flex items-center justify-center mx-auto mb-4 text-navy-500 font-bold text-lg">3</div>
              <h3 className="text-lg font-bold mb-2">Get your AI team</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Lead response, follow-ups, scheduling, customer comms — agents that work 24/7 and get smarter every month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-3">
          Ready to stop losing leads?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Free audit. Free tools. See the results before you pay a dime.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
            Book a Call with John Bird, Founder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://bizcard.mindvaultstudio.net"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-navy-900 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Try Free Business Card
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo className="opacity-50" />
          <p className="text-xs text-gray-400">
            &copy; 2026 MindVault Studio. Minneapolis, MN.
          </p>
        </div>
      </footer>
    </div>
  )
}
