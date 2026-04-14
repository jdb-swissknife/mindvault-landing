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
  { value: 'general', label: 'General Contractor' },
]

type Template = { channel: string; subject: string; body: string }

function generateTemplates(industry: string, bizName: string): Template[] {
  const lower = INDUSTRIES.find(i => i.value === industry)?.label.toLowerCase() || 'service'

  return [
    {
      channel: 'Text Message',
      subject: '',
      body: `Hi {name}, this is {your name} from ${bizName}. Your ${lower} job is all wrapped up. Thanks for trusting us with it! If you had a good experience, would you mind leaving us a quick review? It takes 30 seconds and it means a lot to our small business.\n\n{review_link}\n\nThanks again!`
    },
    {
      channel: 'Email',
      subject: `Your ${lower} job is done -- could you help us out?`,
      body: `Hi {name},\n\nYour ${lower} project with ${bizName} is complete and I hope you're happy with the result.\n\nI have a small favor to ask. As a local business, reviews are everything for us. If you had a good experience, would you take 30 seconds to leave us one?\n\n{review_link}\n\nIt genuinely helps us keep doing what we do. And if anything wasn't right, reply to this email and I'll make it right personally.\n\nThanks,\n{your name}\n${bizName}`
    },
    {
      channel: 'Follow-up Text (2 days later)',
      subject: '',
      body: `Hey {name}, just a quick follow-up. Hope you're loving the ${lower} work we did. If you haven't had a chance to leave a review yet, here's the link again:\n\n{review_link}\n\nNo pressure at all. Just helps us grow. Thanks!`
    }
  ]
}

export default function ReviewRequestGen() {
  const [industry, setIndustry] = useState('')
  const [bizName, setBizName] = useState('')
  const [templates, setTemplates] = useState<Template[] | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setTemplates(generateTemplates(industry, bizName))
  }

  const copyTemplate = (t: Template, idx: number) => {
    const text = t.subject
      ? `Subject: ${t.subject}\n\n${t.body}`
      : t.body
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    if (!templates) return
    const all = templates.map(t =>
      t.subject
        ? `--- ${t.channel} ---\nSubject: ${t.subject}\n\n${t.body}`
        : `--- ${t.channel} ---\n${t.body}`
    ).join('\n\n')
    navigator.clipboard.writeText(all)
    setCopied(-1)
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
            Review Request<br />Generator
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            Pick your industry, enter your business name, get ready-to-send review request templates for text and email. Copy, paste, send.
          </p>
        </div>

        {!templates ? (
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
              Generate My Review Requests
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Copy all */}
            <div className="flex justify-end">
              <button onClick={copyAll}
                className="text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors flex items-center gap-1.5">
                {copied === -1 ? 'Copied!' : 'Copy All 3 Templates'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>

            {templates.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium text-white bg-navy-500/80 px-1.5 py-0.5 rounded">{t.channel}</span>
                  <button onClick={() => copyTemplate(t, i)}
                    className="text-xs font-medium text-navy-500 hover:text-navy-900 transition-colors">
                    {copied === i ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {t.subject && (
                  <p className="text-xs font-semibold text-gray-500 mb-2">Subject: {t.subject}</p>
                )}
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{t.body}</p>
              </div>
            ))}

            <div className="bg-navy-50 border border-navy-500/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-navy-900 mb-1">Stop sending these manually.</p>
              <p className="text-xs text-navy-700/70">Your AI Foreman sends review requests automatically by text and email the moment a job is marked complete. No copy-paste. No forgetting. Every customer gets asked, every time.</p>
            </div>

            <div className="pt-4 text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Automate Review Requests with AI
              </a>
              <button onClick={() => setTemplates(null)}
                className="text-sm text-gray-400 hover:text-navy-900 transition-colors underline">
                Generate different templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
