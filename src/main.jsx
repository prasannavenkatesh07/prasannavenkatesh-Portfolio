import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ─────────────────────────────────────────────────────────
   Lenis Smooth Scroll
   Installed via:  npm install lenis
   
   Settings tuned for a premium portfolio:
   • duration 1.35   — silky without feeling slow
   • easing          — exponential deceleration curve
   • wheelMultiplier — slightly reduced so aurora orbs
                       feel like you're drifting past them
   • touchMultiplier — responsive on mobile/trackpad
───────────────────────────────────────────────────────── */
async function initLenis() {
  try {
    const { default: Lenis } = await import('lenis')

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.88,
      touchMultiplier: 1.75,
      infinite: false,
      autoRaf: false,
    })

    /* Manual rAF loop for precision timing */
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    /* Expose globally so components can call lenis.scrollTo() */
    window.__lenis = lenis

    /* Intercept all internal anchor clicks → smooth scroll */
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -80, duration: 1.55 })
    })

  } catch {
    /* Lenis not installed yet — site works fine without it */
    console.info('Lenis not found. Run: npm install lenis')
  }
}

initLenis()

/* ─────────────────────────────────────────────────────────
   React root
───────────────────────────────────────────────────────── */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)