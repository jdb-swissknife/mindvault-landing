import { useState } from 'react'
import { Link } from 'react-router-dom'

const INDUSTRIES = [
  { value: 'roofing', label: 'Roofing' },
  { value: 'solar', label: 'Solar' },
  { value: 'tree', label: 'Tree Service' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal', label: 'Legal' },
  { value: 'general', label: 'General Contractor' },
]

type Sequence = { step: number; timing: string; channel: string; subject: string; body: string }

function generateSequence(industry: string, bizName: string): Sequence[] {
  const industryLabel = INDUSTRIES.find(i => i.value === industry)?.label || 'service'
  const lower = industryLabel.toLowerCase()

  return [
    {
      step: 1,
      timing: 'Immediately',
      channel: 'Text',
      subject: '',
      body: `Hi {name}, this is ${bizName}. Thanks for reaching out about your ${lower} needs! I wanted to touch base right away. When's a good time for a quick call?`
    },
    {
      step: 2,
      timing: '1 hour later',
      channel: 'Email',
      subject: `Thanks for contacting ${bizName}`,
      body: `Hi {name},\n\nThanks for reaching out to ${bizName}. I know you have options when it comes to ${lower}, and I appreciate you considering us.\n\nI'd love to learn more about what you need so I can give you an accurate estimate. Could you reply with a couple details about your project?\n\nBest,\n{your name}\n${bizName}`
    },
    {
      step: 3,
      timing: '24 hours later',
      channel: 'Text',
      subject: '',
      body: `Hey {name}, just checking in. Still interested in getting that ${lower} quote? Happy to work around your schedule. Just say the word.`
    },
    {
      step: 4,
      timing: '3 days later',
      channel: 'Email',
      subject: `Your ${industryLabel} quote from ${bizName}`,
      body: `Hi {name},\n\nI noticed we haven't connected yet and wanted to follow up one more time.\n\nAt ${bizName}, we pride ourselves on honest quotes and showing up on time. Even if you go with someone else, I'm happy to give you a second opinion on your project so you know you're getting a fair deal.\n\nJust reply to this email or call us at {phone}.\n\n{your name}\n${bizName}`
    },
    {
      step: 5,
      timing: '7 days later',
      channel: 'Text',
      subject: '',
      body: `Hey {name}, last check-in from ${bizName}. No pressure either way. If you still need ${lower} help, we're here. Save my number for whenever you're ready.`
    }
  ]
}

export default function FollowUpGen() {
  const [industry, setIndustry] = useState('')
  const [bizName, setBizName] = useState('')
  const [sequence, setSequence] = useState<Sequence[] | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setSequence(generateSequence(industry, bizName))
  }

  const copyStep = (seq: Sequence) => {
    const text = seq.channel === 'Text'
      ? seq.body
      : `Subject: ${seq.subject}\n\n${seq.body}`
    navigator.clipboard.writeText(text)
    setCopied(seq.step)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    if (!sequence) return
    const all = sequence.map(s =>
      s.channel === 'Text'
        ? `--- Step ${s.step} (${s.timing}) - ${s.channel} ---\n${s.body}`
        : `--- Step ${s.step} (${s.timing}) - ${s.channel} ---\nSubject: ${s.subject}\n\n${s.body}`
    ).join('\n\n')
    navigator.clipboard.writeText(all)
    setCopied(0)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif]">
      {/* Nav */}
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
            Follow-Up<br />Sequence Generator
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            Pick your industry, enter your business name, get a ready-to-use 5-step follow-up sequence. Copy, paste, send.
          </p>
        </div>

        {!sequence ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your industry</label>
              <select
                required
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              >
                <option value="">Select your industry</option>
                {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
              <input
                type="text"
                required
                placeholder="e.g. Twin Cities Roofing"
                value={bizName}
                onChange={e => setBizName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
              Generate My Follow-Up Sequence
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Copy all */}
            <div className="flex justify-end">
              <button onClick={copyAll}
                className="text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors flex items-center gap-1.5">
                {copied === 0 ? 'Copied!' : 'Copy All 5 Steps'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>

            {sequence.map(s => (
              <div key={s.step} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-navy-500 text-white text-xs font-bold flex items-center justify-center">{s.step}</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{s.timing}</span>
                      <span className="ml-2 text-[11px] font-medium text-white bg-navy-500/80 px-1.5 py-0.5 rounded">{s.channel}</span>
                    </div>
                  </div>
                  <button onClick={() => copyStep(s)}
                    className="text-xs font-medium text-navy-500 hover:text-navy-900 transition-colors">
                    {copied === s.step ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {s.subject && (
                  <p className="text-xs font-semibold text-gray-500 mb-2">Subject: {s.subject}</p>
                )}
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{s.body}</p>
              </div>
            ))}

            <div className="pt-4 text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Automate This Entire Sequence with AI
              </a>
              <button onClick={() => setSequence(null)}
                className="text-sm text-gray-400 hover:text-navy-900 transition-colors underline">
                Generate a different sequence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
