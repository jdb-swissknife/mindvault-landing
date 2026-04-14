import { useState } from 'react'
import { supabase } from './lib/supabase'

// ── Logo ──────────────────────────────────────────────
function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 200 200">
        <path d="M100,8 L180,48 L180,115 Q180,168 100,195 Q20,168 20,115 L20,48 Z" fill="#111111" stroke="#111111" strokeWidth="6" strokeLinejoin="miter"/>
        <path d="M100,22 L168,56 L168,112 Q168,158 100,182 Q32,158 32,112 L32,56 Z" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinejoin="miter"/>
        <path d="M100,34 L158,62 L158,109 Q158,148 100,170 Q42,148 42,109 L42,62 Z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinejoin="miter"/>
        <line x1="36" y1="75" x2="164" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M100,80 L126,122 L152,80" fill="none" stroke="#c2703e" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M100,80 L126,122 L152,80" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M92,190 L100,195 L108,190" fill="none" stroke="#c2703e" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-lg font-bold text-white tracking-tight">
        MindVault
      </span>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────
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
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-100 font-[Inter,system-ui,sans-serif] text-onyx">

      {/* ── Nav ── */}
      <nav className="bg-charcoal-900 border-b border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-rust-500 hover:text-rust-600 transition-colors">
            Book a Call
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-6">FOR SERVICE BUSINESSES</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight max-w-3xl">
            Your leads get a response<br />in 90 seconds.
            <span className="text-stone-400"> Not tomorrow.<br />Not Monday. Now.</span>
          </h1>
          <p className="mt-6 text-lg text-stone-400 max-w-xl leading-relaxed">
            While you're on the roof, in the field, or running crews, your leads are getting qualified, followed up with, and scheduled. You never miss one.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book a Call with John
            </a>
            <a href="#free-tools"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-stone-500 text-stone-300 font-semibold text-sm hover:border-stone-400 hover:text-white transition-colors">
              Try Free Tools
            </a>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">THE PROBLEM</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight max-w-2xl">
            Every lead you miss is a $5,000 job your competitor just took.
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">You can't answer fast enough</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You're on a roof or in a crawl space when the call comes in. By the time you call back, they already hired the guy who answered first.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Follow-up falls through the cracks</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You meant to send that quote. You meant to check in next week. But the next emergency showed up and that deal went cold.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Hiring doesn't fix it</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Another body in the office costs $40K a year and still misses leads on nights and weekends. The problem isn't people. It's coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Fix ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">THE FIX</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            We find the bottleneck.<br />We build the system. You grow.
          </h2>
          <div className="mt-14 space-y-0">
            {/* Step 1 */}
            <div className="flex gap-6 sm:gap-10 py-8 border-b border-charcoal-700">
              <div className="text-3xl font-extrabold text-rust-500 shrink-0 w-10">01</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">WEEK 1</p>
                <h3 className="text-xl font-bold mb-2">We find where the money is leaking</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  We look at how leads come in, who responds, what falls through. In one call, we pinpoint the exact spot where jobs are being lost.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-6 sm:gap-10 py-8 border-b border-charcoal-700">
              <div className="text-3xl font-extrabold text-rust-500 shrink-0 w-10">02</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">WEEK 2</p>
                <h3 className="text-xl font-bold mb-2">We build your system</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Every lead gets an instant response. Every estimate gets a follow-up sequence. Every missed call gets a text back. Custom to your business, your scripts, your pricing.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-6 sm:gap-10 py-8 border-b border-charcoal-700">
              <div className="text-3xl font-extrabold text-rust-500 shrink-0 w-10">03</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">WEEK 3-4</p>
                <h3 className="text-xl font-bold mb-2">It runs. You watch the numbers move.</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Your dashboard shows every lead, every response time, every booked job. You see the ROI in real time. No guessing.
                </p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex gap-6 sm:gap-10 py-8">
              <div className="text-3xl font-extrabold text-rust-500 shrink-0 w-10">04</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">ONGOING</p>
                <h3 className="text-xl font-bold mb-2">We handle the next bottleneck</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Once leads are handled, we move to scheduling, estimates, customer follow-ups, review collection. One problem at a time, until your operation runs clean.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Free Tools ── */}
      <section id="free-tools" className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">FREE TOOLS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight">
            Grab them. No catch.
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg">
            Built for service businesses. No signup needed for most. See what we're about before you ever talk to us.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* BizCard */}
            <a href={submitted ? "https://bizcard.mindvaultstudio.net" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-rust-500">Popular</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Digital Business Card</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Professional card with QR code in 30 seconds. Download, share, done.</p>
            </a>
            {/* ROI Calculator */}
            <a href="#/roi-calculator"
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Lead Response ROI Calculator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">See how much money slow response costs you every single month.</p>
            </a>
            {/* Follow-Up Generator */}
            <a href="#/follow-up-generator"
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Follow-Up Sequence Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">5-step follow-up sequence for your industry. Copy, paste, send.</p>
            </a>
          </div>

          {/* Email capture */}
          <div id="lead-capture" className="mt-12 max-w-md">
            <p className="text-sm font-bold text-onyx mb-3">Get early access to new tools:</p>
            {submitted ? (
              <div className="bg-charcoal-900 rounded-lg p-4 text-center">
                <p className="text-sm text-white font-medium">You're in. Check your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-sand-300 px-4 py-3 text-sm bg-white text-onyx placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rust-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-sand-300 px-4 py-3 text-sm bg-white text-onyx placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rust-500 focus:border-transparent"
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded border-stone-400 text-rust-500 focus:ring-rust-500" />
                  <span className="text-[11px] text-stone-500 leading-relaxed">
                    I agree to receive emails and text messages from MindVault Studio. Message frequency varies. Reply STOP to unsubscribe. View our <a href="/privacy" target="_blank" className="underline hover:text-rust-500">Privacy Policy</a>.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-charcoal-900 text-white font-semibold text-sm hover:bg-charcoal-950 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending...' : 'Get Early Access'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Urgency Banner ── */}
      <section className="bg-charcoal-900 border-y border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-sm font-bold text-rust-500 uppercase tracking-wider mb-2">More tools launching soon</p>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">
            We continuously do the hard work so it is seamless and simple for you to grow your company. Free for 30 days, then members only.
          </p>
        </div>
      </section>

      {/* ── The Proof ── */}
      <section className="bg-sand-100">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">THE PROOF</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight mb-12">
            Numbers don't lie.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center py-8 px-4 bg-white rounded-lg border border-sand-300">
              <p className="text-4xl font-extrabold text-rust-500">90s</p>
              <p className="text-sm text-stone-600 mt-2">Average lead response time</p>
            </div>
            <div className="text-center py-8 px-4 bg-white rounded-lg border border-sand-300">
              <p className="text-4xl font-extrabold text-rust-500">24/7</p>
              <p className="text-sm text-stone-600 mt-2">Coverage, nights and weekends</p>
            </div>
            <div className="text-center py-8 px-4 bg-white rounded-lg border border-sand-300">
              <p className="text-4xl font-extrabold text-rust-500">3x</p>
              <p className="text-sm text-stone-600 mt-2">More leads converted to jobs</p>
            </div>
            <div className="text-center py-8 px-4 bg-white rounded-lg border border-sand-300">
              <p className="text-4xl font-extrabold text-rust-500">$0</p>
              <p className="text-sm text-stone-600 mt-2">First 30 days. No risk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Stop losing jobs you already earned.
          </h2>
          <p className="text-stone-400 max-w-md mx-auto mb-8">
            Free audit. Free tools. See the results before you pay a dime.
          </p>
          <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 transition-colors">
            Book a Call with John Bird, Founder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <p className="text-xs text-stone-500 mt-4">Minneapolis, MN. We work with businesses nationwide.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-charcoal-950 border-t border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 opacity-40">
            <svg width="24" height="24" viewBox="0 0 200 200">
              <path d="M100,8 L180,48 L180,115 Q180,168 100,195 Q20,168 20,115 L20,48 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="6"/>
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#111111" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#111111" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
            <span className="text-sm font-bold text-white">MindVault</span>
          </div>
          <p className="text-xs text-stone-500">
            &copy; 2026 MindVault Studio. Minneapolis, MN.
          </p>
        </div>
      </footer>
    </div>
  )
}
