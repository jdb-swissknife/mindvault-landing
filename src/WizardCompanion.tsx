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

    function spawnTrail(x: number, y: number, velX: number) {
      const puff = document.createElement('div')
      const size = 8 + Math.random() * 10
      const drift = -velX * 0.15 + (Math.random() - 0.5) * 8
      const driftY = -2 - Math.random() * 4
      puff.style.cssText = `
        position:fixed; pointer-events:none; z-index:9998;
        width:${size}px; height:${size}px; border-radius:50%;
        background: radial-gradient(circle, rgba(194,112,62,0.9), rgba(180,100,50,0.5), transparent);
        left:${x + 20 - size/2}px; top:${y + 28 - size/2}px;
        animation: wizSmoke 0.9s ease-out forwards;
        --drift:${drift}px; --driftY:${driftY}px;
      `
      document.body.appendChild(puff)
      setTimeout(() => puff.remove(), 950)
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
      if (speed > 3 && now - s.lastTrail > 60) {
        spawnTrail(s.wizX, s.wizY, s.velX)
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
        @keyframes wizSmoke {
          0% { opacity: 0.9; transform: translate(0, 0) scale(0.5); }
          30% { opacity: 0.7; transform: translate(var(--drift, 0px), var(--driftY, -3px)) scale(1.2); }
          100% { opacity: 0; transform: translate(var(--drift, 0px), calc(var(--driftY, -3px) - 12px)) scale(2); }
        }
        .wizard-companion {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          width: 48px;
          height: 56px;
          display: none;
          will-change: left, top, transform;
          filter: drop-shadow(0 0 10px rgba(194,112,62,0.3)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        .wizard-companion.flipped img {
          transform: scaleX(-1);
        }
        .wizard-companion img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        @media (max-width: 768px) {
          .wizard-companion { width: 44px; height: 44px; }
        }
      `}</style>

      <div ref={wizardRef} className="wizard-companion" aria-hidden="true">
        <img src="/mascot.png" alt="" draggable="false" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </>
  )
}
