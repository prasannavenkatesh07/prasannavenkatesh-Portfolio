import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Mail, Send, ArrowUpRight } from 'lucide-react';
import ScrambleText from './ScrambleText';

/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const EMAIL   = 'sprasannavenkatesh17@gmail.com';
const SUBJECT = "Let's build something together";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────
   Info box — inside left card
───────────────────────────────────────────────────────── */
function InfoBox({ icon: Icon, label, value }) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col gap-1.5 px-4 py-3.5 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={11} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-sm font-semibold truncate"
        style={{
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Send button with magnetic + shine + spotlight
───────────────────────────────────────────────────────── */
function SendButton({ onClick }) {
  const btnRef                  = useRef(null);
  const [hov, setHov]           = useState(false);
  const [offset, setOffset]     = useState({ x: 0, y: 0 });
  const [pos, setPos]           = useState({ x: '50%', y: '50%' });
  const STRENGTH = 0.28;

  const handleMouseMove = (e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    setOffset({
      x: (e.clientX - cx) * STRENGTH,
      y: (e.clientY - cy) * STRENGTH,
    });
    setPos({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  const handleMouseLeave = () => {
    setHov(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-semibold transition-all duration-250"
      style={{
        padding: '15px 24px',
        fontSize: '0.9375rem',
        letterSpacing: '-0.01em',
        fontFamily: 'var(--font-display)',
        background: 'var(--accent-blue)',
        color: '#040D18',
        border: 'none',
        cursor: 'pointer',
        boxShadow: hov
          ? '0 0 36px rgba(56,189,248,0.45), 0 4px 20px rgba(56,189,248,0.2)'
          : '0 0 0 rgba(56,189,248,0)',
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${hov ? 1.015 : 1})`,
        transition: hov
          ? 'box-shadow 0.3s ease, transform 0.1s linear'
          : 'box-shadow 0.3s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: hov ? 1 : 0,
          background:
            'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.32) 50%, transparent 80%)',
          backgroundSize: '300% 100%',
          backgroundPosition: hov ? '200% 0' : '-200% 0',
          animation: hov ? 'btnShineSweep 0.55s ease forwards' : 'none',
          transition: 'opacity 0.15s',
        }}
      />
      {/* Cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: hov ? 1 : 0,
          background: `radial-gradient(70px circle at ${pos.x} ${pos.y}, rgba(255,255,255,0.22), transparent 70%)`,
          transition: 'opacity 0.2s',
        }}
      />
      <Send
        size={15}
        strokeWidth={2.2}
        className="relative"
        style={{
          transform: hov ? 'translate(1px,-1px)' : 'translate(0,0)',
          transition: 'transform 0.2s ease',
        }}
      />
      <span className="relative">Send Email</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Scroll-to-top button
───────────────────────────────────────────────────────── */
function ScrollToTop() {
  const [hov, setHov] = useState(false);
  return (
    <div className="flex justify-center py-14">
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label="Scroll to top"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: hov ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${hov ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.09)'}`,
          boxShadow: hov ? '0 0 24px rgba(56,189,248,0.2)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        <ArrowUpRight
          size={16}
          strokeWidth={2}
          style={{
            color: hov ? 'var(--accent-blue)' : 'var(--text-muted)',
            transform: hov ? 'translate(2px,-2px)' : 'translate(0,0)',
            transition: 'all 0.22s ease',
          }}
        />
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────── */
export default function Contact() {
  const sectionRef            = useRef(null);
  const inView                = useInView(sectionRef, { once: true, margin: '-8%' });
  const [focused, setFocused] = useState(false);
  const [text, setText]       = useState('');

  const handleSend = () => {
    const body    = encodeURIComponent(text.trim());
    const subject = encodeURIComponent(SUBJECT);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const cardVariant = (delay) => ({
    hidden:  { opacity: 0, y: 28 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay },
    },
  });

  return (
    <>
      {/* ── @keyframes for shine (injected once) ── */}
      <style>{`
        @keyframes btnShineSweep {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6"
      >
        {/* Ambient glow centred on section */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div
            style={{
              width: 700,
              height: 400,
              background:
                'radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 68%)',
              filter: 'blur(60px)',
              flexShrink: 0,
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">

          {/* ── Section eyebrow ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="mb-10"
          >
            <span className="eyebrow">Contact</span>
          </motion.div>

          {/* ── Two-card grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ════ LEFT CARD — The Pitch ════ */}
            <motion.div
              variants={cardVariant(0.05)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="relative flex flex-col justify-between rounded-2xl p-5 sm:p-8 overflow-hidden min-h-[400px] sm:min-h-[440px]"
              style={{
                background: 'rgba(10, 15, 28, 0.85)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.3)',
              }}
            >
              {/* Inner grain */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.02]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: '140px',
                }}
                aria-hidden
              />

              {/* Top content */}
              <div>
                {/* Eyebrow */}
                <p className="eyebrow mb-7">Reach Out</p>

                {/* Headline — scramble on scroll */}
                <ScrambleText
                  text="Let's build something together."
                  as="h2"
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontWeight:    800,
                    fontSize:      'clamp(1.9rem, 3.5vw, 2.8rem)',
                    letterSpacing: '-0.04em',
                    lineHeight:    0.95,
                    color:         'var(--text-primary)',
                    display:       'block',
                    marginBottom:  20,
                  }}
                  delay={200}
                  scrambleMs={750}
                />

                {/* Subtext */}
                <p
                  className="font-light leading-relaxed max-w-xs"
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.78,
                  }}
                >
                  Share your idea, timeline, or just say hello. I reply
                  quickly and love collaborating on ambitious builds.
                </p>
              </div>

              {/* Bottom info boxes — stack on very small screens so the
                  truncated email in "Primary Channel" has room to breathe */}
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <InfoBox
                  icon={Clock}
                  label="Response"
                  value="Within 24 hours"
                />
                <InfoBox
                  icon={Mail}
                  label="Primary Channel"
                  value={EMAIL}
                />
              </div>

              {/* Corner glow accent */}
              <div
                className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 rounded-2xl"
                style={{
                  background:
                    'radial-gradient(circle at bottom right, rgba(56,189,248,0.07), transparent 70%)',
                }}
                aria-hidden
              />
            </motion.div>

            {/* ════ RIGHT CARD — The Form ════ */}
            <motion.div
              variants={cardVariant(0.14)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="relative flex flex-col rounded-2xl p-5 sm:p-8 overflow-hidden min-h-[400px] sm:min-h-[440px]"
              style={{
                background: 'rgba(10, 15, 28, 0.85)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.3)',
              }}
            >
              {/* Inner grain */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.02]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: '140px',
                }}
                aria-hidden
              />

              {/* Eyebrow */}
              <p className="eyebrow mb-7 relative">Message</p>

              {/* Textarea with focus glow wrapper */}
              <div
                className="focus-glow-wrapper relative flex-1 mb-5"
                style={{ borderRadius: 12 }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Tell me about your project..."
                  className="relative w-full h-full resize-none text-sm leading-relaxed"
                  style={{
                    background: focused
                      ? 'rgba(56,189,248,0.03)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${focused
                      ? 'rgba(56,189,248,0.35)'
                      : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    padding: '16px 18px',
                    color: 'var(--text-primary)',
                    caretColor: 'var(--accent-blue)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    minHeight: 220,
                    outline: 'none',
                    transition: 'border-color 0.25s ease, background 0.25s ease',
                    display: 'block',
                  }}
                />
              </div>

              {/* Send button */}
              <SendButton onClick={handleSend} />

              {/* Hint */}
              <p
                className="text-center mt-3 text-[11px] relative"
                style={{
                  color: 'var(--text-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                This opens your default email app
              </p>
            </motion.div>

          </div>

          {/* ── Scroll to top ── */}
          <ScrollToTop />

        </div>
      </section>
    </>
  );
}