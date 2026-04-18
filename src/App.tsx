import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import WizardCompanion from './WizardCompanion'

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
  const demoRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const frame = demoRef.current
    if (!frame) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          frame.contentWindow?.postMessage('startDemo', '*')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('mv_submitted') === 'true')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      if (supabase) {
        const { error } = await supabase
          .from('landing_leads')
          .insert({ email, phone: null, source: 'landing' })
        if (error) throw error
      }
      setSubmitted(true)
      localStorage.setItem('mv_submitted', 'true')
    } catch (err) {
      console.error('Lead capture failed:', err)
      setSubmitted(true)
      localStorage.setItem('mv_submitted', 'true')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-100 font-[Inter,system-ui,sans-serif] text-onyx">
      <WizardCompanion />

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
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4">For Service Businesses</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-6">YOUR AI FOREMAN</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight max-w-3xl">
            Your roofing, solar &amp; home service leads.<br />Captured. Followed up. Booked. 24/7.
            <span className="text-stone-400"> While you're on the job.</span>
          </h1>
          <div className="mt-8 space-y-3 max-w-lg">
            <div className="flex items-start gap-3">
              <span className="text-rust-500 font-bold text-sm mt-0.5">01</span>
              <p className="text-stone-300 text-base">Leads that go cold</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-rust-500 font-bold text-sm mt-0.5">02</span>
              <p className="text-stone-300 text-base">Follow-ups that never happen</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-rust-500 font-bold text-sm mt-0.5">03</span>
              <p className="text-stone-300 text-base">Estimates that slip through the cracks</p>
            </div>
          </div>
          <p className="mt-8 text-lg text-stone-500 max-w-xl leading-relaxed">
            While you're on the roof, in the field, or running crews, your AI Foreman is running the office. All day. All night.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book a Call with John
            </a>
            <a href="#free-tools" onClick={e => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-stone-500 text-stone-300 font-semibold text-sm hover:border-stone-400 hover:text-white transition-colors">
              Try Free Tools
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-charcoal-800 border-b border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 items-center">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-extrabold text-rust-500">142</p>
              <p className="text-sm text-stone-400 mt-1">Jobs handled this month</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-charcoal-600 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-sm text-stone-400 italic leading-relaxed">
                "MindVault handles our leads while my crews are on roofs. I don't miss jobs anymore."
              </p>
              <p className="text-sm text-white font-bold mt-2">Bob Powell</p>
              <p className="text-xs text-stone-500">Bob Knows Solar</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-charcoal-600 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-sm text-stone-400 italic leading-relaxed">
                "First 30 days free was all I needed to see. Signed up before the trial ended."
              </p>
              <p className="text-sm text-white font-bold mt-2">Mike Johnson</p>
              <p className="text-xs text-stone-500">North Star Roofing, Minneapolis</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo ── */}
      <section className="bg-charcoal-900 border-b border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-8">SEE IT IN ACTION</p>
          <div className="mx-auto" style={{ maxWidth: '360px' }}>
            <iframe
              ref={demoRef}
              src="https://mindvaultstudio.net/demo.html"
              title="MindVault Demo"
              width="100%"
              height="680"
              frameBorder="0"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
          </div>
          <p className="text-xs text-stone-500 mt-4">20 seconds. No sound needed.</p>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">THE PROBLEM</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight max-w-2xl">
            Every lead you miss is a $5,000 job your competitor just took.
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">You're on a roof when the call comes in</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                A homeowner calls about a leaky roof. You're 30 feet up on another job. By the time you call back 2 hours later, they already hired the guy who answered on the first ring. That's a $6,000 job gone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Follow-up falls through the cracks</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You measured the roof. You meant to send the quote that night. But a crew emergency ate your evening, and by Monday that customer went with the company that followed up Friday afternoon.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Storm damage jobs vanish into voicemail</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Hail hits. Ten people need tarps now. Your voicemail fills up overnight and they all call the next number on Google. Those $8,000 repair jobs are gone before sunrise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Hiring doesn't fix it</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Another body in the office costs $40K a year and still misses leads on nights and weekends. After-hours calls, weekend estimate requests, holiday emergencies. The problem isn't people. It's coverage.
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
                  Every lead gets an instant response from your AI. Every estimate gets a follow-up sequence. Every missed call gets a text back. Custom to your business, your scripts, your pricing.
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
                  Lead response is where we start. Once that's tight, your AI Foreman grows into scheduling, reviews, billing, customer retention. One problem at a time, until your operation runs clean.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get (Value Stack) ── */}
      <section className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">WHAT YOU GET</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight max-w-2xl">
            Everything your AI Foreman handles. From day one.
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Instant Lead Response</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Every call, form fill, and text gets a response in under 90 seconds. 24 hours a day, 7 days a week. Never lose a lead to voicemail again.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Custom Follow-Up Sequences</h3>
                <p className="text-sm text-stone-600 leading-relaxed">5-step automated follow-ups built for your industry. Quotes get chased. Estimates get confirmed. No lead falls through the cracks, ever.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Real-Time Dashboard</h3>
                <p className="text-sm text-stone-600 leading-relaxed">See every lead, every response time, every booked job. Track ROI down to the dollar. Know exactly what your AI Foreman is doing, anytime.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Missed Call Text-Back</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Every missed call automatically gets a text within 60 seconds. "Hey, saw I missed your call. Are you looking for a roofing estimate?" Job saved.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Automated Review Collection</h3>
                <p className="text-sm text-stone-600 leading-relaxed">When jobs complete, your AI sends review requests via text and email. Build your Google reputation on autopilot while you focus on the next job.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Scheduling &amp; Booking</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Leads get booked directly onto your calendar. Estimates, follow-ups, and crew scheduling all handled automatically. No more back-and-forth texts.</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Get Your Free Audit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
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
            Built for service businesses. Drop your email to unlock all four. See what we're about before you ever talk to us.
          </p>
          <p className="mt-2 text-sm font-semibold text-rust-500">Included free with every plan.</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* BizCard */}
            <a href={submitted ? "https://bizcard.mindvaultstudio.net" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-rust-500">Popular</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Digital Business Card</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Professional card with QR code in 30 seconds. Download, share, done.</p>
            </a>
            {/* ROI Calculator */}
            <a href={submitted ? "#/roi-calculator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Lead Response ROI Calculator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">See how much money slow response costs you every single month.</p>
            </a>
            {/* Follow-Up Generator */}
            <a href={submitted ? "#/follow-up-generator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Follow-Up Sequence Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">5-step follow-up sequence for your industry. Copy, paste, send.</p>
            </a>
            {/* Review Request Generator */}
            <a href={submitted ? "#/review-request-generator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-rust-500">New</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Review Request Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Ready-to-send review request templates for text and email. Your AI Foreman sends them automatically when jobs complete.</p>
            </a>
          </div>

          {/* Email capture */}
          <div id="lead-capture" className="mt-12 max-w-md">
            <p className="text-sm font-bold text-onyx mb-1">Get Your Free Audit + Unlock All Tools</p>
            <p className="text-xs text-stone-500 mb-3">We'll run your business through our Offer Auditor and show you exactly where you're losing jobs. Plus full access to every free tool.</p>
            {submitted ? (
              <div className="bg-charcoal-900 rounded-lg p-4 text-center">
                <p className="text-sm text-white font-bold">You're in! Check your inbox.</p>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending...' : 'Get Free Audit & Tools'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Bonuses ── */}
      <section className="bg-charcoal-900 border-y border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-6 text-center">INCLUDED AT NO EXTRA COST</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-white font-bold text-base mb-1">Free Tools Access</p>
              <p className="text-stone-400 text-sm">Digital business card, ROI calculator, follow-up generator, and review request templates. Yours to keep, forever.</p>
            </div>
            <div>
              <p className="text-white font-bold text-base mb-1">Free Offer Audit</p>
              <p className="text-stone-400 text-sm">We run your website through our Offer Auditor and show you exactly where leads are leaking. Before you pay a dime.</p>
            </div>
            <div>
              <p className="text-white font-bold text-base mb-1">Custom Setup Included</p>
              <p className="text-stone-400 text-sm">We build your scripts, your follow-up sequences, your response templates. All custom to your business. No DIY.</p>
            </div>
          </div>
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

      {/* ── Guarantee ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-rust-500 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Don't pay a dime until you see it work.
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-6 leading-relaxed">
            Your first 30 days are completely free. We set everything up, your AI Foreman starts capturing leads, and you see the results before you ever enter a credit card. If it's not working for your business after 30 days, you walk away. No contracts. No fine print.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 text-stone-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              No contracts, cancel anytime
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Full setup included
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
            Free audit. Free tools. Free 30-day trial. AI that works from day one. You literally cannot lose.
          </p>
          <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 transition-colors">
            Book Your Free Audit with John
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <p className="text-xs text-stone-500 mt-4">15-minute call. No pressure. Minneapolis, MN. Nationwide.</p>
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
