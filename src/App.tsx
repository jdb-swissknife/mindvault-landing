import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import WizardCompanion from './WizardCompanion'

// ── Logo ──────────────────────────────────────────────
function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="MindVault" style={{ height: 28, width: 'auto', borderRadius: 3 }} />
      <span className="text-lg font-bold text-white tracking-tight">
        Mind<span className="text-rust-500">Vault</span>
      </span>
    </div>
  )
}

// ── Typewriter ────────────────────────────────────────
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [text])
  return (
    <span>
      {displayed}
      <span className={`inline-block w-[2px] h-[0.8em] bg-rust-500 align-middle ml-0.5 ${done ? 'animate-pulse' : 'opacity-100'}`} />
    </span>
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
          <div className="flex items-center gap-6">
            <a href="#workflows" onClick={e => { e.preventDefault(); document.getElementById('workflows')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium text-stone-400 hover:text-white transition-colors hidden sm:inline">Workflows</a>
            <a href="#free-tools" onClick={e => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium text-stone-400 hover:text-white transition-colors hidden sm:inline">Tool Suite</a>
            <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-rust-500 hover:text-rust-600 transition-colors">
              Book a Call
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-6 h-5" aria-label="AI Workforce for Service Businesses">
            <TypewriterText text="AI Workforce for Service Businesses" />
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight max-w-3xl">
            Your next hire works 24/7 and never misses those expensive leads.
          </h1>
          <p className="mt-8 text-stone-400 max-w-2xl leading-relaxed">
            Mind<span className="text-rust-500">Vault</span> gives service businesses an AI workforce that responds to leads in 60 seconds, follows up on estimates, collects reviews, and books jobs automatically. Pick a workflow. We handle the rest.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book Your Discovery Call
            </a>
            <a href="#free-tools" onClick={e => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-stone-500 text-stone-300 font-semibold text-sm hover:border-stone-400 hover:text-white transition-colors">
              Tool Suite
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-charcoal-800 border-b border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-extrabold text-rust-500">142</p>
              <p className="text-sm text-stone-400 mt-1">Jobs handled this month</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-charcoal-600 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-sm text-stone-400 italic leading-relaxed">
                "Mind<span className="text-rust-500">Vault</span> handles our leads while my crews are on roofs. I don't miss jobs anymore."
              </p>
              <p className="text-sm text-white font-bold mt-2">Robert P.</p>
              <p className="text-xs text-stone-500">Bob Knows Solar · <a href="https://solar-blitz-plan.base44.app" target="_blank" rel="noopener noreferrer" className="text-rust-500 hover:text-rust-600">solar-blitz-plan.base44.app</a></p>
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
            Your CRM works great. Here's what it doesn't do.
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Website leads go to an email and then nothing happens</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                They fill out the form, hit your inbox, and sit there. No auto-reply. No follow-up sequence. Just silence until someone remembers to check. By then, they've already called your competitor.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Your reports get printed on paper and handed to you</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Someone in your office spends hours pulling data from your CRM every month. Revenue by category. Sales by source. All so you can dig through it looking for answers you should already have.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Everyone has to do their part or the whole chain breaks</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Your CRM is only as good as the people using it. When someone forgets to log a lead or skips a follow-up, that job disappears. With 40 employees, something always gets missed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Hiring more people doesn't fix manual processes</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You brought on 3 people in the office and the same leads still slip through. More bodies doing manual work isn't the answer. The process itself needs to change.
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
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">WHAT YOU GET WITH MIND<span className="text-onyx">VAULT</span></p>
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
            <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book Your Discovery Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── This Is Just Day One ── */}
      <section className="bg-charcoal-900 border-y border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4 text-center">THIS IS JUST DAY ONE</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight mb-4">
            Your Mind<span className="text-rust-500">Vault</span> system gets smarter every week.
          </h2>
          <p className="text-stone-400 text-center max-w-2xl mx-auto mb-14 leading-relaxed">
            Lead response is where we start. But the real compounding happens when your system starts learning how your business actually runs. The longer it runs, the tighter your operation gets.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-charcoal-800 rounded-lg p-6 border border-charcoal-700">
              <p className="text-rust-500 text-xs font-bold uppercase tracking-wider mb-1">Week 1-4</p>
              <p className="text-white font-bold text-lg mb-3">Tightening Up</p>
              <p className="text-stone-400 text-sm leading-relaxed">Every lead gets answered. Every estimate gets followed up. Missed calls get texted back. Your AI learns your scripts, your pricing, your scheduling patterns.</p>
            </div>
            <div className="bg-charcoal-800 rounded-lg p-6 border border-charcoal-700">
              <p className="text-rust-500 text-xs font-bold uppercase tracking-wider mb-1">Month 2-3</p>
              <p className="text-white font-bold text-lg mb-3">Spotting Bottlenecks</p>
              <p className="text-stone-400 text-sm leading-relaxed">Your system starts seeing things you miss. Leads stalling at the same step. Jobs falling off after estimates. It flags the problems and suggests fixes.</p>
            </div>
            <div className="bg-charcoal-800 rounded-lg p-6 border border-charcoal-700">
              <p className="text-rust-500 text-xs font-bold uppercase tracking-wider mb-1">Month 6+</p>
              <p className="text-white font-bold text-lg mb-3">Running The Machine</p>
              <p className="text-stone-400 text-sm leading-relaxed">Your Mind<span className="text-rust-500">Vault</span> system proposes new workflows, tests them, and iterates. Scheduling, marketing, customer retention, hiring. It designs ways to grow and proves they work before you spend a dollar.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book Your Discovery Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Tool Suite ── */}
      <section id="free-tools" className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">TOOL SUITE</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight">
            Grab and try free tools now.
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg">
            Every tool below is free to use right now. When you join MindVault Studio, your AI agents unlock premium versions customized for your business.
          </p>
          <p className="mt-2 text-sm font-semibold text-rust-500">Your agents can customize these. Or build new ones from scratch.</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* BizCard */}
            <a href={submitted ? "https://bizcard.mindvaultstudio.net" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-rust-500">Popular</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Digital Business Card</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Professional card with QR code in 30 seconds. Download, share, done.</p>
            </a>
            {/* Growth Scorecard */}
            <a href={submitted ? "#/growth-scorecard" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-rust-500">New</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Growth Scorecard</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Score your business across 5 categories. Find out where you are leaving money on the table.</p>
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
            {/* Estimate Tracker */}
            <a href={submitted ? "#/estimate-tracker" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Estimate Tracker</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Track every estimate from sent to won. Know what is pending, what is cold, and what needs a nudge.</p>
            </a>
            {/* Review Request Generator */}
            <a href={submitted ? "#/review-request-generator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Review Request Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Ready-to-send review request templates for text and email. Your AI Foreman sends them automatically when jobs complete.</p>
            </a>
            {/* Onboarding Checklist */}
            <a href={submitted ? "#/onboarding-checklist" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">New Hire Onboarding Checklist</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Build a custom onboarding checklist for your industry. Get new hires productive faster.</p>
            </a>
            {/* Solar Savings Calculator */}
            <a href={submitted ? "#/solar-savings-calculator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-lg border border-sand-300 p-6 hover:border-rust-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Free Tool</span>
              <h3 className="text-lg font-bold text-onyx mt-2 mb-1">Solar Savings Calculator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">Show homeowners their real savings. Built for solar companies closing deals in the field.</p>
            </a>
          </div>

          {/* Premium hint */}
          <div className="mt-8 rounded-lg bg-white border border-sand-300 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-onyx">Every tool has a premium version.</p>
              <p className="text-xs text-stone-500 mt-1">When you join MindVault Studio, your AI agents customize these tools to match your business. Your scripts. Your pricing. Your follow-up cadence. Or we build new ones from scratch.</p>
            </div>
            <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              See Premium Tools
            </a>
          </div>

          {/* Email capture */}
          <div id="lead-capture" className="mt-10 max-w-md">
            <p className="text-sm font-bold text-onyx mb-1">Unlock All 8 Tools Free</p>
            <p className="text-xs text-stone-500 mb-3">Drop your email. Use every tool right now, no strings attached. See what MindVault is about before you ever talk to us.</p>
            {submitted ? (
              <div className="bg-charcoal-900 rounded-lg p-4 text-center">
                <p className="text-sm text-white font-bold">You're in! Scroll up and try any tool.</p>
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
                  {loading ? 'Sending...' : 'Unlock All 8 Tools Free'}
                </button>
              </form>
            )}
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
              <p className="text-4xl font-extrabold text-rust-500">60s</p>
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
              <p className="text-4xl font-extrabold text-rust-500">90</p>
              <p className="text-sm text-stone-600 mt-2">Day results guarantee</p>
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
            90-Day Results Guarantee.
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-6 leading-relaxed">
            We build it. We run it. If after 90 days your Mind<span className="text-rust-500">Vault</span> system isn't saving you more than it costs, we fix it until it does. No long-term contracts. No fine print. If it doesn't work, you walk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 text-stone-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              No long-term contracts
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2703e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Cancel anytime
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
            30 minutes. No pitch. Just a straight look at where your operation is leaking. Book your discovery call today.
          </p>
          <a href="https://cal.com/jbird/mindvault-discovery-call" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 transition-colors">
            Book Your Discovery Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <p className="text-xs text-stone-500 mt-4">30-minute discovery call. No pressure. Minneapolis, MN. Nationwide.</p>
          <p className="text-sm text-stone-400 mt-3">
            Prefer to call? <a href="tel:+16124407465" className="text-rust-500 hover:text-rust-600 transition-colors font-medium">612-440-7465</a>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-charcoal-950 border-t border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 opacity-40">
            <img src="/logo.png" alt="MindVault" style={{ height: 20, width: 'auto', borderRadius: 2 }} />
            <span className="text-sm font-bold text-white">Mind<span className="text-rust-500">Vault</span></span>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-xs text-stone-500">
              &copy; 2026 Mind<span className="text-rust-500">Vault</span> Studio. Minneapolis, MN.
            </p>
            <p className="text-xs text-stone-500">
              Support: <a href="tel:+16124407465" className="text-stone-400 hover:text-rust-500 transition-colors">612-440-7465</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}