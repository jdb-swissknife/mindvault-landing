import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ROICalc from './tools/ROICalc'
import FollowUpGen from './tools/FollowUpGen'

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/roi-calculator" element={<ROICalc />} />
        <Route path="/follow-up-generator" element={<FollowUpGen />} />
      </Routes>
    </HashRouter>
  )
}
