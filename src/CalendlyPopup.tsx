interface CalendlyPopupProps {
  children: React.ReactNode
}

export default function CalendlyPopup({ children }: CalendlyPopupProps) {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/john-bird-mindvaultstudio/30min',
      })
    }
  }

  return (
    <span onClick={openCalendly} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  )
}

// Extend the Window interface to include Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}
