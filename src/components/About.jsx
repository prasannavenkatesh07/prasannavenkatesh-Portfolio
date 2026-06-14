import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Code2, Wind, Zap,
  Server, Database, GitBranch, Github as GithubIcon,
  BrainCircuit, BookOpen, Layers,
} from 'lucide-react';
import ScrambleText from './ScrambleText';


/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────
   Skill groups — correct stack, no hallucinated data
───────────────────────────────────────────────────────── */
const SKILL_GROUPS = [
  {
    label: 'Frontend',
    accent: '#38BDF8',        // sky-blue
    skills: [
      { name: 'React',    icon: Code2,   desc: 'Component architecture & hooks'  },
      { name: 'Vite',     icon: Zap,     desc: 'Lightning-fast build tooling'    },
      { name: 'Tailwind', icon: Wind,    desc: 'Utility-first CSS framework'     },
    ],
  },
  {
    label: 'Backend & Database',
    accent: '#A78BFA',        // violet
    skills: [
      { name: 'Node.js',  icon: Layers,    desc: 'Server-side JavaScript runtime' },
      { name: 'Express',  icon: Server,    desc: 'Minimalist web framework'       },
      { name: 'MongoDB',  icon: Database,  desc: 'Document-oriented NoSQL'        },
    ],
  },
  {
    label: 'Core Tools',
    accent: '#2DD4BF',        // teal
    skills: [
      { name: 'Git',    icon: GitBranch,  desc: 'Version control & branching'    },
      { name: 'GitHub', icon: GithubIcon, desc: 'Collaboration & CI workflows'   },
    ],
  },
];

/* ─────────────────────────────────────────────────────────
   Skill card — glowing gradient border on hover
   The gradient border is achieved by a ::before-style
   absolutely-positioned div that fades in on hover,
   sitting behind the card surface via z-index.
───────────────────────────────────────────────────────── */
function SkillCard({ skill, accent, delay }) {
  const cardRef             = useRef(null);
  const [hovered, setHov]   = useState(false);
  const [pos, setPos]       = useState({ x: '50%', y: '50%' });
  const Icon = skill.icon;

  const handleMouseMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay }}
      className="relative cursor-default"
      style={{ borderRadius: 14 }}
    >
      {/* ── Glowing gradient border layer ── */}
      {/*
        We fake a gradient border by layering:
          1. An outer div with the gradient as background (padding = border-width)
          2. An inner div with the card background fills the centre
        This avoids the background-clip border trick which breaks backdrop-filter.
      */}
      <div
        className="absolute inset-0 rounded-[14px] transition-opacity duration-300"
        style={{
          padding: 1,
          background: hovered
            ? `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.05), ${accent}55)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))',
          opacity: 1,
          /* simulate border via mask — simpler: just box-shadow glow */
          boxShadow: hovered
            ? `0 0 22px ${accent}28, 0 0 6px ${accent}18 inset`
            : 'none',
          borderRadius: 14,
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      />

      {/* Card surface */}
      <div
        className="relative flex items-start gap-3 p-4 rounded-[13px]"
        style={{
          background: hovered
            ? `rgba(15, 24, 44, 0.95)`
            : 'rgba(13, 20, 38, 0.85)',
          border: `1px solid ${hovered ? `${accent}35` : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[13px] transition-opacity duration-250"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(130px circle at ${pos.x} ${pos.y}, ${accent}12, transparent 70%)`,
          }}
        />

        {/* Icon box */}
        <div
          className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg mt-0.5 transition-all duration-250"
          style={{
            background: hovered ? `${accent}15` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${hovered ? `${accent}40` : 'rgba(255,255,255,0.09)'}`,
          }}
        >
          <Icon
            size={15}
            strokeWidth={1.8}
            style={{ color: hovered ? accent : 'rgba(200,214,240,0.5)', transition: 'color 0.25s' }}
          />
        </div>

        {/* Text */}
        <div className="relative min-w-0">
          <p
            className="text-sm font-semibold tracking-tight transition-colors duration-200"
            style={{
              color: hovered ? 'var(--text-primary)' : 'rgba(200,214,240,0.82)',
              letterSpacing: '-0.01em',
            }}
          >
            {skill.name}
          </p>
          <p
            className="text-xs mt-0.5 leading-snug"
            style={{ color: 'var(--text-muted)' }}
          >
            {skill.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Focus pill — DSA / AI / Frontend focus areas
───────────────────────────────────────────────────────── */
function FocusPill({ icon: Icon, label, sub, accent, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-250 cursor-default"
      style={{
        background: hov ? `${accent}0d` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov ? `${accent}35` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? `0 0 20px ${accent}18` : 'none',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-250"
        style={{
          background: hov ? `${accent}18` : `${accent}0f`,
          border: `1px solid ${hov ? `${accent}45` : `${accent}25`}`,
        }}
      >
        <Icon size={17} strokeWidth={1.7} style={{ color: accent }} />
      </div>
      {/* MOBILE FIX: minWidth:0 lets this flex child shrink below its
          content size, so the sub-label wraps inside the pill instead
          of forcing the whole pill (and its parent) wider than the
          viewport on narrow screens. */}
      <div style={{ minWidth: 0 }}>
        <p
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────── */
export default function About() {
  const bioRef    = useRef(null);
  const bioInView = useInView(bioRef, { once: true, margin: '-8%' });

  return (
    <section id="about" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6">

      {/* Subtle secondary aurora contribution */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate(30%, -20%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">

        {/* ══ BIO + FOCUS — two-column ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">

          {/* ── Left: Bio ── */}
          <div ref={bioRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={bioInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="eyebrow">About</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="mb-7"
            >
              <ScrambleText
                text="Building things that actually ship."
                as="h2"
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    800,
                  fontSize:      'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.04em',
                  lineHeight:    0.94,
                  color:         'var(--text-primary)',
                  display:       'block',
                }}
                delay={200}
                scrambleMs={700}
              />
            </motion.div>

            {[
              `3rd-year student pursuing B.Tech Information Technology (IT) at VIT Vellore. I don't just study web development — I build production-grade applications from the ground up, obsessing over architecture, performance, and the craft of genuinely clean code.`,
              `My engineering philosophy is simple: every feature should earn its place. I hold user experience and system design to the same uncompromising standard, and I don't ship until both pass.`,
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={bioInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.22 + i * 0.12 }}
                className="font-light leading-relaxed mb-4"
                style={{
                  fontSize: '0.975rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}
              >
                {text}
              </motion.p>
            ))}

            {/* VIT badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={bioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2.5 mt-3 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(56,189,248,0.06)',
                border: '1px solid rgba(56,189,248,0.18)',
                /* MOBILE FIX: badge can no longer exceed its parent's
                   width — combined with the span's normal white-space
                   and minWidth:0, the long "VIT Vellore · B.Tech..."
                   string now wraps onto a second line on narrow
                   screens instead of pushing the page wider. */
                maxWidth: '100%',
              }}
            >
              <GraduationCap size={15} strokeWidth={1.7} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <span
                className="text-sm font-medium"
                style={{
                  color: 'rgba(200,214,240,0.75)',
                  letterSpacing: '-0.01em',
                  minWidth: 0,
                  whiteSpace: 'normal',
                }}
              >
                VIT Vellore · B.Tech Information Technology
              </span>
            </motion.div>
          </div>

          {/* ── Right: Current Focus ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="mb-6"
            >
              <span className="eyebrow">Current Focus</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="mb-7"
            >
              <ScrambleText
                text="Always in deep water."
                as="h2"
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    800,
                  fontSize:      'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.04em',
                  lineHeight:    0.94,
                  color:         'var(--text-primary)',
                  display:       'block',
                }}
                delay={150}
                scrambleMs={650}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14, duration: 0.55, ease: EASE_OUT_EXPO }}
              className="font-light leading-relaxed mb-7"
              style={{
                fontSize: '0.975rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}
            >
              Full-stack development is the foundation, but I'm deliberately
              expanding my surface area — going deep on two more fronts
              simultaneously to become a more complete engineer.
            </motion.p>

            <div className="flex flex-col gap-3">
              <FocusPill
                icon={BookOpen}
                label="Data Structures & Algorithms"
                sub="Systematic problem-solving — patterns, complexity, LeetCode"
                accent="#38BDF8"
                delay={0.22}
              />
              <FocusPill
                icon={BrainCircuit}
                label="Artificial Intelligence"
                sub="ML fundamentals, models, and applied AI systems"
                accent="#A78BFA"
                delay={0.32}
              />

              {/* Connector */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-start gap-3 pl-4"
              >
                <div className="w-10 flex justify-center pt-0">
                  <div
                    className="w-px"
                    style={{
                      height: 28,
                      background: 'linear-gradient(to bottom, rgba(56,189,248,0.25), transparent)',
                    }}
                  />
                </div>
                <p
                  className="pt-2 text-xs italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  The intersection of all three is where I want to build.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Full-width divider ── */}
        <div className="section-divider mb-20" />

        {/* ══ SKILLS GRID ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="mb-12"
        >
          <span className="eyebrow">Technical Toolkit</span>
          <ScrambleText
            text="The stack I ship with."
            as="h2"
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    800,
              fontSize:      'clamp(1.8rem, 3.8vw, 2.8rem)',
              letterSpacing: '-0.04em',
              lineHeight:    0.95,
              color:         'var(--text-primary)',
              display:       'block',
              marginTop:     16,
            }}
            delay={100}
            scrambleMs={620}
          />
        </motion.div>

        <div className="flex flex-col gap-10">
          {SKILL_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {/* Group label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: gi * 0.06 }}
                className="flex items-center gap-3 mb-4"
              >
                <span
                  className="inline-block w-5 h-px"
                  style={{ background: group.accent, opacity: 0.6 }}
                />
                <span
                  className="text-[10px] font-semibold font-display uppercase tracking-[0.16em]"
                  style={{ color: group.accent, opacity: 0.8 }}
                >
                  {group.label}
                </span>
              </motion.div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
              >
                {group.skills.map((skill, si) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    accent={group.accent}
                    delay={gi * 0.07 + si * 0.06}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}