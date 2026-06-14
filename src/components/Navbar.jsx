import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Work',    href: '#work'    },
  { label: 'About',   href: '#about'   },
  { label: 'Contact', href: '#contact' },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────
   Magnetic nav link — text slides with cursor pull
───────────────────────────────────────────────────────── */
function MagneticNavLink({ href, label }) {
  const ref                     = useRef(null);
  const [offset, setOffset]     = useState({ x: 0, y: 0 });
  const [hov, setHov]           = useState(false);
  const STRENGTH = 0.25;

  const handleMouseMove = (e) => {
    const r  = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    setOffset({
      x: (e.clientX - cx) * STRENGTH,
      y: (e.clientY - cy) * STRENGTH,
    });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setOffset({ x: 0, y: 0 }); }}
      className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      style={{
        color:       hov ? 'var(--text-primary)' : 'var(--text-muted)',
        background:  hov ? 'rgba(255,255,255,0.05)' : 'transparent',
        transform:   `translate(${offset.x}px, ${offset.y}px)`,
        transition:  hov
          ? 'color 0.2s, background 0.2s, transform 0.1s linear'
          : 'color 0.2s, background 0.2s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        letterSpacing: '-0.01em',
        textDecoration: 'none',
        display: 'block',
      }}
    >
      {label}
      {/* Accent underline dot */}
      <span
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
        style={{
          width:      hov ? 14 : 0,
          height:     2,
          background: 'var(--accent-blue)',
          opacity:    hov ? 0.8 : 0,
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.75, ease: EASE_OUT_EXPO, delay: 0.05 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          padding:        scrolled ? '10px 0' : '18px 0',
          background:     scrolled
            ? 'rgba(8, 12, 22, 0.82)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom:   scrolled
            ? '1px solid rgba(255,255,255,0.07)'
            : '1px solid transparent',
        }}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-250"
              style={{
                background: 'rgba(56,189,248,0.1)',
                border:     '1px solid rgba(56,189,248,0.28)',
              }}
            >
              <Zap size={13} strokeWidth={2.4} style={{ color: 'var(--accent-blue)' }} />
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily:    'var(--font-display)',
                color:         'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              PV
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 list-none">
            {NAV_LINKS.map((link, i) => (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y:   0  }}
                transition={{ delay: 0.18 + i * 0.07, duration: 0.45 }}
              >
                <MagneticNavLink href={link.href} label={link.label} />
              </motion.li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <motion.a
            href="mailto:sprasannavenkatesh17@gmail.com"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="hidden md:flex items-center gap-2 rounded-xl font-medium text-sm transition-all duration-250"
            style={{
              padding:       '8px 16px',
              background:    'rgba(56,189,248,0.08)',
              border:        '1px solid rgba(56,189,248,0.22)',
              color:         'var(--accent-blue)',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = 'rgba(56,189,248,0.15)';
              e.currentTarget.style.borderColor  = 'rgba(56,189,248,0.45)';
              e.currentTarget.style.boxShadow    = '0 0 20px rgba(56,189,248,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = 'rgba(56,189,248,0.08)';
              e.currentTarget.style.borderColor  = 'rgba(56,189,248,0.22)';
              e.currentTarget.style.boxShadow    = 'none';
            }}
          >
            Let&apos;s talk
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-teal)', animation: 'ping-pulse 1.8s ease-out infinite' }}
            />
          </motion.a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: menuOpen ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y:   0  }}
            exit={{   opacity: 0, y: -16   }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden"
            style={{
              background:     'rgba(8, 12, 22, 0.96)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom:   '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <ul className="flex flex-col px-4 sm:px-6 py-5 gap-1 list-none">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-base font-medium transition-colors duration-200"
                    style={{
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-4">
                <a
                  href="mailto:sprasannavenkatesh17@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                >
                  Let&apos;s talk
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent-teal)' }}
                  />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}