import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Download, ArrowUpRight, Zap, Mail } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Constants — update these
───────────────────────────────────────────────────────── */
const EMAIL        = 'sprasannavenkatesh17@gmail.com';
const GITHUB_URL  = 'https://github.com/prasannavenkatesh07';
const LINKEDIN_URL= 'https://www.linkedin.com/in/prasannavenkatesh-s';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────
   Download Resume — glowing text link with animated
   underline and icon bounce on hover
───────────────────────────────────────────────────────── */
function ResumeLink() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="/resume.pdf"
      download
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group relative inline-flex items-center gap-3"
      style={{ textDecoration: 'none' }}
    >
      {/* Bloom glow behind the whole link */}
      <span
        className="pointer-events-none absolute -inset-4 rounded-2xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.18) 0%, transparent 70%)',
          opacity: hov ? 1 : 0,
          filter: 'blur(12px)',
        }}
      />

      {/* Icon box */}
      <span
        className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
        style={{
          background: hov ? 'rgba(56,189,248,0.16)' : 'rgba(56,189,248,0.08)',
          border: `1px solid ${hov ? 'rgba(56,189,248,0.55)' : 'rgba(56,189,248,0.22)'}`,
          boxShadow: hov ? '0 0 20px rgba(56,189,248,0.3)' : 'none',
        }}
      >
        <Download
          size={16}
          strokeWidth={2}
          style={{
            color: 'var(--accent-blue)',
            transform: hov ? 'translateY(2px)' : 'translateY(0)',
            transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </span>

      {/* Text + animated underline */}
      <span className="relative flex flex-col">
        <span
          className="relative text-base font-semibold transition-all duration-300"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: hov ? 'var(--accent-blue)' : 'var(--text-primary)',
            textShadow: hov
              ? '0 0 22px rgba(56,189,248,0.55), 0 0 44px rgba(56,189,248,0.2)'
              : 'none',
          }}
        >
          Download Résumé
        </span>
        {/* Underline that grows on hover */}
        <span
          className="absolute -bottom-0.5 left-0 h-px rounded-full transition-all duration-350"
          style={{
            width: hov ? '100%' : '0%',
            background: 'linear-gradient(to right, var(--accent-blue), var(--accent-teal))',
          }}
        />
      </span>

      <ArrowUpRight
        size={14}
        style={{
          color: hov ? 'var(--accent-blue)' : 'var(--text-muted)',
          transform: hov ? 'translate(3px,-3px)' : 'translate(0,0)',
          transition: 'all 0.22s ease',
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   Social icon button
───────────────────────────────────────────────────────── */
function SocialBtn({ href, icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-220"
      style={{
        background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hov ? '0 0 16px rgba(56,189,248,0.12)' : 'none',
        textDecoration: 'none',
      }}
    >
      <Icon
        size={17}
        strokeWidth={1.6}
        style={{
          color: hov ? 'var(--text-primary)' : 'var(--text-muted)',
          transition: 'color 0.2s',
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   Mailto CTA — full-width call-to-action in the footer
───────────────────────────────────────────────────────── */
function MailtoCTA() {
  const [hov, setHov] = useState(false);
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ x: '50%', y: '50%' });

  const handleMouseMove = (e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  return (
    <a
      ref={btnRef}
      href={`mailto:${EMAIL}?subject=Let's build something together`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative w-full flex items-center justify-center gap-2 sm:gap-3 overflow-hidden rounded-2xl font-semibold transition-all duration-300"
      style={{
        /* MOBILE FIX: smaller, viewport-aware padding so the button
           never forces the page wider on narrow screens */
        padding: 'clamp(14px, 4vw, 18px) clamp(16px, 5vw, 32px)',
        fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
        letterSpacing: '-0.01em',
        fontFamily: 'var(--font-display)',
        background: hov
          ? 'rgba(56,189,248,0.12)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.09)'}`,
        color: hov ? 'var(--accent-blue)' : 'var(--text-secondary)',
        boxShadow: hov
          ? '0 0 40px rgba(56,189,248,0.12), 0 0 0 1px rgba(56,189,248,0.1) inset'
          : 'none',
        textDecoration: 'none',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Radial cursor spotlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
        style={{
          opacity: hov ? 1 : 0,
          background: `radial-gradient(220px circle at ${pos.x} ${pos.y}, rgba(56,189,248,0.1), transparent 65%)`,
        }}
      />
      <Mail size={18} strokeWidth={1.8} className="relative flex-shrink-0" />
      {/* MOBILE FIX: minWidth:0 lets this span shrink inside the flex
          row; overflow/textOverflow truncate the long email address
          with an ellipsis on narrow screens instead of overflowing
          the button (and the page) horizontally. */}
      <span
        className="relative"
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {EMAIL}
      </span>
      <ArrowUpRight
        size={14}
        className="relative flex-shrink-0"
        style={{
          transform: hov ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'transform 0.2s ease',
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
export default function Footer() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  const cardVariant = (delay) => ({
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT_EXPO, delay } },
  });

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative"
      style={{
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top glow line */}
      <div className="glow-line" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-10">

        {/* ══ MAIN ROW ══ */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12 mb-14">

          {/* ── Brand + tagline ── */}
          <motion.div
            variants={cardVariant(0)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-4"
          >
            <a href="#" className="inline-flex items-center gap-2.5 w-fit group">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-250"
                style={{
                  background: 'rgba(56,189,248,0.1)',
                  border: '1px solid rgba(56,189,248,0.28)',
                }}
              >
                <Zap size={14} strokeWidth={2.4} style={{ color: 'var(--accent-blue)' }} />
              </span>
              <span
                className="font-display font-semibold text-sm"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Prasanna Venkatesh
              </span>
            </a>

            <p
              className="text-sm font-light leading-relaxed max-w-[240px]"
              style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}
            >
              Frontend Developer · VIT Vellore
              <br />
              B.Tech Information Technology
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              <SocialBtn href={GITHUB_URL}   icon={Github}   label="GitHub"   />
              <SocialBtn href={LINKEDIN_URL} icon={Linkedin} label="LinkedIn" />
            </div>
          </motion.div>

          {/* ── Resume download ── */}
          <motion.div
            variants={cardVariant(0.1)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col items-start md:items-center gap-2"
          >
            <ResumeLink />
            <p
              className="text-[11px] mt-1"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}
            >
              PDF · Updated June 2026
            </p>
          </motion.div>

          {/* ── Nav links ── */}
          <motion.div
            variants={cardVariant(0.18)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-2 items-start md:items-end"
          >
            {['Work', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {item}
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── Mailto CTA banner ── */}
        <motion.div
          variants={cardVariant(0.24)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-10"
        >
          <MailtoCTA />
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          variants={cardVariant(0.32)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(160,180,218,0.28)', letterSpacing: '0.02em' }}
          >
            © {new Date().getFullYear()} Prasanna Venkatesh. Built with React, Vite & Framer Motion.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-1.5 transition-colors duration-200"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'rgba(160,180,218,0.28)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(160,180,218,0.28)')}
          >
            <span
              className="text-[10px] uppercase tracking-[0.1em] font-medium"
              style={{ color: 'inherit' }}
            >
              Back to top
            </span>
            <ArrowUpRight size={11} style={{ color: 'inherit' }} />
          </button>
        </motion.div>

      </div>
    </footer>
  );
}