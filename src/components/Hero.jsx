import { useRef, useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react'

const EASE_EXPO = [0.16, 1, 0.3, 1]

/* ═══════════════════════════════════════════════════════
   PARTICLE CANVAS
   Fix: canvas is isolated in its own component with
   pointer-events handled via ref, NOT through React
   state — zero re-renders from mouse movement.
═══════════════════════════════════════════════════════ */
const ParticleCanvas = memo(function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const NODE_COUNT   = 80
    const EDGE_DIST    = 128
    const MOUSE_RADIUS = 155
    const MOUSE_PULL   = 0.052
    const BASE_SPEED   = 0.26
    const NODE_COLOR   = '56,189,248'

    const mouse = { x: -999, y: -999 }
    let   nodes = []
    let   raf   = null

    const initNodes = () => {
      const W = canvas.width  = canvas.offsetWidth
      const H = canvas.height = canvas.offsetHeight
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * BASE_SPEED * 2,
        vy: (Math.random() - 0.5) * BASE_SPEED * 2,
        r:  1.6 + Math.random() * 0.9,
      }))
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      for (const n of nodes) {
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const d  = Math.hypot(dx, dy)
        if (d < MOUSE_RADIUS && d > 0) {
          const f = (1 - d / MOUSE_RADIUS) * MOUSE_PULL
          n.vx += (dx / d) * f
          n.vy += (dy / d) * f
        }
        const spd = Math.hypot(n.vx, n.vy)
        const max = BASE_SPEED * 3.2
        if (spd > max) { n.vx = (n.vx / spd) * max; n.vy = (n.vy / spd) * max }
        n.vx *= 0.996; n.vy *= 0.996
        n.x += n.vx;   n.y += n.vy
        if (n.x < -20)    n.x = W + 20
        if (n.x > W + 20) n.x = -20
        if (n.y < -20)    n.y = H + 20
        if (n.y > H + 20) n.y = -20
      }

      /* Edges */
      ctx.lineWidth = 0.7
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dd = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (dd < EDGE_DIST) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${NODE_COLOR},${(1 - dd / EDGE_DIST) * 0.16})`
            ctx.stroke()
          }
        }
      }

      /* Nodes */
      for (const n of nodes) {
        const dm = Math.hypot(mouse.x - n.x, mouse.y - n.y)
        const prox = dm < MOUSE_RADIUS ? (1 - dm / MOUSE_RADIUS) : 0
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${NODE_COLOR},${0.32 + prox * 0.58})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    initNodes()
    raf = requestAnimationFrame(draw)

    /* Mouse — raw event listener on the section, not React */
    const section = canvas.parentElement
    const onMove  = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = -999; mouse.y = -999 }
    const onResize = () => initNodes()

    section?.addEventListener('mousemove',  onMove,   { passive: true })
    section?.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize',       onResize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      section?.removeEventListener('mousemove',  onMove)
      section?.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize',       onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none', /* handled by section listener above */
        opacity:       0.6,
        display:       'block',
        /* promote to its own GPU layer — no flicker with page repaints */
        willChange:    'contents',
        transform:     'translateZ(0)',
      }}
    />
  )
})

/* ═══════════════════════════════════════════════════════
   TYPEWRITER
   Fix: remove AnimatePresence — was causing a full
   React subtree remount on every character.
   Plain string state + CSS blink. Zero re-render cost
   beyond the single <span> text node update.
═══════════════════════════════════════════════════════ */
const ROLES = [
  'Frontend Developer',
  'Full Stack Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Open to Opportunities',
]

const Typewriter = memo(function Typewriter() {
  const [displayed, setDisplayed] = useState('')
  const state = useRef({ roleIdx: 0, charIdx: 0, phase: 'typing' })

  useEffect(() => {
    const TYPE_SPEED    = 58
    const DELETE_SPEED  = 30
    const HOLD_DURATION = 2400
    const PAUSE_BETWEEN = 320
    let timer

    const tick = () => {
      const { roleIdx, charIdx, phase } = state.current
      const word = ROLES[roleIdx]

      if (phase === 'typing') {
        if (charIdx < word.length) {
          state.current.charIdx++
          setDisplayed(word.slice(0, state.current.charIdx))
          timer = setTimeout(tick, TYPE_SPEED)
        } else {
          state.current.phase = 'deleting'
          timer = setTimeout(tick, HOLD_DURATION)
        }
      } else {
        if (charIdx > 0) {
          state.current.charIdx--
          setDisplayed(word.slice(0, state.current.charIdx))
          timer = setTimeout(tick, DELETE_SPEED)
        } else {
          state.current.roleIdx = (roleIdx + 1) % ROLES.length
          state.current.phase   = 'typing'
          timer = setTimeout(tick, PAUSE_BETWEEN)
        }
      }
    }

    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <span
      style={{
        fontFamily:    'var(--font-display)',
        fontWeight:    600,
        fontSize:      'clamp(1.15rem, 3.5vw, 3rem)', /* MOBILE FIX: lowered min from 1.4rem so longest role string ("Open to Opportunities") never wraps on 320px screens */
        lineHeight:    1.2,
        letterSpacing: '-0.03em',
        color:         'rgba(200,214,240,0.55)',
        display:       'inline-flex',
        alignItems:    'center',
        /* FLICKER FIX:
           minHeight reserves exactly one line regardless of text content.
           The invisible \u200B zero-width space ensures the span is never
           truly empty so line-box height never collapses to 0.           */
        minHeight:     '1.2em',
        isolation:     'isolate',
      }}
    >
      {/* Zero-width space — keeps the line box alive when displayed === '' */}
      <span aria-hidden style={{ userSelect: 'none' }}>{displayed || '\u200B'}</span>
      {/* Blinking cursor bar */}
      <span
        aria-hidden
        style={{
          display:       'inline-block',
          width:         3,
          height:        '0.82em',
          background:    'var(--accent-blue)',
          marginLeft:    5,
          verticalAlign: 'middle',
          borderRadius:  2,
          flexShrink:    0,
          animation:     'cursorBlink 1s step-end infinite',
          boxShadow:     '0 0 10px rgba(56,189,248,0.85), 0 0 22px rgba(56,189,248,0.3)',
          willChange:    'opacity',
          transform:     'translateZ(0)',
        }}
      />
    </span>
  )
})

/* ═══════════════════════════════════════════════════════
   INTERACTIVE NAME — per-letter spring wave
   Fix: filter:drop-shadow swapped for
   text-shadow on a wrapper, avoiding compositing
   layer thrashing. Offsets stored in a ref, applied
   via direct DOM style writes inside rAF — zero React
   re-renders during the ripple animation.
═══════════════════════════════════════════════════════ */
/*
  Spring feel guide:
  stiffness LOW  = lazy float    HIGH = rigid/snappy
  damping   LOW  = lots of wobble  HIGH = overdamped, no bounce
  mass      LOW  = weightless    HIGH = heavy, slow to settle
  Target feel: water-drop — drifts up, settles with 1-2 soft wobbles
*/
const LETTER_SPRING_STIFFNESS = 180
const LETTER_SPRING_DAMPING   = 12
const LETTER_SPRING_MASS      = 1.4

function InteractiveName({ text, delay = 0, style = {} }) {
  const letters   = text.split('')
  const spanRefs  = useRef([])
  const timers    = useRef({})
  /* track current animated value per letter for spring sim */
  const springs   = useRef(letters.map(() => ({ y: 0, vy: 0, target: 0 })))
  const rafId     = useRef(null)
  const animating = useRef(false)

  /* Spring physics loop — runs only while a ripple is active */
  const runSpring = useCallback(() => {
    let anyActive = false
    springs.current.forEach((s, i) => {
      /*
        Settle threshold: 0.18px position + 0.18px velocity.
        Looser than before (was 0.05) so the spring wobble
        completes naturally instead of being cut short early.
      */
      if (Math.abs(s.y - s.target) < 0.18 && Math.abs(s.vy) < 0.18) {
        s.y  = s.target
        s.vy = 0
      } else {
        anyActive = true
        const force = (s.target - s.y) * (LETTER_SPRING_STIFFNESS / 1000)
        const damp  = s.vy * (LETTER_SPRING_DAMPING  / 100)
        s.vy += (force - damp) / LETTER_SPRING_MASS
        s.y  += s.vy
      }
      if (spanRefs.current[i]) {
        spanRefs.current[i].style.transform = `translateY(${s.y}px)`
      }
    })
    if (anyActive) {
      rafId.current = requestAnimationFrame(runSpring)
    } else {
      animating.current = false
    }
  }, [])

  const triggerRipple = useCallback((idx) => {
    /*
      Wave shape: the hovered letter gets the biggest lift.
      Each neighbour gets progressively less, with a time lag
      so the wave travels outward like a ripple in water.
      hold: how long the letter stays at peak before returning.
            Longer hold (600ms) lets the fluid physics play out fully.
      lag:  ms delay per step from centre — 70ms feels like water.
    */
    const WAVE = [
      { delta: 0,  y: -28 },
      { delta: 1,  y: -18 }, { delta: -1, y: -18 },
      { delta: 2,  y: -10 }, { delta: -2, y: -10 },
      { delta: 3,  y: -5  }, { delta: -3, y: -5  },
    ]
    const HOLD = 600   // ms at peak before springing back
    const LAG  = 70    // ms per neighbour step

    WAVE.forEach(({ delta, y }) => {
      const t = idx + delta
      if (t < 0 || t >= letters.length) return
      const lag = Math.abs(delta) * LAG

      clearTimeout(timers.current[`s-${t}`])
      clearTimeout(timers.current[`r-${t}`])

      timers.current[`s-${t}`] = setTimeout(() => {
        springs.current[t].target = y
        if (!animating.current) {
          animating.current = true
          rafId.current = requestAnimationFrame(runSpring)
        }
        timers.current[`r-${t}`] = setTimeout(() => {
          springs.current[t].target = 0
        }, HOLD)
      }, lag)
    })
  }, [letters.length, runSpring])

  useEffect(() => {
    const t = timers.current
    return () => {
      Object.values(t).forEach(clearTimeout)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div className="line-mask" style={{ display: 'block' }}>
      <motion.div
        initial={{ y: '115%', opacity: 0, rotateX: 8 }}
        animate={{ y: '0%',   opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.88, ease: EASE_EXPO, delay }}
        style={{
          display:    'flex',
          flexWrap:   'nowrap',
          lineHeight: 0.88,
          perspective: '800px',
          /* FIX: Added safety padding so the trailing edge of wide fonts ('h') isn't clipped by line-mask */
          paddingRight: '0.2em',
          ...style,
        }}
        aria-label={text}
      >
        {letters.map((char, i) => (
          <span
            key={i}
            ref={el => spanRefs.current[i] = el}
            onMouseEnter={() => triggerRipple(i)}
            style={{
              display:      'inline-block',
              /* FIX: Adjusted vw and max-rem so "Venkatesh" scales cleanly within mobile and desktop bounds */
              fontSize:     'clamp(1.8rem, 9vw, 7.5rem)',
              fontFamily:   'var(--font-display)',
              fontWeight:   800,
              letterSpacing: '-0.04em',
              /* Shimmer gradient — each letter offset in the cycle */
              background:   `linear-gradient(
                135deg,
                #FFFFFF 0%, #E2EEFF 18%,
                var(--accent-blue) 36%,
                #FFFFFF 50%,
                var(--accent-teal) 62%,
                #D0E5FF 80%,
                #FFFFFF 100%
              )`,
              backgroundSize:       '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip:       'text',
              WebkitTextFillColor:  'transparent',
              color:                'transparent',
              animation:            `name-shimmer-flow 6s ease-in-out infinite`,
              animationDelay:       `${i * -0.14}s`,
              whiteSpace:           char === ' ' ? 'pre' : 'normal',
              userSelect:           'none',
              /* Each letter on its own GPU layer — critical for flicker fix */
              willChange:           'transform',
              transform:            'translateZ(0)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   TEXT SCRAMBLE HOOK :
   Pass a ref to a DOM element; when it enters the
   viewport the text scrambles from random chars into
   the real string over ~700ms.
───────────────────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

export function useScramble(ref, originalText, options = {}) {
  const {
    duration    = 700,
    delay       = 0,
    onceOnly    = true,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let observer
    let hasRun = false

    const scramble = () => {
      if (onceOnly && hasRun) return
      hasRun = true

      const frames     = Math.round(duration / 16)
      const revealPer  = originalText.length / frames
      let   revealedTo = 0
      let   frame      = 0
      let   raf

      const tick = () => {
        frame++
        revealedTo = Math.min(originalText.length, frame * revealPer)

        const revealed  = originalText.slice(0, Math.floor(revealedTo))
        const scrambled = Array.from(
          { length: originalText.length - revealed.length },
          () => CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')

        el.textContent = revealed + scrambled

        if (revealedTo < originalText.length) {
          raf = requestAnimationFrame(tick)
        } else {
          el.textContent = originalText
        }
      }

      setTimeout(() => { raf = requestAnimationFrame(tick) }, delay)

      return () => cancelAnimationFrame(raf)
    }

    observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) scramble() },
      { threshold: 0.3 }
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [ref, originalText, duration, delay, onceOnly])
}

/* ─────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────── */
function MagneticBtn({ href, children, variant = 'primary', className = '', ...props }) {
  const btnRef                  = useRef(null)
  const [offset,   setOffset]   = useState({ x: 0, y: 0 })
  const [shinePos, setShinePos] = useState({ x: '50%', y: '50%' })
  const STRENGTH = 0.34

  const handleMouseMove = useCallback((e) => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    setOffset({
      x: (e.clientX - r.left - r.width  / 2) * STRENGTH,
      y: (e.clientY - r.top  - r.height / 2) * STRENGTH,
    })
    setShinePos({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` })
  }, [])

  const handleMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), [])

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`btn-magnetic btn-magnetic-${variant} group ${className}`}
      style={{
        transform:  `translate(${offset.x}px, ${offset.y}px)`,
        willChange: 'transform',
      }}
      {...props}
    >
      <span className="btn-shine" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(65px circle at ${shinePos.x} ${shinePos.y}, rgba(255,255,255,0.18), transparent 70%)`,
        }}
      />
      {children}
    </a>
  )
}

/* ─────────────────────────────────────────────────────────
   SOCIAL LINK
───────────────────────────────────────────────────────── */
function SocialLink({ href, icon: Icon, label }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          36,
        height:         36,
        borderRadius:   10,
        color:          hov ? 'var(--accent-blue)' : 'var(--text-muted)',
        border:         `1px solid ${hov ? 'rgba(56,189,248,0.38)' : 'var(--border-subtle)'}`,
        background:     hov ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.03)',
        boxShadow:      hov ? '0 0 14px rgba(56,189,248,0.18)' : 'none',
        transform:      hov ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'all 0.2s ease',
        textDecoration: 'none',
        willChange:     'transform',
      }}
    >
      <Icon size={16} strokeWidth={1.7} />
    </a>
  )
}

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO, delay } },
})

/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */
export default function Hero({ loaderDone = true }) {
  /*
    `animate` is "visible" only after the loader has fully
    exited. This prevents entrance animations running while
    the iris curtain is still covering the screen.
    Default true so it works standalone without App.jsx.
  */
  const readyAnimate = loaderDone ? 'visible' : 'hidden'

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center min-h-screen px-4 sm:px-6 overflow-hidden"
    >
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      {/* Particle canvas — memo'd, never re-renders */}
      <ParticleCanvas />

      {/* Radial vignette — keeps canvas from competing with text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 82% 72% at 48% 52%,
            transparent 28%,
            rgba(11,15,25,0.5) 65%,
            rgba(11,15,25,0.88) 100%
          )`,
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full pt-32 pb-24">

        {/* Availability badge */}
        <motion.div variants={fadeUp(0.05)} initial="hidden" animate={readyAnimate} className="mb-10">
          <div className="availability-badge">
            <span className="ping-dot" />
            Available for new projects
          </div>
        </motion.div>

        {/* Hi I'm */}
        <div className="line-mask mb-1">
          <motion.p
            initial={{ y: '115%', opacity: 0 }}
            animate={loaderDone ? { y: '0%', opacity: 1 } : { y: '115%', opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.12 }}
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    500,
              fontSize:      'clamp(0.95rem, 1.8vw, 1.25rem)',
              color:         'var(--text-muted)',
              letterSpacing: '0.04em',
            }}
          >
            Hi, I&apos;m
          </motion.p>
        </div>

        {/* Interactive name — letters bounce on hover */}
        <div style={{ perspective: '1000px' }}>
          <InteractiveName text="Prasanna"   delay={loaderDone ? 0.22 : 99} />
          <InteractiveName text="Venkatesh" delay={loaderDone ? 0.38 : 99} />
        </div>

        {/* Typewriter role — height-locked so empty string never collapses layout */}
        <div className="line-mask mt-5 mb-2">
          <motion.div
            initial={{ y: '115%', opacity: 0 }}
            animate={loaderDone ? { y: '0%', opacity: 1 } : { y: '115%', opacity: 0 }}
            transition={{ duration: 0.88, ease: EASE_EXPO, delay: 0.55 }}
            style={{
              minHeight:  'calc(clamp(1.15rem, 3.5vw, 3rem) * 1.3)', /* MOBILE FIX: matches Typewriter's new min font size */
              display:    'flex',
              alignItems: 'center',
            }}
          >
            {loaderDone && <Typewriter />}
          </motion.div>
        </div>

        {/* Sub copy */}
        <motion.p
          variants={fadeUp(0.82)}
          initial="hidden"
          animate={readyAnimate}
          className="max-w-[460px] mt-5 mb-12 font-light leading-relaxed"
          style={{
            fontSize:   'clamp(0.92rem, 1.2vw, 1.05rem)',
            color:      'var(--text-secondary)',
            lineHeight: 1.82,
          }}
        >
          I craft high-performance web experiences that live at the
          intersection of clean engineering and thoughtful design —
          obsessing over every interaction, from first paint to last pixel.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp(1.0)}
          initial="hidden"
          animate={readyAnimate}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          <MagneticBtn href="#work" variant="primary" className="group">
            View My Work
            <ArrowRight size={15} strokeWidth={2.2}
              className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </MagneticBtn>
          <MagneticBtn href="#contact" variant="ghost">
            Get in touch
          </MagneticBtn>
        </motion.div>

        {/* Socials */}
        <motion.div
          variants={fadeUp(1.15)}
          initial="hidden"
          animate={readyAnimate}
          className="flex items-center gap-3"
        >
          <SocialLink href="https://github.com/prasannavenkatesh07"      icon={Github}   label="GitHub"   />
          <SocialLink href="https://www.linkedin.com/in/prasannavenkatesh-s" icon={Linkedin} label="LinkedIn" />
          <SocialLink href="https://x.com/CodeByPrasanna"     icon={Twitter}  label="Twitter"  />
          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            · Based in India
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaderDone ? 1 : 0 }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="absolute bottom-10 left-6 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <div className="scroll-line" />
          <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Scroll
          </span>
        </motion.div>

      </div>
    </section>
  )
}