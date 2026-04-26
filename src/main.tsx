import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router'

const rootEl = document.getElementById('root')!
rootEl.innerHTML = '' // Clear prerendered content to avoid hydration mismatch
createRoot(rootEl).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
