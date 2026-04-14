import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ROICalc from './tools/ROICalc'
import FollowUpGen from './tools/FollowUpGen'
import SolarSavingsCalc from './tools/SolarSavingsCalc'
import OnboardingChecklist from './tools/OnboardingChecklist'
import GrowthScorecard from './tools/GrowthScorecard'
import EstimateTracker from './tools/EstimateTracker'
import ReviewRequestGen from './tools/ReviewRequestGen'

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/roi-calculator" element={<ROICalc />} />
        <Route path="/follow-up-generator" element={<FollowUpGen />} />
        <Route path="/solar-savings-calculator" element={<SolarSavingsCalc />} />
        <Route path="/onboarding-checklist" element={<OnboardingChecklist />} />
        <Route path="/growth-scorecard" element={<GrowthScorecard />} />
        <Route path="/estimate-tracker" element={<EstimateTracker />} />
        <Route path="/review-request-generator" element={<ReviewRequestGen />} />
      </Routes>
    </HashRouter>
  )
}
