import { useState } from 'react'
import { Link } from 'react-router-dom'

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

function getGrade(score: number) {
  if (score >= 9) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  if (score >= 7) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  if (score >= 5) return { letter: 'C', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  if (score >= 3) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { letter: 'F', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
}

export default function GrowthScorecard() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [showResult, setShowResult] = useState(false)

  const setAnswer = (id: number, val: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  const handleScore = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
  }

  const score = Object.values(answers).filter(Boolean).length
  const grade = getGrade(score)
  const missed = QUESTIONS.filter(q => !answers[q.id])

  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 200 200">
              <path d="M100,8 L180,48 L180,115 Q180,168 100,195 Q20,168 20,115 L20,48 Z" fill="#1a2a6c" stroke="#1a2a6c" strokeWidth="6" strokeLinejoin="miter"/>
              <path d="M100,22 L168,56 L168,112 Q168,158 100,182 Q32,158 32,112 L32,56 Z" fill="none" stroke="#4f6ef7" strokeWidth="2.5" strokeLinejoin="miter"/>
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M52,138 L52,80 L77,110 L100,80 L100,138" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#4f6ef7" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M100,80 L126,122 L152,80" fill="none" stroke="#1a2a6c" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter"/>
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
          <form onSubmit={handleScore} className="space-y-4">
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
            <button type="submit" disabled={Object.keys(answers).length < 10}
              className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {Object.keys(answers).length < 10 ? `Answer all 10 questions (${Object.keys(answers).length}/10)` : 'Get My Score'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Grade */}
            <div className={`${grade.bg} border ${grade.border} rounded-xl p-6 text-center`}>
              <p className="text-sm font-medium text-gray-600 mb-2">Your Growth Score</p>
              <p className={`text-7xl font-extrabold ${grade.color}`}>{grade.letter}</p>
              <p className="text-sm text-gray-500 mt-2">{score} out of 10</p>
            </div>

            {missed.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">What to fix ({missed.length} gaps found)</h3>
                <div className="space-y-3">
                  {missed.map(q => (
                    <div key={q.id} className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-800 mb-1">Missing: {q.q.replace('Do you ', '').replace('?', '')}</p>
                      <p className="text-xs text-red-600">{q.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missed.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-sm font-bold text-green-800">You're ahead of the pack.</p>
                <p className="text-xs text-green-600 mt-1">But there's always room to grow. Let us show you what AI agents can do on top of your existing systems.</p>
              </div>
            )}

            <div className="bg-navy-50 border border-navy-500/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-navy-900 mb-1">MindVault Pro</p>
              <p className="text-xs text-navy-700/70">Pro members get a full operational audit with a prioritized roadmap, custom automation plan, and ongoing AI agent management.</p>
            </div>

            <div className="text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Get a Free Audit to Fix Your Gaps
              </a>
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
