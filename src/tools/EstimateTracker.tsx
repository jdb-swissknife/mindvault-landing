import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const JOB_TYPES = ['Roofing', 'Solar', 'HVAC', 'Plumbing', 'Tree Service', 'Pest Control', 'Landscaping', 'Electrical', 'General', 'Other']


type Estimate = {
  id: string
  customer: string
  jobType: string
  value: number
  dateSent: string
  status: string
  followUpDate: string
}

function loadEstimates(): Estimate[] {
  try {
    const data = localStorage.getItem('mv-estimates')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveEstimates(estimates: Estimate[]) {
  localStorage.setItem('mv-estimates', JSON.stringify(estimates))
}

function daysBetween(d1: string, d2: Date): number {
  return Math.floor((d2.getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24))
}

export default function EstimateTracker() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [showForm, setShowForm] = useState(false)
  const [customer, setCustomer] = useState('')
  const [jobType, setJobType] = useState('')
  const [value, setValue] = useState('')
  const [dateSent, setDateSent] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { setEstimates(loadEstimates()) }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const newEst: Estimate = {
      id: Date.now().toString(),
      customer,
      jobType,
      value: parseFloat(value) || 0,
      dateSent,
      status: 'pending',
      followUpDate: ''
    }
    const updated = [newEst, ...estimates]
    setEstimates(updated)
    saveEstimates(updated)
    setCustomer('')
    setJobType('')
    setValue('')
    setShowForm(false)
  }

  const updateStatus = (id: string, status: string) => {
    const updated = estimates.map(est =>
      est.id === id ? { ...est, status, followUpDate: status === 'followed-up' ? new Date().toISOString().split('T')[0] : est.followUpDate } : est
    )
    setEstimates(updated)
    saveEstimates(updated)
  }

  const deleteEst = (id: string) => {
    const updated = estimates.filter(est => est.id !== id)
    setEstimates(updated)
    saveEstimates(updated)
  }

  const today = new Date()
  const pending = estimates.filter(e => e.status === 'pending')
  const overdue3 = pending.filter(e => daysBetween(e.dateSent, today) >= 3)
  const totalPendingValue = pending.reduce((sum, e) => sum + e.value, 0)
  const overdueValue = overdue3.reduce((sum, e) => sum + e.value, 0)
  const booked = estimates.filter(e => e.status === 'booked')
  const closed = estimates.filter(e => e.status === 'booked' || e.status === 'lost')
  const closeRate = closed.length > 0 ? Math.round((booked.length / closed.length) * 100) : 0

  const getRowStyle = (est: Estimate) => {
    if (est.status !== 'pending') return 'bg-white border-gray-200'
    const days = daysBetween(est.dateSent, today)
    if (days >= 7) return 'bg-red-50 border-red-200'
    if (days >= 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-gray-200'
  }

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

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-full">Free Tool</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Estimate<br />Follow-Up Tracker
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            Track your pending estimates. See which ones are overdue. Never let a deal go cold again.
          </p>
        </div>

        {/* Summary stats */}
        {estimates.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-xl font-bold text-gray-900">{pending.length}</p>
              <p className="text-xs text-gray-400">${totalPendingValue.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-600">Overdue (3+ days)</p>
              <p className="text-xl font-bold text-amber-700">{overdue3.length}</p>
              <p className="text-xs text-amber-600">${overdueValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600">Booked</p>
              <p className="text-xl font-bold text-green-700">{booked.length}</p>
            </div>
            <div className="bg-navy-50 rounded-xl p-3 text-center">
              <p className="text-xs text-navy-500">Close rate</p>
              <p className="text-xl font-bold text-navy-900">{closeRate}%</p>
            </div>
          </div>
        )}

        {/* Add estimate */}
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-medium text-sm hover:border-navy-500 hover:text-navy-500 transition-colors mb-6">
            + Add an Estimate
          </button>
        ) : (
          <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer name</label>
                <input type="text" required placeholder="John Smith"
                  value={customer} onChange={e => setCustomer(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Job type</label>
                <select required value={jobType} onChange={e => setJobType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="">Select</option>
                  {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estimate value ($)</label>
                <input type="number" required min="1" placeholder="5000"
                  value={value} onChange={e => setValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date sent</label>
                <input type="date" required value={dateSent} onChange={e => setDateSent(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500"/>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Add Estimate
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Estimate list */}
        {estimates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No estimates yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {estimates.map(est => {
              const days = daysBetween(est.dateSent, today)
              return (
                <div key={est.id} className={`rounded-xl border p-4 ${getRowStyle(est)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{est.customer}</span>
                        <span className="text-[11px] font-medium text-navy-500 bg-navy-50 px-1.5 py-0.5 rounded">{est.jobType}</span>
                        {est.status === 'pending' && days >= 3 && (
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${days >= 7 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {days}d overdue
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-gray-900">${est.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Sent {est.dateSent}{est.status !== 'pending' && ` | ${est.status}`}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {est.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(est.id, 'followed-up')}
                            className="px-2.5 py-1.5 rounded text-xs font-medium bg-navy-900 text-white hover:bg-navy-950 transition-colors">
                            Followed Up
                          </button>
                          <button onClick={() => updateStatus(est.id, 'booked')}
                            className="px-2.5 py-1.5 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors">
                            Booked
                          </button>
                          <button onClick={() => updateStatus(est.id, 'lost')}
                            className="px-2.5 py-1.5 rounded text-xs font-medium bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors">
                            Lost
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteEst(est.id)}
                        className="px-2 py-1.5 rounded text-xs text-gray-400 hover:text-red-500 transition-colors">
                        X
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {estimates.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="bg-navy-50 border border-navy-500/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-navy-900 mb-1">MindVault Pro</p>
              <p className="text-xs text-navy-700/70">Pro members get automated follow-up reminders by text and email, pipeline analytics, and AI that follows up on cold estimates automatically.</p>
            </div>

            <div className="text-center">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Automate My Estimate Follow-Ups
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
