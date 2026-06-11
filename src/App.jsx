import { useState } from 'react'
import Navbar          from './components/Navbar'
import Hero            from './components/Hero'
import ProjectShowcase from './components/ProjectShowcase'
import About           from './components/About'
import Contact         from './components/Contact'
import Footer          from './components/Footer'
import CustomCursor    from './components/CustomCursor'
import PageLoader      from './components/PageLoader'

/*
  z-index layering (lowest → highest):
    0      → aurora orbs          (fixed, behind everything)
    10     → page content
    50     → navbar
    9998   → grain overlay        (body::after in index.css)
    99989  → iris curtain panels  (PageLoader)
    99990  → loader backdrop      (PageLoader)
    99998  → custom cursor ring
    99999  → custom cursor dot
*/

function AuroraBackground() {
  return (
    <div className="aurora-container" aria-hidden="true">
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
    </div>
  )
}

export default function App() {
  /*
    loaderDone gates whether the Hero entrance animations are
    allowed to run. We pass `key={loaderDone ? 'ready' : 'wait'}`
    to Hero so its Framer Motion variants re-fire from the start
    only after the loader has fully exited — prevents the name
    shimmer and line-reveal from playing while the screen is
    still covered by the iris curtain.
  */
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <>
      {/* Custom cursor — above everything except itself */}
      <CustomCursor />

      {/*
        PageLoader is mounted immediately.
        onComplete fires at T.UNMOUNT (≈3.9s) — sets loaderDone,
        which triggers Hero to mount and animate in.
      */}
      <PageLoader onComplete={() => setLoaderDone(true)} />

      {/* ── Site shell ── */}
      <div
        className="relative min-h-screen"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <AuroraBackground />
        <Navbar />

        <main className="relative z-10">
          {/*
            Hero is always in the DOM so Lenis and IntersectionObservers
            initialise correctly; its internal animations are keyed on
            loaderDone so they fire at the right moment.
          */}
          <Hero key={loaderDone ? 'ready' : 'wait'} loaderDone={loaderDone} />

          <div className="section-divider" />
          <ProjectShowcase />

          <div className="section-divider" />
          <About />

          <div className="section-divider" />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  )
}