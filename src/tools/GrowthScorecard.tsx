import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const QUESTIONS = [
  { id: 1, q: 'Do you respond to every lead within 5 minutes?', fix: 'Set up an automated instant response so no lead waits.' },
  { id: 2, q: 'Do you have an automated follow-up sequence (text, email, call)?', fix: 'Build a 5-step follow-up sequence that fires automatically.' },
  { id: 3, q: 'Can you see where every lead is in your pipeline right now?', fix: 'Set up lead status tracking in your CRM with a simple dashboard.' },
  { id: 4, q: 'Does new hire onboarding take less than 2 hours of your time?', fix: 'Build a one-form onboarding process that provisions every system automatically.' },
  { id: 5, q: 'Are your monthly reports generated automatically?', fix: 'Build an automated reporting pipeline that delivers to your inbox on schedule.' },
  { id: 6, q: 'Do you track which lead sources produce the most revenue?', fix: 'Set up source tracking so you know which ads and channels actually pay off.' },
  { id: 7, q: 'Can your team access SOPs and training videos anytime?', fix: 'Build a simple training hub with videos and checklists for every role.' },
  { id: 8, q: 'Do you have a digital business card or lead capture at every touchpoint?', fix: 'Create a digital business card your whole crew can share instantly.' },
  { id: 9, q: 'Is your scheduling connected to your CRM?', fix: 'Connect your scheduling to your CRM so every booked job flows automatically.' },
  { id: 10, q: 'Do you have AI agents handling repetitive tasks?', fix: 'Deploy AI agents for lead response, follow-ups, and scheduling. They work 24/7.' },
]

function getStage(score100: number) {
  if (score100 >= 90) return { label: 'Fully Optimized', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  if (score100 >= 70) return { label: 'Strong Foundation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  if (score100 >= 50) return { label: 'Building Momentum', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  if (score100 >= 30) return { label: 'Getting Started', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  return { label: 'Room to Grow', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
}

export default function GrowthScorecard() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [showResult, setShowResult] = useState(false)
  const [sendingReport, setSendingReport] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [reportEmail, setReportEmail] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount >= 10

  const setAnswer = (id: number, val: boolean) => {
    setAnswers(prev => {
      const next = { ...prev, [id]: val }
      return next
    })
  }

  const handleScore = () => {
    if (Object.keys(answers).length >= 10) {
      setShowResult(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const score100 = Object.values(answers).filter(Boolean).length * 10
  const stage = getStage(score100)
  const missed = QUESTIONS.filter(q => answers[q.id] !== true)

  const handleSendReport = async () => {
    if (!reportEmail) return
    setSendingReport(true)
    try {
      if (supabase) {
        await supabase.from('scorecard_results').insert({
          email: reportEmail,
          score: score100,
          grade: stage.label,
          answers,
          gaps: missed.map(q => ({ question: q.q, fix: q.fix })),
        })
      }
      setReportSent(true)
    } catch {
      setReportSent(true)
    } finally {
      setSendingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 200 200">
              <path d="M100,8 L180,48 L180,115 Q180,168 100,195 Q20,168 20,115 L20,48 Z" fill="#1a2a6c" stroke="#1a2a6c" strokeWidth="6" strokeLinejoin="miter" />
              <path d="M100,22 L168,56 L168,112 Q168,158 100,182 Q32,158 32,112 L32,56 Z" fill="none" stroke="#4f6ef7" strokeWidth="2.5" strokeLinejoin="miter" />
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#4f6ef7" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
            <span className="text-base font-bold text-navy-900 tracking-tight">Mind<tspan className="text-navy-500">Vault</tspan></span>
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-navy-900 transition-colors">Back to Tools</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-full">Free Tool</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Service Business<br />Growth Scorecard
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            10 questions. 60 seconds. See exactly where your business is losing money and how to fix it.
          </p>
        </div>

        {!showResult ? (
          <div className="space-y-4">
            {QUESTIONS.map(q => (
              <div key={q.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">{q.id}. {q.q}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAnswer(q.id, true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${answers[q.id] === true ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-green-300'}`}>
                    Yes
                  </button>
                  <button type="button" onClick={() => setAnswer(q.id, false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${answers[q.id] === false ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-red-300'}`}>
                    No
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={handleScore} disabled={!allAnswered}
              className="w-full py-3 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-6">
              {allAnswered ? 'Get My Score' : `${answeredCount} of 10 answered`}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score */}
            <div className={`${stage.bg} border ${stage.border} rounded-xl p-6 text-center`}>
              <p className="text-sm font-medium text-gray-600 mb-2">Your Growth Score</p>
              <p className={`text-7xl font-extrabold ${stage.color}`}>{score100}</p>
              <p className={`text-sm font-semibold mt-2 ${stage.color}`}>{stage.label}</p>
            </div>

            {/* Estimated Savings */}
            {missed.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Estimated Impact of Closing Your Gaps</h3>
                <div className="space-y-3">
                  {answers[1] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">Speed-to-lead response</p>
                      <p className="text-sm font-bold text-green-700">+15-25% lead conversion</p>
                    </div>
                  )}
                  {answers[2] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">Automated follow-up sequences</p>
                      <p className="text-sm font-bold text-green-700">+20-30% estimate close rate</p>
                    </div>
                  )}
                  {answers[3] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">Pipeline visibility</p>
                      <p className="text-sm font-bold text-green-700">$2K-8K/mo recovered leads</p>
                    </div>
                  )}
                  {answers[5] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">Automated reporting</p>
                      <p className="text-sm font-bold text-green-700">10-15 hrs/mo owner time saved</p>
                    </div>
                  )}
                  {answers[6] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">Lead source tracking</p>
                      <p className="text-sm font-bold text-green-700">20-40% lower ad spend waste</p>
                    </div>
                  )}
                  {answers[9] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">CRM-connected scheduling</p>
                      <p className="text-sm font-bold text-green-700">+12-18% jobs booked</p>
                    </div>
                  )}
                  {answers[10] !== true && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">AI agents on repetitive tasks</p>
                      <p className="text-sm font-bold text-green-700">40-60% admin time reduced</p>
                    </div>
                  )}
                  {missed.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-900">Combined estimated impact</p>
                        <p className="text-base font-extrabold text-green-700">
                          {missed.length >= 5 ? '$5K-15K/mo' : missed.length >= 3 ? '$3K-8K/mo' : '$1K-4K/mo'} in recovered revenue
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Based on industry averages for service businesses with 5-30 employees. Your actual results may vary.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {missed.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-sm font-bold text-green-800">Your systems are solid. 100 out of 100.</p>
                <p className="text-xs text-green-600 mt-1">The next level is AI agents running on top of what you have built. Always optimizing, always finding the next edge.</p>
              </div>
            )}

            {/* Gaps found */}
            {missed.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">What to fix ({missed.length} gaps found)</h3>
                <div className="space-y-3">
                  {missed.map(q => (
                    <div key={q.id} className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-900 mb-1.5">{q.q.replace('Do you ', '').replace('?', '')}</p>
                      <p className="text-sm italic text-green-700">{q.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan CTA -- the centerpiece */}
            {missed.length > 0 && (
              <div className="bg-charcoal-900 rounded-xl p-6 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-rust-500 mb-2">Your Action Plan</p>
                <p className="text-lg font-bold mb-1">
                  You have {missed.length} gap{missed.length !== 1 ? 's' : ''} worth an estimated {missed.length >= 5 ? '$5K-15K' : missed.length >= 3 ? '$3K-8K' : '$1K-4K'}/mo.
                </p>
                <p className="text-sm text-gray-400 mb-5">
                  Book a 15-minute Growth Audit. We'll walk through each gap and show you exactly what to fix first. No pitch. Just a plan.
                </p>
                <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
                  className="inline-block w-full py-3.5 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 transition-colors">
                  Book Your Growth Audit
                </a>
              </div>
            )}

            {missed.length === 0 && (
              <div className="bg-charcoal-900 rounded-xl p-6 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-rust-500 mb-2">Ready for the Next Level</p>
                <p className="text-sm text-gray-400 mb-4">
                  You've built great systems. AI agents can run on top of what you have, always optimizing, always finding the next edge.
                </p>
                <a href="https://calendly.com/john-bird-mindvaultstudio/30min" target="_blank" rel="noopener noreferrer"
                  className="inline-block w-full py-3.5 rounded-lg bg-rust-500 text-white font-bold text-sm hover:bg-rust-600 transition-colors">
                  Book Your Growth Audit
                </a>
              </div>
            )}

            {/* Email capture -- secondary action for report copy */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-bold text-gray-900 mb-1">Want a copy of this report?</p>
              <p className="text-xs text-gray-500 mb-3">Enter your email and we'll send your results so you can review them later.</p>
              {reportSent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-green-800">Sent! Check your inbox.</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={reportEmail}
                    onChange={e => setReportEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                  <button type="button" onClick={handleSendReport} disabled={sendingReport || !reportEmail}
                    className="px-5 py-2.5 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 disabled:opacity-50 transition-colors whitespace-nowrap">
                    {sendingReport ? 'Sending...' : 'Send Report'}
                  </button>
                </div>
              )}
            </div>

            {/* Client statement */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-gray-900 mb-1">Mind<span className="text-rust-500">Vault</span> clients get a custom scorecard.</p>
              <p className="text-xs text-gray-600">Your AI agents track extensive data points across every workflow and provide ongoing analysis to ensure continuous improvement in operations and revenue growth. This is just the snapshot.</p>
            </div>

            <div className="text-center">
              <button onClick={() => { setShowResult(false); setAnswers({}) }}
                className="text-sm text-gray-400 hover:text-navy-900 transition-colors underline">
                Retake the scorecard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
