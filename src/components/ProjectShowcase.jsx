import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, ExternalLink,
  ShieldCheck, Mic, BarChart3,
  Chrome, Repeat2, SlidersHorizontal,
  BrainCircuit, Target,
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useScramble } from './useScramble';

/* ─────────────────────────────────────────────────────────
   Constants 
───────────────────────────────────────────────────────── */
const SOURCE_URL = 'https://github.com/prasannavenkatesh07/TrackWise-Expense-Tracker';
const DEMO_URL   = 'https://use-trackwise.vercel.app';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────
   Feature data 
───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    id: 'onboarding',
    index: '01',
    tag: 'Auth & Settings',
    title: 'Seamless Onboarding\n& Security',
    body: 'Built an authentication system with Google OAuth 2.0 and email/password login, using bcrypt for password hashing and JWT for secure stateless sessions. Developed a user settings dashboard for profile management, notifications, and account security.',
    bullets: [
      { icon: Chrome,            text: 'One-tap Google OAuth 2.0 login'       },
      { icon: ShieldCheck,       text: 'Secure session & token management'    },
      { icon: SlidersHorizontal, text: 'Full-featured user settings suite'    },
    ],
    image: '/trackwise-1.png',
    imageAlt: 'Trackwise — Onboarding & Settings',
  },
  {
    id: 'logging',
    index: '02',
    tag: 'Expense Logging',
    title: 'Frictionless\nLogging',
    body: 'Capture expenses the moment they happen. Speak naturally and voice dictation converts it into a structured record instantly. Set recurring transactions once — Trackwise handles the rest automatically.',
    bullets: [
      { icon: Mic,     text: 'Voice dictation for instant expense entry'  },
      { icon: Repeat2, text: 'Recurring transaction automation'           },
      { icon: BarChart3, text: 'Smart category auto-detection'            },
    ],
    image: '/trackwise-2.png',
    imageAlt: 'Trackwise — Expense Logging',
  },
  {
    id: 'intelligence',
    index: '03',
    tag: 'Analytics',
    title: 'Financial\nIntelligence',
    body: 'Trackwise interprets your data, not just stores it. Dynamic analytics charts surface spending patterns at a glance. Per-category budgets keep you on target, while smart insights flag anomalies before they become problems.',
    bullets: [
      { icon: BrainCircuit, text: 'Smart insights & anomaly detection'   },
      { icon: Target,       text: 'Per-category budget tracking'         },
      { icon: BarChart3,    text: 'Dynamic analytics & trend charts'     },
    ],
    image: '/trackwise-3.png',
    imageAlt: 'Trackwise — Financial Analytics',
  },
];

const TECH_STACK = [
  'React', 'Node.js', 'Express', 'MongoDB',
  'Google OAuth 2.0', 'Recharts', 'Tailwind CSS', 'Web Speech API',
];

/* ─────────────────────────────────────────────────────────
   3D Tilt Image Container
───────────────────────────────────────────────────────── */
function TiltImageCard({ src, alt }) {
  const cardRef  = useRef(null);
  const frameRef = useRef(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
  const [hovered, setHovered] = useState(false);

  const MAX_TILT = 10; 

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      setTilt({ x: -dy * MAX_TILT, y: dx * MAX_TILT });
      setGlowPos({
        x: `${((e.clientX - rect.left) / rect.width)  * 100}%`,
        y: `${((e.clientY - rect.top)  / rect.height) * 100}%`,
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none"
      style={{
        aspectRatio: '16 / 9',
        perspective: '1000px',
        cursor: 'default',
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-2xl"
        style={{
          transform: `
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            scale(${hovered ? 1.015 : 1})
          `,
          transition: hovered
            ? 'transform 0.08s linear'
            : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformStyle: 'preserve-3d',
          background: 'rgba(10, 16, 32, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: hovered
            ? '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.1), 0 0 0 1px rgba(56,189,248,0.12) inset'
            : '0 24px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-contain z-10"
          />
        </AnimatePresence>

        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20"
          style={{
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            background: `radial-gradient(220px circle at ${glowPos.x} ${glowPos.y}, rgba(56,189,248,0.08), transparent 65%)`,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)',
          }}
        />
      </div>

      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '75%',
          height: 40,
          background: 'rgba(56,189,248,0.12)',
          filter: 'blur(24px)',
          opacity: hovered ? 0.9 : 0.5,
          transition: 'opacity 0.4s ease',
          borderRadius: '50%',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Feature panel (right-side scroll block)
───────────────────────────────────────────────────────── */
function FeaturePanel({ feature, onVisible }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { margin: '-38% 0px -38% 0px' });
  
  // FIX: Added a ref to track if this specific panel has already scrambled
  const hasScrambled = useRef(false);

  const { ref: titleRef, trigger: scrambleTrigger } = useScramble({
    text:      feature.title.replace('\n', ' '),
    speed:     38,
    scrambleMs:480,
    playOnce:  true, // FIX: Changed to true
    delay:     60,
  });

  useEffect(() => {
    if (inView) {
      onVisible(feature.id);
      
      // FIX: Only trigger the scramble animation if it hasn't fired yet
      if (!hasScrambled.current) {
        scrambleTrigger();
        hasScrambled.current = true;
      }
    }
  }, [inView, feature.id, onVisible, scrambleTrigger]);

  return (
    <div
      ref={ref}
      className="lg:min-h-screen flex items-center py-12 sm:py-16 lg:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-12%' }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="w-full"
      >
        <div className="lg:hidden mb-8">
          <TiltImageCard
            src={feature.image}
            alt={feature.imageAlt}
          />
        </div>

        <div className="flex items-center gap-3 mb-7">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(160,180,218,0.3)' }}
          >
            {feature.index}
          </span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(56,189,248,0.08)',
              color: 'rgba(56,189,248,0.75)',
              border: '1px solid rgba(56,189,248,0.18)',
            }}
          >
            {feature.tag}
          </span>
        </div>

        <h3
          ref={titleRef}
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(1.7rem, 4vw, 3.2rem)', 
            letterSpacing: '-0.04em',
            lineHeight:    0.98,
            color:         'var(--text-primary)',
            display:       'block',
            marginBottom:  20,
          }}
        >
          {feature.title.replace('\n', ' ')}
        </h3>

        <p
          className="mb-8 font-light leading-relaxed max-w-md"
          style={{
            fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.78,
          }}
        >
          {feature.body}
        </p>

        <ul className="flex flex-col gap-3 mb-10">
          {feature.bullets.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-8%' }}
              transition={{ delay: 0.14 + i * 0.09, duration: 0.55, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{
                  background: 'rgba(56,189,248,0.07)',
                  border: '1px solid rgba(56,189,248,0.18)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <b.icon
                  size={14}
                  strokeWidth={1.8}
                  style={{ color: 'var(--accent-blue)' }}
                />
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {b.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Step indicator dots (below sticky image)
───────────────────────────────────────────────────────── */
function StepDots({ features, activeId, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {features.map((f) => {
        const isActive = f.id === activeId;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            aria-label={f.tag}
            style={{
              width:      isActive ? 22 : 7,
              height:     7,
              borderRadius: 4,
              background: isActive
                ? 'var(--accent-blue)'
                : 'rgba(255,255,255,0.14)',
              border:     'none',
              cursor:     'pointer',
              padding:    0,
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA button for header row
───────────────────────────────────────────────────────── */
function HeaderCTA({ href, icon: Icon, label, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl font-semibold transition-all duration-250"
      style={{
        padding: '9px 20px',
        fontSize: 13,
        letterSpacing: '-0.01em',
        background:   primary
          ? (hov ? 'var(--accent-blue)' : 'rgba(56,189,248,0.9)')
          : (hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'),
        color:        primary ? '#040D18' : (hov ? 'var(--text-primary)' : 'var(--text-secondary)'),
        border:       primary ? 'none' : '1px solid var(--border-default)',
        boxShadow:    primary && hov ? '0 0 28px rgba(56,189,248,0.4)' : 'none',
        transform:    hov ? 'scale(1.02)' : 'scale(1)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <Icon size={14} strokeWidth={primary ? 2.2 : 1.8} />
      {label}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function ProjectShowcase() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);

  const activeFeature = FEATURES.find((f) => f.id === activeId) ?? FEATURES[0];

  return (
    <section
      id="work"
      className="relative"
      style={{ background: 'transparent' }}
    >
      {/* ── Section header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="eyebrow">Featured Project</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-5">
            <div>
              <ScrambleText
                text="Trackwise"
                as="h2"
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(2.2rem, 5vw, 4rem)',
                  letterSpacing: '-0.045em',
                  lineHeight:    1,
                  color:         'var(--text-primary)',
                  display:       'block',
                }}
                delay={120}
                scrambleMs={680}
              />
              <p
                className="mt-2 font-light"
                style={{ color: 'var(--text-muted)', fontSize: 15 }}
              >
                Smart Expense Tracker
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <HeaderCTA
                href={SOURCE_URL}
                icon={Github}
                label="View Source Code"
                primary={false}
              />
              <HeaderCTA
                href={DEMO_URL}
                icon={ExternalLink}
                label="Live Demo"
                primary={true}
              />
            </div>
          </div>

          <div
            className="flex flex-wrap gap-2 pb-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {TECH_STACK.map((t) => (
              <span
                key={t}
                className="font-mono"
                style={{
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(160,180,218,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  letterSpacing: '0.02em',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Sticky-scroll layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-start gap-12 lg:gap-20 relative">

          {/* LEFT — sticky image column */}
          <div className="hidden lg:block w-[380px] xl:w-[420px] flex-shrink-0 sticky top-32 h-fit pb-12">
            <TiltImageCard
              src={activeFeature.image}
              alt={activeFeature.imageAlt}
            />

            <StepDots
              features={FEATURES}
              activeId={activeId}
              onSelect={setActiveId}
            />

            <motion.p
              key={activeFeature.tag}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mt-3 text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: 'rgba(56,189,248,0.55)' }}
            >
              {activeFeature.tag}
            </motion.p>
          </div>

          {/* RIGHT — scrolling feature panels */}
          <div className="flex-1 min-w-0">
            {FEATURES.map((feature) => (
              <FeaturePanel
                key={feature.id}
                feature={feature}
                onVisible={setActiveId}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
} 