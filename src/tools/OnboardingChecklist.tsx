import { useState } from 'react'
import { Link } from 'react-router-dom'

const SYSTEMS = [
  { id: 'crm', label: 'CRM (FieldRoutes, ServiceTitan, etc.)' },
  { id: 'quickbooks', label: 'QuickBooks' },
  { id: 'google', label: 'Google Workspace (Email, Drive)' },
  { id: 'payment', label: 'Payment Platform (Square, Stripe, etc.)' },
  { id: 'scheduling', label: 'Scheduling / Dispatch Software' },
  { id: 'payroll', label: 'Payroll (ADP, Gusto, etc.)' },
  { id: 'training', label: 'Training Platform (LMS, SOPs)' },
  { id: 'phone', label: 'Phone System (VoIP)' },
]

type ChecklistItem = { task: string; system: string }
type ChecklistData = {
  bizName: string
  systems: string[]
  items: ChecklistItem[]
}

function generateChecklist(bizName: string, systems: string[]): ChecklistItem[] {
  const items: ChecklistItem[] = []

  // Always include these
  items.push({ task: 'Send welcome email with start date, dress code, and parking info', system: 'Email' })
  items.push({ task: 'Collect signed W-4 and I-9 forms', system: 'HR' })
  items.push({ task: 'Collect copies of ID and any certifications', system: 'HR' })
  items.push({ task: 'Add to company communication channel (text group, Slack, etc.)', system: 'Communication' })
  items.push({ task: 'Assign company vehicle or confirm personal vehicle requirements', system: 'Operations' })

  if (systems.includes('crm')) {
    items.push({ task: `Create user account in CRM`, system: 'CRM' })
    items.push({ task: 'Assign role and permissions (tech, sales, admin)', system: 'CRM' })
    items.push({ task: 'Add to routing board and assign territory', system: 'CRM' })
  }
  if (systems.includes('quickbooks')) {
    items.push({ task: 'Add employee in QuickBooks with payroll info', system: 'QuickBooks' })
    items.push({ task: 'Set up direct deposit or confirm pay method', system: 'QuickBooks' })
  }
  if (systems.includes('google')) {
    items.push({ task: 'Create company email address', system: 'Google Workspace' })
    items.push({ task: 'Add to relevant Google Drive folders', system: 'Google Workspace' })
    items.push({ task: 'Add to shared calendar', system: 'Google Workspace' })
  }
  if (systems.includes('payment')) {
    items.push({ task: 'Create account in payment platform', system: 'Payment' })
    items.push({ task: 'Link to CRM customer billing if applicable', system: 'Payment' })
  }
  if (systems.includes('scheduling')) {
    items.push({ task: 'Add to scheduling software', system: 'Scheduling' })
    items.push({ task: 'Assign shift pattern and availability', system: 'Scheduling' })
  }
  if (systems.includes('payroll')) {
    items.push({ task: 'Add to payroll system with tax withholdings', system: 'Payroll' })
    items.push({ task: 'Set up workers comp classification', system: 'Payroll' })
  }
  if (systems.includes('training')) {
    items.push({ task: 'Create training account', system: 'Training' })
    items.push({ task: 'Assign onboarding course / SOP videos', system: 'Training' })
  }
  if (systems.includes('phone')) {
    items.push({ task: 'Set up phone extension', system: 'Phone' })
    items.push({ task: 'Record voicemail greeting', system: 'Phone' })
  }

  // Final steps
  items.push({ task: 'Schedule 1-week check-in with manager', system: 'HR' })
  items.push({ task: `Print or share employee handbook (${bizName})`, system: 'HR' })

  return items
}

export default function OnboardingChecklist() {
  const [bizName, setBizName] = useState('')
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [checklist, setChecklist] = useState<ChecklistData | null>(null)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggleSystem = (id: string) => {
    setSelectedSystems(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const toggleChecked = (idx: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    const items = generateChecklist(bizName, selectedSystems)
    setChecklist({ bizName, systems: selectedSystems, items })
    setChecked(new Set())
  }

  const copyAll = () => {
    if (!checklist) return
    const text = `Onboarding Checklist - ${checklist.bizName}\n${'='.repeat(40)}\n\n` +
      checklist.items.map((item, i) =>
        `${checked.has(i) ? '[x]' : '[ ]'} ${item.system}: ${item.task}`
      ).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const progress = checklist ? Math.round((checked.size / checklist.items.length) * 100) : 0

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
            New Hire Onboarding<br />Checklist Builder
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            Pick your systems, get a complete checklist. Check off each item as you go. Copy or print when done.
          </p>
        </div>

        {!checklist ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
              <input type="text" required placeholder="e.g. Twin Cities Roofing"
                value={bizName} onChange={e => setBizName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Which systems do you use? (check all)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SYSTEMS.map(s => (
                  <label key={s.id} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${selectedSystems.includes(s.id) ? 'border-navy-500 bg-navy-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="checkbox" checked={selectedSystems.includes(s.id)} onChange={() => toggleSystem(s.id)}
                      className="rounded border-gray-300 text-navy-500 focus:ring-navy-500"/>
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
              Build My Checklist
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{checked.size} of {checklist.items.length} complete</span>
                <span className="text-sm font-bold text-navy-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-navy-500 rounded-full h-2 transition-all" style={{ width: `${progress}%` }}/>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button onClick={copyAll}
                className="text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors flex items-center gap-1.5">
                {copied ? 'Copied!' : 'Copy Checklist'}
              </button>
              <button onClick={() => window.print()}
                className="text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors flex items-center gap-1.5">
                Print
              </button>
            </div>

            {/* Items */}
            {checklist.items.map((item, i) => (
              <div key={i} onClick={() => toggleChecked(i)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${checked.has(i) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked.has(i) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {checked.has(i) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${checked.has(i) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.task}</p>
                  <span className="text-[11px] font-medium text-navy-500 bg-navy-50 px-1.5 py-0.5 rounded mt-1 inline-block">{item.system}</span>
                </div>
              </div>
            ))}

            <div className="bg-navy-50 border border-navy-500/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-navy-900 mb-1">MindVault Pro</p>
              <p className="text-xs text-navy-700/70">Pro members get one-form onboarding. New hire fills out a single intake form and every account provisions automatically across all your systems. Zero manual setup.</p>
            </div>

            <div className="text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Automate Your Onboarding
              </a>
              <button onClick={() => setChecklist(null)}
                className="text-sm text-gray-400 hover:text-navy-900 transition-colors underline">
                Build a different checklist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
