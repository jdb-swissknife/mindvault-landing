import { useEffect, useRef } from 'react'

// ── Automation Wizard Mouse Companion ──────────────────
// A little wizard that follows the cursor with spring physics,
// spawns sparkle trails, and bobs in the top-right when idle.

export default function WizardCompanion() {
  const wizardRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    mouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    mouseY: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    wizX: typeof window !== 'undefined' ? window.innerWidth + 80 : 580,
    wizY: 120,
    velX: 0,
    velY: 0,
    scrollVel: 0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    bobPhase: 0,
    isIdle: true,
    idleTimer: 0,
    lastTrail: 0,
    animId: 0,
  })

  useEffect(() => {
    const s = stateRef.current

    const onMouseMove = (e: MouseEvent) => {
      s.mouseX = e.clientX
      s.mouseY = e.clientY
      s.idleTimer = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        s.mouseX = e.touches[0].clientX
        s.mouseY = e.touches[0].clientY
        s.idleTimer = 0
      }
    }
    const onScroll = () => {
      s.idleTimer = 0
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    function spawnTrail(x: number, y: number) {
      const dot = document.createElement('div')
      dot.style.cssText = `
        position:fixed; pointer-events:none; z-index:9998;
        width:6px; height:6px; border-radius:50%;
        background: radial-gradient(circle, #c2703e, transparent);
        left:${x + 24}px; top:${y + 24}px;
        animation: wizTrail 0.6s ease-out forwards;
      `
      document.body.appendChild(dot)
      setTimeout(() => dot.remove(), 650)
    }

    function animate() {
      const wiz = wizardRef.current
      if (!wiz) { s.animId = requestAnimationFrame(animate); return }

      s.bobPhase += 0.04
      s.idleTimer++

      s.scrollVel = window.scrollY - s.lastScrollY
      s.lastScrollY = window.scrollY

      let targetX: number, targetY: number

      if (s.idleTimer > 90) {
        // Idle: float to top-right corner and bob gently
        s.isIdle = true
        targetX = window.innerWidth - 90
        targetY = 140 + Math.sin(s.bobPhase * 0.5) * 20
      } else {
        s.isIdle = false
        targetX = s.mouseX + 60
        targetY = s.mouseY - 50 + Math.sin(s.bobPhase) * 8
      }

      const spring = s.isIdle ? 0.035 : 0.04
      const damping = s.isIdle ? 0.86 : 0.88

      s.velX += (targetX - s.wizX) * spring
      s.velY += (targetY - s.wizY) * spring
      s.velY -= s.scrollVel * 0.3
      s.velX *= damping
      s.velY *= damping
      s.wizX += s.velX
      s.wizY += s.velY

      // Clamp to viewport
      s.wizX = Math.max(-20, Math.min(window.innerWidth - 44, s.wizX))
      s.wizY = Math.max(-20, Math.min(window.innerHeight - 44, s.wizY))

      // Flip direction
      if (s.velX < -0.5) wiz.classList.add('flipped')
      else if (s.velX > 0.5) wiz.classList.remove('flipped')

      wiz.style.left = s.wizX + 'px'
      wiz.style.top = s.wizY + 'px'

      // Tilt based on velocity
      const tilt = Math.max(-15, Math.min(15, s.velX * 0.8))
      wiz.style.transform = `rotate(${tilt}deg)`

      // Spawn trail when moving fast
      const speed = Math.sqrt(s.velX * s.velX + s.velY * s.velY)
      const now = Date.now()
      if (speed > 3 && now - s.lastTrail > 80) {
        spawnTrail(s.wizX, s.wizY)
        s.lastTrail = now
      }

      s.animId = requestAnimationFrame(animate)
    }

    // Appear after 1.5s
    const appearTimer = setTimeout(() => {
      if (wizardRef.current) {
        wizardRef.current.style.display = 'block'
        animate()
      }
    }, 1500)

    return () => {
      clearTimeout(appearTimer)
      cancelAnimationFrame(s.animId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {/* Trail animation keyframes */}
      <style>{`
        @keyframes wizTrail {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.2); }
        }
        .wizard-companion {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          width: 56px;
          height: 56px;
          display: none;
          will-change: left, top, transform;
          filter: drop-shadow(0 0 10px rgba(194,112,62,0.3)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        .wizard-companion.flipped svg {
          transform: scaleX(-1);
        }
        .wizard-companion svg {
          width: 100%;
          height: 100%;
        }
        @media (max-width: 768px) {
          .wizard-companion { width: 44px; height: 44px; }
        }
      `}</style>

      <div ref={wizardRef} className="wizard-companion" aria-hidden="true">
        <svg viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* ── Hard Hat ── */}
          {/* Wide flat brim */}
          <path d="M10 28 L54 28 L52 32 L12 32 Z" fill="#c2703e" stroke="#a85a2a" strokeWidth="0.5"/>
          {/* Dome - tall with slight ridge */}
          <path d="M18 28 Q18 10 32 8 Q46 10 46 28 Z" fill="#c2703e"/>
          {/* Ridge line on top */}
          <path d="M24 18 Q32 12 40 18" stroke="#a85a2a" strokeWidth="1" fill="none"/>
          {/* Front highlight */}
          <path d="M22 20 Q28 14 38 18" stroke="#d4894a" strokeWidth="1.5" fill="none" opacity="0.6"/>
          {/* Brim shadow */}
          <rect x="12" y="30" width="40" height="1.5" rx="0.5" fill="#8b4513" opacity="0.6"/>

          {/* ── Face ── */}
          <circle cx="32" cy="40" r="11" fill="#fde8d0"/>
          {/* Ears */}
          <ellipse cx="20" cy="40" rx="2" ry="3" fill="#f0d8b8"/>
          <ellipse cx="44" cy="40" rx="2" ry="3" fill="#f0d8b8"/>
          
          {/* Eyes - friendly and confident */}
          <ellipse cx="28" cy="38" rx="2" ry="2.2" fill="#1a1a2e"/>
          <ellipse cx="36" cy="38" rx="2" ry="2.2" fill="#1a1a2e"/>
          <ellipse cx="28.8" cy="37.2" rx="0.8" ry="0.8" fill="white"/>
          <ellipse cx="36.8" cy="37.2" rx="0.8" ry="0.8" fill="white"/>
          {/* Eyebrows - confident arch */}
          <path d="M25 34 Q28 32.5 31 34" stroke="#6b4c30" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M33 34 Q36 32.5 39 34" stroke="#6b4c30" strokeWidth="1" fill="none" strokeLinecap="round"/>
          
          {/* Smile */}
          <path d="M27 44 Q32 48 37 44" stroke="#8b4513" strokeWidth="1.3" fill="none" strokeLinecap="round"/>

          {/* ── Body / Work Shirt ── */}
          <path d="M21 50 L18 72 L46 72 L43 50" fill="#1a1a2e"/>
          {/* V-neck collar */}
          <path d="M28 49 L32 54 L36 49" fill="#252545" stroke="#1a1a2e" strokeWidth="0.5"/>
          {/* Shirt pocket */}
          <rect x="23" y="52" width="5" height="4" rx="0.5" fill="#252545" stroke="#2a2a4a" strokeWidth="0.3"/>
          {/* Pen in pocket */}
          <line x1="25" y1="51" x2="25" y2="54" stroke="#c2703e" strokeWidth="0.8" strokeLinecap="round"/>
          
          {/* ── Tool Belt ── */}
          <rect x="19" y="58" width="26" height="3.5" rx="1" fill="#6b3410"/>
          {/* Belt buckle */}
          <rect x="30" y="57.5" width="4" height="4.5" rx="0.5" fill="#c2703e" stroke="#a85a2a" strokeWidth="0.5"/>
          {/* Left pouch */}
          <rect x="20" y="58" width="6" height="5" rx="1" fill="#5a2a0e"/>
          {/* Right pouch */}
          <rect x="38" y="58" width="6" height="5" rx="1" fill="#5a2a0e"/>

          {/* ── Wrench ── */}
          <g transform="translate(44, 34) rotate(30)">
            <rect x="-1" y="16" width="3.5" height="18" rx="1.2" fill="#9a9a9a"/>
            <rect x="-1" y="16" width="1" height="18" rx="0.5" fill="#b0b0b0" opacity="0.5"/>
            {/* Open-end head */}
            <path d="M-3 12 L-3 4 Q0 0 3 4 L3 12 L1.5 10 L1.5 5.5 Q0 3 -1.5 5.5 L-1.5 10 Z" fill="#aaa" stroke="#888" strokeWidth="0.4"/>
          </g>
          {/* Arm */}
          <path d="M42 50 Q46 42 45 38" stroke="#fde8d0" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          {/* Sleeve cuff */}
          <path d="M41 48 Q42 47 43 48" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          
          {/* ── AI Glow on hard hat ── */}
          <circle cx="32" cy="16" r="4" fill="#c2703e" opacity="0">
            <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="16" r="2" fill="#ffd700" opacity="0">
            <animate attributeName="opacity" values="0;0.7;0" dur="3s" repeatCount="indefinite" begin="0.2s"/>
          </circle>
        </svg>
      </div>
    </>
  )
}
