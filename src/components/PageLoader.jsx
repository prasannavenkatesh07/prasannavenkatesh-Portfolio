import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

/*
  ═══════════════════════════════════════════════════════════
  CINEMATIC PAGE LOADER
  ═══════════════════════════════════════════════════════════

  Full sequence timeline (total ≈ 3.8s):

  0.00s  — Loader mounts, screen is pure midnight slate
  0.20s  — "P" fades + scales in from centre
  0.80s  — "P" is fully visible, pause for breath
  1.10s  — "P" morphs/expands rightward → "Prasanna"
             each extra letter cascades in left-to-right
  1.85s  — "Prasanna" is complete, shimmer pulse washes over it
  2.00s  — "V" appears below with same treatment
  2.30s  — "V" expands → "Venkatesh"
  3.00s  — Both names fully visible
  3.10s  — Full-name shimmer sweep (left→right glare)
  3.30s  — Scale down + fade-out of text
  3.45s  — Iris-wipe curtain splits: top half slides UP,
             bottom half slides DOWN, revealing hero beneath
  3.80s  — Loader unmounts from DOM entirely

  Z-index: 99990 — above aurora orbs, below custom cursor
  ═══════════════════════════════════════════════════════════
*/

/* ── Timing constants (seconds) ── */
const T = {
  P_IN:        0.20,
  P_EXPAND:    1.05,
  P_DONE:      1.85,
  V_IN:        1.95,
  V_EXPAND:    2.25,
  NAMES_DONE:  3.05,
  SHIMMER:     3.15,
  TEXT_OUT:    3.30,
  CURTAIN:     3.40,
  UNMOUNT:     3.90,
}

/* ── Shared font style ── */
const DISPLAY_FONT = {
  fontFamily:    'var(--font-display)',
  fontWeight:    800,
  letterSpacing: '-0.045em',
  lineHeight:    0.9,
}

/* ── The gradient that makes characters glow ── */
const SHIMMER_GRADIENT = `linear-gradient(
  135deg,
  #FFFFFF       0%,
  #E2EEFF      18%,
  var(--accent-blue)   36%,
  #FFFFFF      50%,
  var(--accent-teal)   62%,
  #D0E5FF      80%,
  #FFFFFF      100%
)`

/*
  LetterExpand
  ─────────────
  Renders a single initial letter that morphs into a full word.

  How the morph works:
  1. The initial letter "P" is always rendered as the first char.
  2. The remaining chars "rasanna" start at scaleX(0), width=0,
     opacity=0 and are clipped by overflow:hidden on their wrapper.
  3. On `expand`, each extra char animates to its natural width
     with a staggered delay — giving the appearance of the
     letter physically growing into the full word.
*/
function LetterExpand({ initial, rest, expanded, delay = 0, fontSize }) {
  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'baseline',
        overflow:   'visible',
      }}
    >
      {/* The initial letter — always visible, scales slightly on expand */}
      <motion.span
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: expanded ? 1.0 : 1.08, y: 0 }}
        transition={
          expanded
            ? { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }
            : { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }
        }
        style={{
          ...DISPLAY_FONT,
          fontSize,
          display:             'inline-block',
          background:          SHIMMER_GRADIENT,
          backgroundSize:      '300% 300%',
          WebkitBackgroundClip:'text',
          backgroundClip:      'text',
          WebkitTextFillColor: 'transparent',
          color:               'transparent',
          animation:           'loaderShimmer 3s ease-in-out infinite',
        }}
      >
        {initial}
      </motion.span>

      {/* The expanding rest of the word */}
      <div
        style={{
          display:  'flex',
          overflow: 'hidden',
          /* FIX: Safety padding so sweeping tails (like 'h' or 'a') are not clipped */
          paddingRight: '0.2em',
        }}
      >
        {rest.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: -14, scaleX: 0.3 }}
            animate={
              expanded
                ? { opacity: 1, x: 0, scaleX: 1 }
                : { opacity: 0, x: -14, scaleX: 0.3 }
            }
            transition={{
              duration: 0.42,
              ease:     [0.16, 1, 0.3, 1],
              delay:    delay + 0.04 + i * 0.038,
            }}
            style={{
              ...DISPLAY_FONT,
              fontSize,
              display:              'inline-block',
              transformOrigin:      'left center',
              background:           SHIMMER_GRADIENT,
              backgroundSize:       '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip:       'text',
              WebkitTextFillColor:  'transparent',
              color:                'transparent',
              animation:            `loaderShimmer 3s ease-in-out infinite`,
              animationDelay:       `${i * -0.11}s`,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/*
  IrisCurtain
  ────────────
  Two panels — top and bottom — that split apart to reveal
  the site underneath. Each panel slides off-screen in its
  direction.
*/
function IrisCurtain({ reveal }) {
  return (
    <>
      {/* Top panel slides up */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: reveal ? '-100%' : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          right:      0,
          height:     '50vh',
          background: 'var(--bg-base)',
          zIndex:     99989,
          transformOrigin: 'top',
        }}
      />
      {/* Bottom panel slides down */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: reveal ? '100%' : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position:   'fixed',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '50.5vh', /* tiny overlap to kill 1px seam */
          background: 'var(--bg-base)',
          zIndex:     99989,
          transformOrigin: 'bottom',
        }}
      />
    </>
  )
}

/*
  ProgressBar
  ────────────
  Thin 2px line at the bottom of the loader that fills
  left-to-right in sync with the animation timeline.
  Gives a sense of "loading" without being literal.
*/
function ProgressBar({ duration }) {
  return (
    <div
      style={{
        position:   'absolute',
        bottom:     32,
        left:       '50%',
        transform:  'translateX(-50%)',
        width:      120,
        height:     2,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.08)',
        overflow:   'hidden',
      }}
    >
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration, ease: 'linear' }}
        style={{
          height:       '100%',
          borderRadius: 2,
          background:   'linear-gradient(to right, var(--accent-blue), var(--accent-teal))',
          boxShadow:    '0 0 8px rgba(56,189,248,0.6)',
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN LOADER COMPONENT
═══════════════════════════════════════════════════════ */
export default function PageLoader({ onComplete }) {
  /* Phase state machine */
  const [pVisible,   setPVisible]   = useState(false)
  const [pExpanded,  setPExpanded]  = useState(false)
  const [vVisible,   setVVisible]   = useState(false)
  const [vExpanded,  setVExpanded]  = useState(false)
  const [shimmer,    setShimmer]    = useState(false)
  const [textOut,    setTextOut]    = useState(false)
  const [curtain,    setCurtain]    = useState(false)
  const [unmounted,  setUnmounted]  = useState(false)

  /* Freeze body scroll during loader */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Master timeline — setTimeout chain */
  useEffect(() => {
    const timers = []
    const at = (sec, fn) => timers.push(setTimeout(fn, sec * 1000))

    at(T.P_IN,       () => setPVisible(true))
    at(T.P_EXPAND,   () => setPExpanded(true))
    at(T.V_IN,       () => setVVisible(true))
    at(T.V_EXPAND,   () => setVExpanded(true))
    at(T.SHIMMER,    () => setShimmer(true))
    at(T.TEXT_OUT,   () => setTextOut(true))
    at(T.CURTAIN,    () => setCurtain(true))
    at(T.UNMOUNT,    () => {
      setUnmounted(true)
      onComplete?.()
    })

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  if (unmounted) return null

  /*
    FIX: Dialed down from 13.5vw so 9-letter "Venkatesh"
    fits easily within the 320px viewport width without overflowing.
  */
  const fontSize = 'clamp(1.8rem, 9.5vw, 8.5rem)'

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes loaderShimmer {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes loaderShineSweep {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>

      {/* ── Main loader backdrop ── */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: textOut ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         99990,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'var(--bg-base)',
          pointerEvents:  textOut ? 'none' : 'all',
        }}
      >
        {/* Subtle radial bloom behind the names */}
        <div
          aria-hidden
          style={{
            position:     'absolute',
            width:        600,
            height:       400,
            borderRadius: '50%',
            background:   'radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)',
            filter:       'blur(60px)',
            pointerEvents:'none',
            transition:   'opacity 0.5s ease',
            opacity:      pExpanded ? 1 : 0,
          }}
        />

        {/* ── Name stack ── */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'flex-start',
            gap:            'clamp(4px, 1vw, 12px)',
            position:       'relative',
            maxWidth:       '92vw',
            padding:        '0 4vw',
            boxSizing:      'border-box',
          }}
        >
          {/* ── Prasanna ── */}
          <AnimatePresence>
            {pVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <LetterExpand
                  initial="P"
                  rest="rasanna"
                  expanded={pExpanded}
                  delay={0}
                  fontSize={fontSize}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Venkatesh ── */}
          <AnimatePresence>
            {vVisible && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <LetterExpand
                  initial="V"
                  rest="enkatesh"
                  expanded={vExpanded}
                  delay={0}
                  fontSize={fontSize}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Full-name shimmer sweep glare ── */}
          {shimmer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              aria-hidden
              style={{
                position:   'absolute',
                inset:      '-8px -24px',
                borderRadius: 8,
                background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.14) 50%, transparent 80%)',
                backgroundSize: '300% 100%',
                animation:  'loaderShineSweep 0.55s ease forwards',
                pointerEvents: 'none',
                zIndex:     2,
              }}
            />
          )}

          {/* ── Tagline ── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: vExpanded ? 1 : 0, y: vExpanded ? 0 : 8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            style={{
              fontFamily:    'var(--font-body)',
              fontWeight:    300,
              fontSize:      'clamp(0.7rem, 1.4vw, 1.05rem)',
              color:         'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop:     'clamp(8px, 2vw, 18px)',
              whiteSpace:    'normal',
              maxWidth:      '100%',
            }}
          >
            Frontend Developer · VIT Vellore
          </motion.p>
        </div>

        {/* ── Progress bar ── */}
        <ProgressBar duration={T.TEXT_OUT - 0.1} />
      </motion.div>

      {/* ── Iris curtain ── always mounted, slides away on reveal ── */}
      <IrisCurtain reveal={curtain} />
    </>
  )
}