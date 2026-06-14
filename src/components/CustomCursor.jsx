import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────
   CustomCursor
   
   Two-layer cursor system:
     • Inner dot  — 6px, snaps instantly to pointer
     • Outer ring — 36px, follows with spring lag via rAF
   
   States:
     • default  — dot + translucent ring
     • hovering — ring expands (52px), fills accent blue,
                  dot hides (ring takes focus)
     • clicking — ring contracts sharply (28px)
   
   The outer ring is driven by a lerp loop running in
   requestAnimationFrame — silky smooth at any frame rate,
   zero jitter, no external deps.
───────────────────────────────────────────────────────── */

/* Selectors that trigger the hover state */
const HOVER_SELECTORS = [
  'a', 'button', 'input', 'textarea', 'select', 'label',
  '[role="button"]', '[tabindex]', '.btn-magnetic',
  '.skill-card', '.tilt-card', '.focus-glow-wrapper',
].join(', ');

const LERP_FACTOR = 0.10; // outer ring lag — lower = more lag

export default function CustomCursor() {
  /* Raw pointer position (immediate) */
  const mouseRef = useRef({ x: -100, y: -100 });
  /* Lerped position for the outer ring */
  const ringPos  = useRef({ x: -100, y: -100 });
  /* rAF handle */
  const rafRef   = useRef(null);

  /* DOM refs for direct mutation (no state → no re-renders) */
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible,  setVisible ] = useState(false);
  /*
    TOUCH FIX:
    null  = not yet determined (avoids SSR mismatch / flash)
    true  = touch/coarse-pointer device → render nothing,
            never call document.documentElement.style.cursor
    false = mouse/trackpad → proceed as normal
  */
  const [isTouch, setIsTouch] = useState(null);

  /* ── Lerp animation loop ── */
  const animate = useCallback(() => {
    const { x: mx, y: my } = mouseRef.current;
    const rx = ringPos.current.x + (mx - ringPos.current.x) * LERP_FACTOR;
    const ry = ringPos.current.y + (my - ringPos.current.y) * LERP_FACTOR;
    ringPos.current = { x: rx, y: ry };

    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform =
        `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    /*
      Detect touch/coarse-pointer devices. `pointer: coarse`
      catches phones and tablets; `ontouchstart` is a fallback
      for older browsers. Devices with a mouse AND touch
      (e.g. some laptops) report `pointer: fine` as primary,
      so they correctly get the custom cursor.
    */
    const touchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window && navigator.maxTouchPoints > 0);

    setIsTouch(touchDevice);

    /* On touch devices: do nothing — leave native behaviour untouched */
    if (touchDevice) return;

    /* Mark <html> so the scoped CSS in index.css activates */
    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onEnter = (e) => {
      if (e.target.closest(HOVER_SELECTORS)) setHovering(true);
    };
    const onLeave = (e) => {
      if (e.target.closest(HOVER_SELECTORS)) setHovering(false);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    const onMouseOut = (e) => {
      /* Cursor left the window */
      if (!e.relatedTarget) setVisible(false);
    };

    document.addEventListener('mousemove',  onMove,   { passive: true });
    document.addEventListener('mouseover',  onEnter,  { passive: true });
    document.addEventListener('mouseout',   onLeave,  { passive: true });
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseout',   onMouseOut);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onEnter);
      document.removeEventListener('mouseout',   onLeave);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseout',   onMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, visible]);

  /* Sizes and colours driven by state */
  const ringSize    = clicking ? 24 : hovering ? 52 : 36;
  const ringBg      = hovering ? 'rgba(56,189,248,0.12)' : 'transparent';
  const ringBorder  = clicking
    ? 'rgba(56,189,248,0.9)'
    : hovering
    ? 'rgba(56,189,248,0.75)'
    : 'rgba(56,189,248,0.55)';
  const ringShadow  = hovering
    ? '0 0 18px rgba(56,189,248,0.35), 0 0 6px rgba(56,189,248,0.2) inset'
    : '0 0 8px rgba(56,189,248,0.15)';
  const dotOpacity  = hovering ? 0 : 1;
  const dotScale    = clicking ? 0.6 : 1;

  if (typeof window === 'undefined') return null; // SSR guard
  if (isTouch === null || isTouch === true) return null; // touch device or not yet detected

  return (
    <>
      {/* ── Inner dot — snaps instantly ── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          zIndex:         99999,
          pointerEvents:  'none',
          width:          6,
          height:         6,
          borderRadius:   '50%',
          background:     '#38BDF8',
          boxShadow:      '0 0 8px rgba(56,189,248,0.8)',
          opacity:        visible ? dotOpacity : 0,
          transform:      'translate(-100px, -100px) translate(-50%,-50%)',
          transition:     'opacity 0.2s ease, transform 0.05s linear',
          willChange:     'transform',
          /* Scale via separate wrapper since transform is managed by rAF */
          scale:          dotScale,
        }}
      />

      {/* ── Outer ring — lerp-lagged ── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          zIndex:         99998,
          pointerEvents:  'none',
          width:          ringSize,
          height:         ringSize,
          borderRadius:   '50%',
          background:     ringBg,
          border:         `1.5px solid ${ringBorder}`,
          boxShadow:      ringShadow,
          opacity:        visible ? 1 : 0,
          transform:      'translate(-100px, -100px) translate(-50%,-50%)',
          transition: [
            `width ${clicking ? '0.1s' : '0.35s'} cubic-bezier(0.34,1.56,0.64,1)`,
            `height ${clicking ? '0.1s' : '0.35s'} cubic-bezier(0.34,1.56,0.64,1)`,
            'background 0.25s ease',
            'border-color 0.25s ease',
            'box-shadow 0.25s ease',
            'opacity 0.3s ease',
          ].join(', '),
          willChange: 'transform, width, height',
        }}
      />
    </>
  );
}