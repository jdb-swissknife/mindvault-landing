import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ROICalc() {
  const [avgJobValue, setAvgJobValue] = useState('')
  const [leadsPerMonth, setLeadsPerMonth] = useState('')
  const [responseHours, setResponseHours] = useState('')
  const [showResult, setShowResult] = useState(false)

  // Industry data: conversion drops ~10% per hour of delay after 5 min
  const jobVal = parseFloat(avgJobValue) || 0
  const leads = parseFloat(leadsPerMonth) || 0
  const hours = parseFloat(responseHours) || 0

  // 5 min response = 80% contact rate, drops to ~20% at 24hr+
  const instantRate = 0.80
  const currentRate = Math.max(0.10, instantRate - (hours * 0.03))
  const aiRate = 0.78 // AI responds in <60 seconds

  const currentConversions = Math.round(leads * currentRate)
  const aiConversions = Math.round(leads * aiRate)
  const lostConversions = aiConversions - currentConversions
  const lostRevenue = lostConversions * jobVal
  const annualLost = lostRevenue * 12

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
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

      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-full">Free Tool</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Lead Response<br />ROI Calculator
          </h1>
          <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
            See exactly how much revenue you lose every month to slow lead response. Most businesses are shocked.
          </p>
        </div>

        {!showResult ? (
          <form onSubmit={handleCalc} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Average job value ($)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 5000"
                value={avgJobValue}
                onChange={e => setAvgJobValue(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Leads per month</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 40"
                value={leadsPerMonth}
                onChange={e => setLeadsPerMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">How fast do you respond? (hours)</label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                placeholder="e.g. 4"
                value={responseHours}
                onChange={e => setResponseHours(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
              Show Me What I'm Losing
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* The big number */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-sm font-medium text-red-700 mb-1">You're leaving on the table every month</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-red-600">
                ${lostRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-red-500 mt-1">${annualLost.toLocaleString()} per year</p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Your conversion rate</p>
                <p className="text-2xl font-bold text-gray-600">{(currentRate * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-400">{currentConversions} deals/mo</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">With 60-sec AI response</p>
                <p className="text-2xl font-bold text-green-700">{(aiRate * 100).toFixed(0)}%</p>
                <p className="text-xs text-green-600">{aiConversions} deals/mo</p>
              </div>
            </div>

            <div className="bg-navy-900 rounded-xl p-5 text-center text-white">
              <p className="text-sm text-gray-300 mb-2">{lostConversions} extra deals per month with instant response</p>
              <p className="text-xs text-gray-400">Based on industry data: responding within 5 minutes makes you 21x more likely to qualify the lead.</p>
            </div>

            <div className="text-center space-y-3">
              <a href="https://cal.com/jbird/15min" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg bg-navy-900 text-white font-semibold text-sm hover:bg-navy-950 transition-colors">
                Get AI Lead Response for Your Business
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
