import { useState } from 'react'
import { Link } from 'react-router-dom'

const STATES = [
  { value: 'AZ', sun: 6.5 }, { value: 'CA', sun: 5.5 }, { value: 'CO', sun: 5.0 },
  { value: 'CT', sun: 4.0 }, { value: 'FL', sun: 5.0 }, { value: 'GA', sun: 4.5 },
  { value: 'IL', sun: 4.0 }, { value: 'MA', sun: 4.0 }, { value: 'MD', sun: 4.0 },
  { value: 'MI', sun: 3.5 }, { value: 'MN', sun: 4.0 }, { value: 'NC', sun: 4.5 },
  { value: 'NJ', sun: 4.0 }, { value: 'NV', sun: 6.5 }, { value: 'NY', sun: 3.5 },
  { value: 'OH', sun: 3.5 }, { value: 'OR', sun: 3.5 }, { value: 'PA', sun: 3.5 },
  { value: 'SC', sun: 4.5 }, { value: 'TX', sun: 5.5 }, { value: 'UT', sun: 5.5 },
  { value: 'VA', sun: 4.0 }, { value: 'WA', sun: 3.0 }, { value: 'WI', sun: 4.0 },
]

const ROOF_DIRS: Record<string, number> = {
  'S': 1.0, 'SW': 0.95, 'SE': 0.95, 'W': 0.85, 'E': 0.85, 'Flat': 0.90
}

export default function SolarSavingsCalc() {
  const [bill, setBill] = useState('')
  const [roofDir, setRoofDir] = useState('')
  const [state, setState] = useState('')
  const [sqft, setSqft] = useState('')
  const [showResult, setShowResult] = useState(false)

  const monthlyBill = parseFloat(bill) || 0
  const sunHours = STATES.find(s => s.value === state)?.sun || 4.5
  const dirFactor = ROOF_DIRS[roofDir] || 0.9
  const annualBill = monthlyBill * 12
  const costPerWatt = 3.50
  const systemKW = Math.round((annualBill / (sunHours * 365 * dirFactor * 0.15)) * 10) / 10
  const systemSizeW = systemKW * 1000
  const realisticSavings = Math.round(annualBill * 0.7 * dirFactor)
  const systemCost = Math.round(systemSizeW * costPerWatt)
  const paybackYears = systemCost > 0 ? Math.round((systemCost / realisticSavings) * 10) / 10 : 0
  const savings25 = realisticSavings * 25

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
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

      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-full">Free Tool</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Solar Savings<br />Calculator
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            See how much you could save with solar. Plug in your numbers and get an instant estimate.
          </p>
        </div>

        {!showResult ? (
          <form onSubmit={handleCalc} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly electric bill ($)</label>
              <input type="number" required min="1" placeholder="e.g. 200"
                value={bill} onChange={e => setBill(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Roof direction</label>
              <select required value={roofDir} onChange={e => setRoofDir(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                <option value="">Select direction</option>
                <option value="S">South (best)</option>
                <option value="SW">Southwest</option>
                <option value="SE">Southeast</option>
                <option value="W">West</option>
                <option value="E">East</option>
                <option value="Flat">Flat roof</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your state</label>
              <select required value={state} onChange={e => setState(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Home square footage</label>
              <input type="number" required min="500" placeholder="e.g. 2000"
                value={sqft} onChange={e => setSqft(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"/>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
              Show Me My Savings
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-sm font-medium text-green-700 mb-1">Estimated annual savings</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-green-600">
                ${realisticSavings.toLocaleString()}
              </p>
              <p className="text-sm text-green-500 mt-1">${savings25.toLocaleString()} over 25 years</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">System size</p>
                <p className="text-2xl font-bold text-gray-600">{systemKW} kW</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Estimated cost</p>
                <p className="text-2xl font-bold text-gray-600">${systemCost.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Payback period</p>
                <p className="text-2xl font-bold text-gray-600">{paybackYears} yrs</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Monthly savings</p>
                <p className="text-2xl font-bold text-green-600">${Math.round(realisticSavings / 12)}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-700">This is a rough estimate based on national averages. Actual savings depend on your roof angle, shading, local rates, and incentives.</p>
            </div>

            <div className="bg-navy-50 border border-navy-500/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-navy-900 mb-1">MindVault Pro</p>
              <p className="text-xs text-navy-700/70">Pro members get detailed proposals with satellite roof analysis, incentive lookup by zip code, and side-by-side installer comparison.</p>
            </div>

            <div className="text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Get a Custom Solar Analysis
              </a>
              <button onClick={() => setShowResult(false)}
                className="text-sm text-gray-400 hover:text-navy-900 transition-colors underline">
                Recalculate with different numbers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
