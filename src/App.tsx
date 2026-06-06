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
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing' | 'blank'>('typing')
  const idx = useRef(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (idx.current < text.length) {
        timer = setTimeout(() => {
          idx.current++
          setDisplayed(text.slice(0, idx.current))
        }, 45)
      } else {
        timer = setTimeout(() => setPhase('pause'), 2200)
      }
    } else if (phase === 'pause') {
      timer = setTimeout(() => setPhase('erasing'), 1800)
    } else if (phase === 'erasing') {
      if (idx.current > 0) {
        timer = setTimeout(() => {
          idx.current--
          setDisplayed(text.slice(0, idx.current))
        }, 25)
      } else {
        timer = setTimeout(() => setPhase('blank'), 400)
      }
    } else {
      timer = setTimeout(() => setPhase('typing'), 300)
    }
    return () => clearTimeout(timer)
  }, [phase, displayed, text])

  return (
    <span>
      {displayed}
      <span className="inline-block w-[2px] h-[0.8em] bg-rust-500 align-middle ml-0.5 animate-pulse" />
    </span>
  )
}

// ── Main App ──────────────────────────────────────────
export default function App() {
  const demoRef = useRef<HTMLIFrameElement>(null)
  const demoLoadedRef = useRef(false)
  const demoVisibleRef = useRef(false)
  const demoStartedRef = useRef(false)

  const startDemoWhenReady = () => {
    const frame = demoRef.current
    if (!frame || !demoLoadedRef.current || !demoVisibleRef.current || demoStartedRef.current) return

    demoStartedRef.current = true
    const sendStart = () => frame.contentWindow?.postMessage('startDemo', '*')
    sendStart()
    setTimeout(sendStart, 250)
    setTimeout(sendStart, 750)
  }

  useEffect(() => {
    const frame = demoRef.current
    if (!frame) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          demoVisibleRef.current = true
          startDemoWhenReady()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.25 })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('mv_submitted') === 'true')
  const [loading, setLoading] = useState(false)
  const [wfFilter, setWfFilter] = useState('All')

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
            <a href="#how-it-works" onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium text-stone-400 hover:text-white transition-colors hidden sm:inline">How It Works</a>
            <a href="#free-tools" onClick={e => { e.preventDefault(); document.getElementById('free-tools')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium text-stone-400 hover:text-white transition-colors hidden sm:inline">Tool Suite</a>
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-rust-500 hover:text-rust-600 transition-colors">
              Book a Call
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-6 h-5" aria-label="Growth Operating System for Service Businesses">
            <TypewriterText text="Growth Operating System for Service Businesses" />
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight max-w-3xl">
            Grow without letting the back office break.
          </h1>
          <p className="mt-8 text-stone-400 max-w-2xl leading-relaxed">
            Mind<span className="text-rust-500">Vault</span> helps service businesses answer faster, follow up on time, keep the calendar moving, and see where money is slipping through the cracks.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book Your Discovery Call
            </a>
            <a href="#how-it-works" onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-stone-500 text-stone-300 font-semibold text-sm hover:border-stone-400 hover:text-white transition-colors">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-charcoal-800 border-b border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-extrabold text-rust-500">Faster</p>
              <p className="text-sm text-stone-400 mt-1">Lead response, follow-up, and handoffs</p>
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
              src="/demo.html"
              title="MindVault Demo"
              width="100%"
              height="680"
              frameBorder="0"
              allowFullScreen
              onLoad={() => {
                demoLoadedRef.current = true
                startDemoWhenReady()
              }}
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
            Most lost revenue does not come from bad service. It comes from dropped follow-up.
          </h2>
          <p className="mt-5 text-stone-600 max-w-2xl leading-relaxed">
            The business grows, but the system behind it does not. That is when good demand starts turning into back office chaos.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">New leads sit too long</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                A form gets filled out, a call gets missed, or a text comes in after hours. If nobody touches it fast, that job starts shopping somewhere else.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Estimates go quiet</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You did the hard part and got in the door. Then the quote sits too long, the prospect cools off, and nobody is sure who was supposed to follow up.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">Missed calls never get recovered</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                One missed ring can turn into a lost job when there is no fast text-back and no clean handoff into the follow-up queue.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onyx mb-2">The owner becomes the safety net</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                When the process is weak, the owner becomes the backup system. That works for a while. Then it becomes the thing that limits growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Fix ── */}
      <section id="how-it-works" className="bg-charcoal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-3xl">
            We install the system that keeps the easy money from leaking out.
          </h2>
          <p className="mt-5 text-stone-400 max-w-2xl leading-relaxed">
            Start where the pain is highest. Usually lead response, missed calls, estimate follow-up, scheduling reminders, or review requests.
          </p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700 border-t-4 border-t-rust-500">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">01. Catch</p>
              <h3 className="text-2xl font-extrabold mb-4">Catch</h3>
              <ul className="space-y-3 text-sm text-stone-400 leading-relaxed">
                <li>New leads</li>
                <li>Missed calls</li>
                <li>Stale estimates</li>
                <li>Review opportunities</li>
              </ul>
            </div>
            <div className="bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700 border-t-4 border-t-rust-500">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">02. Handle</p>
              <h3 className="text-2xl font-extrabold mb-4">Handle</h3>
              <ul className="space-y-3 text-sm text-stone-400 leading-relaxed">
                <li>Fast replies</li>
                <li>Timed follow-up</li>
                <li>Scheduling reminders</li>
                <li>Review requests</li>
              </ul>
            </div>
            <div className="bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700 border-t-4 border-t-rust-500">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">03. Show</p>
              <h3 className="text-2xl font-extrabold mb-4">Show</h3>
              <ul className="space-y-3 text-sm text-stone-400 leading-relaxed">
                <li>What came in</li>
                <li>What got handled</li>
                <li>What needs a human today</li>
                <li>Where money is getting stuck</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get (Value Stack) ── */}
      <section className="bg-sand-100 border-b border-sand-300">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">WHAT YOU GET WITH MIND<span className="text-rust-500">VAULT</span></p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight max-w-2xl">
            What the system handles from day one.
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Instant Lead Response</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Every call, form fill, and text gets a fast response. Nights and weekends included. Do not lose a good lead to voicemail again.</p>
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
                <p className="text-sm text-stone-600 leading-relaxed">See every lead, every response time, every booked job, and every handoff that still needs a human. Know what is moving and what is stuck.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Missed Call Text-Back</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Every missed call gets a fast text-back and a clean recovery path. A hot lead should not disappear because the team was busy.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Automated Review Collection</h3>
                <p className="text-sm text-stone-600 leading-relaxed">When jobs complete, the system sends review requests by text and email. Build your Google reputation while the team focuses on the next job.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rust-500 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-onyx mb-1">Scheduling &amp; Booking</h3>
                <p className="text-sm text-stone-600 leading-relaxed">Leads get booked directly onto your calendar. Estimates, follow-ups, and crew scheduling stay moving without the usual back-and-forth texts.</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              Book Your Discovery Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Ready-Made Workflows ── */}
      <section id="workflows" className="bg-charcoal-900 border-y border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4 text-center">READY-MADE WORKFLOWS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight mb-4">
            Start with the workflow where money is leaking first.
          </h2>
          <p className="text-stone-400 text-center max-w-2xl mx-auto mb-6 leading-relaxed">
            These are the common starting points. We install the first one, tighten it, then expand once the first win is working in the real world.
          </p>
          <div className="flex justify-center gap-3 mb-14 flex-wrap">
            {['All', 'Leads', 'Communication', 'Scheduling', 'Revenue'].map((cat) => (
              <button key={cat} onClick={() => setWfFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${wfFilter === cat ? 'bg-rust-500 text-white' : 'bg-charcoal-800 text-stone-400 border border-charcoal-700 hover:border-stone-500'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '⚡', name: 'Speed-to-Lead Response', desc: 'Replies to every new lead fast. Asks the right questions. Books the appointment.', tag: 'Leads', tagColor: 'bg-amber-900/60 text-amber-300', trigger: 'Auto, responds to every new email' },
              { icon: '🔁', name: 'Lead Follow-Up Sequence', desc: 'Cold leads get re-engaged automatically at Day 3, Day 7, Day 14. No lead falls through.', tag: 'Leads', tagColor: 'bg-amber-900/60 text-amber-300', trigger: 'Runs 3x daily' },
              { icon: '🌿', name: 'Dead Lead Revival', desc: 'Monthly campaign that breathes life into old leads with a fresh angle or seasonal offer.', tag: 'Leads', tagColor: 'bg-amber-900/60 text-amber-300', trigger: 'Weekly, every Monday' },
              { icon: '⭐', name: 'Review Request', desc: 'After every completed job, the system emails the customer with a direct Google review link.', tag: 'Communication', tagColor: 'bg-blue-900/60 text-blue-300', trigger: 'Triggered when job is marked done' },
              { icon: '📅', name: 'Appointment Reminders', desc: 'Sends 24-hour and 2-hour reminders. Reduces no-shows. Easy reschedule if needed.', tag: 'Communication', tagColor: 'bg-blue-900/60 text-blue-300', trigger: 'Checks hourly' },
              { icon: '💌', name: 'Post-Job Thank You', desc: 'Two hours after a job: thank you, next steps, and a gentle referral ask. Set it and forget it.', tag: 'Communication', tagColor: 'bg-blue-900/60 text-blue-300', trigger: 'Triggered when job is marked done' },
              { icon: '📆', name: 'Appointment Booking', desc: 'Detects when someone wants to schedule and proposes available times from your calendar.', tag: 'Scheduling', tagColor: 'bg-purple-900/60 text-purple-300', trigger: 'Auto, detects booking intent' },
              { icon: '🚨', name: 'Emergency Call Triage', desc: 'Burst pipe? No heat? Flags urgent keywords instantly and prioritizes the response.', tag: 'Scheduling', tagColor: 'bg-purple-900/60 text-purple-300', trigger: 'Auto, priority flag on every email' },
              { icon: '💰', name: 'Estimate Follow-Up', desc: 'Tracks every estimate you send. If no response comes in after 3 days, the system follows up with a check-in.', tag: 'Revenue', tagColor: 'bg-green-900/60 text-green-300', trigger: 'Runs daily at 10am' },
            ].filter(wf => wfFilter === 'All' || wf.tag === wfFilter).map((wf) => (
              <div key={wf.name} className="bg-charcoal-800 rounded-xl border border-charcoal-700 p-5 hover:border-stone-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{wf.icon}</span>
                    <span className="text-sm font-bold text-white">{wf.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${wf.tagColor}`}>{wf.tag}</span>
                </div>
                <p className="text-sm text-stone-400 leading-relaxed mb-4">{wf.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {wf.trigger}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-400 text-sm mb-6">These are just the starting point. Your Mind<span className="text-rust-500">Vault</span> system learns your business and adapts every workflow over time.</p>
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
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
              <p className="text-stone-400 text-sm leading-relaxed">Every lead gets answered. Every estimate gets followed up. Missed calls get texted back. The system learns your scripts, pricing, and scheduling patterns.</p>
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
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
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
            Useful tools first. Managed systems next.
          </h2>
          <p className="mt-3 text-stone-600 max-w-lg">
            Every tool below is built for service businesses. Use them to tighten lead response, follow-up, reviews, booking, and operations.
          </p>
          <p className="mt-2 text-sm font-semibold text-rust-500">Use the tools now. When we work together, we turn the best ideas into systems your team can actually run.</p>

          {/* Growth Scorecard Hero Card */}
          <div className="mt-10">
            <a href={submitted ? "#/growth-scorecard" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-charcoal-900 rounded-2xl p-8 hover:bg-charcoal-800 transition-all hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-rust-500 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-700 text-white text-xs font-bold uppercase tracking-wider mb-2">Start Here</span>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Growth Scorecard</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xl">10 questions. 60 seconds. See exactly where your business is losing money and get a personalized action plan to fix it.</p>
                </div>
                <div className="hidden sm:flex items-center text-rust-500 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Take the quiz
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </a>
          </div>

          {/* Tool Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* BizCard */}
            <a href={submitted ? "https://bizcard.mindvaultstudio.net" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rust-500">Popular</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Digital Business Card</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Professional card with QR code in 30 seconds. Download, share, done.</p>
                </div>
              </div>
            </a>
            {/* ROI Calculator */}
            <a href={submitted ? "#/roi-calculator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Lead Response ROI Calculator</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">See how much money slow response costs you every single month.</p>
                </div>
              </div>
            </a>
            {/* Follow-Up Generator */}
            <a href={submitted ? "#/follow-up-generator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Follow-Up Sequence Generator</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">5-step follow-up sequence for your industry. Copy, paste, send.</p>
                </div>
              </div>
            </a>
            {/* Estimate Tracker */}
            <a href={submitted ? "#/estimate-tracker" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Estimate Tracker</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Track every estimate from sent to won. Know what is pending, what is cold, and what needs a nudge.</p>
                </div>
              </div>
            </a>
            {/* Review Request Generator */}
            <a href={submitted ? "#/review-request-generator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Review Request Generator</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Ready-to-send review request templates for text and email. Your MindVault system sends them automatically when jobs complete.</p>
                </div>
              </div>
            </a>
            {/* Onboarding Checklist */}
            <a href={submitted ? "#/onboarding-checklist" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">New Hire Onboarding Checklist</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Build a custom onboarding checklist for your industry. Get new hires productive faster.</p>
                </div>
              </div>
            </a>
            {/* Solar Savings Calculator */}
            <a href={submitted ? "#/solar-savings-calculator" : "#lead-capture"} onClick={e => { if (!submitted) { e.preventDefault(); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }) } }}
              className="group block bg-white rounded-xl border border-sand-300 p-5 hover:border-rust-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Free Tool</span>
                  <h3 className="text-base font-bold text-onyx mt-0.5 mb-0.5">Solar Savings Calculator</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Show homeowners their real savings. Built for solar companies closing deals in the field.</p>
                </div>
              </div>
            </a>
          </div>

          {/* Premium hint */}
          <div className="mt-8 rounded-lg bg-white border border-sand-300 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-onyx">Every tool has a premium version.</p>
              <p className="text-xs text-stone-500 mt-1">When you join Mind<span className="text-rust-500">Vault</span> Studio, your AI agents customize these tools to match your business. Your scripts. Your pricing. Your follow-up cadence. Or we build new ones from scratch.</p>
            </div>
            <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-rust-500 text-white font-semibold text-sm hover:bg-rust-600 transition-colors">
              See Premium Tools
            </a>
          </div>

          {/* Email capture */}
          <div id="lead-capture" className="mt-10 max-w-md">
            <p className="text-sm font-bold text-onyx mb-1">Unlock All 8 Tools Free</p>
            <p className="text-xs text-stone-500 mb-3">Drop your email. Use every tool right now, no strings attached. See what Mind<span className="text-rust-500">Vault</span> is about before you ever talk to us.</p>
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
                <p className="text-center text-xs text-stone-400">We respect your inbox. Unsubscribe anytime. <a href="/privacy" className="underline hover:text-stone-600">Privacy Policy</a></p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── What Changes ── */}
      <section className="bg-sand-100">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4">WHAT CHANGES</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-onyx tracking-tight mb-5 max-w-2xl">
            Growth gets safer because the back office stops depending on memory and hustle.
          </h2>
          <p className="text-stone-600 max-w-2xl leading-relaxed mb-12">
            This is the owner shift. The team works from a cleaner queue, the weak spots become visible, and growth feels calmer to handle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-sand-300 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Before</p>
              <h3 className="text-2xl font-extrabold text-onyx mb-5">Held together by hustle</h3>
              <ul className="space-y-3 text-sm text-stone-600 leading-relaxed">
                <li>Follow-up depends on who remembered</li>
                <li>The team is always catching up</li>
                <li>Growth creates more mess</li>
                <li>The owner has to chase everything down</li>
              </ul>
            </div>
            <div className="bg-charcoal-900 rounded-2xl border border-charcoal-700 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">After</p>
              <h3 className="text-2xl font-extrabold text-white mb-5">Built to handle growth</h3>
              <ul className="space-y-3 text-sm text-stone-400 leading-relaxed">
                <li>Leads get touched right away</li>
                <li>The team works from a cleaner queue</li>
                <li>Bottlenecks become visible</li>
                <li>Growth gets safer without dropping quality</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Next Step ── */}
      <section className="bg-charcoal-900 text-white border-t border-charcoal-700">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-4 text-center">THE NEXT STEP</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5 text-center">
            Start where the money is leaking first.
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-center mb-12 leading-relaxed">
            You do not need everything at once. You need the first win in the place where jobs are being lost today.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-charcoal-800 rounded-2xl border border-charcoal-700 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">Step 1</p>
              <h3 className="text-xl font-bold mb-3">Look at your current workflow</h3>
              <p className="text-sm text-stone-400 leading-relaxed">How leads come in, where follow-up breaks, and what slows the path from inquiry to booked job.</p>
            </div>
            <div className="bg-charcoal-800 rounded-2xl border border-charcoal-700 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">Step 2</p>
              <h3 className="text-xl font-bold mb-3">Find the first bottleneck</h3>
              <p className="text-sm text-stone-400 leading-relaxed">We identify the place where money is leaking today, not the ten things that can wait.</p>
            </div>
            <div className="bg-charcoal-800 rounded-2xl border border-charcoal-700 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-rust-500 mb-3">Step 3</p>
              <h3 className="text-xl font-bold mb-3">Build the first system around it</h3>
              <p className="text-sm text-stone-400 leading-relaxed">Then we tighten it, measure it, and expand once the first win is working in the real world.</p>
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
          <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
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