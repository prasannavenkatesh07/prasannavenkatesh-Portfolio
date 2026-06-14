import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   useScramble — text decrypt / scramble-reveal hook

   Usage:
     const { ref, trigger } = useScramble({ text: 'Hello' })
     <h2 ref={ref}>{text}</h2>

   OR — auto-trigger on scroll into view (most common):
     const { ref } = useScramble({ text: 'Hello', autoplay: true })

   How it works:
     1. On trigger(), every character is replaced with a
        random glyph from CHARS.
     2. Each character has a resolve "tick" — the number of
        frames before it settles to its real value.
     3. Ticks are staggered left-to-right, so characters
        reveal sequentially like a decrypt animation.
     4. Runs in rAF for silky performance, zero layout
        thrashing — only a single textContent write per frame.

   Options:
     text        — the final string to reveal
     speed       — ms per frame (lower = faster). Default 45
     scrambleMs  — how long each char stays scrambled. Default 600
     autoplay    — auto-trigger when element enters viewport
     playOnce    — only scramble once (default true)
     delay       — ms delay before scramble starts
───────────────────────────────────────────────────────── */

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function useScramble({
  text = "",
  speed = 42,
  scrambleMs = 560,
  autoplay = false,
  playOnce = true,
  delay = 0,
} = {}) {
  const outputRef = useRef(null);
  const rafId = useRef(null);
  const hasPlayed = useRef(false);
  const isRunning = useRef(false);

  const trigger = useCallback(() => {
    if (playOnce && hasPlayed.current) return;
    if (isRunning.current) return;
    if (!outputRef.current) return;

    const run = () => {
      isRunning.current = true;

      const chars = text.split("");
      const total = chars.length;
      /* ticks[i] = frame number at which char i resolves */
      const ticks = chars.map(
        (_, i) =>
          Math.round((i / total) * (scrambleMs / speed)) +
          Math.floor(Math.random() * 3),
      );
      let frame = 0;
      let lastT = 0;

      const step = (ts) => {
        if (ts - lastT < speed) {
          rafId.current = requestAnimationFrame(step);
          return;
        }
        lastT = ts;
        frame++;

        let allDone = true;
        const out = chars.map((ch, i) => {
          if (ch === " ") return " ";
          if (frame >= ticks[i]) return ch; // resolved
          allDone = false;
          return rand(CHARS); // still scrambling
        });

        if (outputRef.current) {
          outputRef.current.textContent = out.join("");
        }

        if (!allDone) {
          rafId.current = requestAnimationFrame(step);
        } else {
          /* Ensure final text is exact */
          if (outputRef.current) outputRef.current.textContent = text;
          isRunning.current = false;
          hasPlayed.current = true;
        }
      };

      rafId.current = requestAnimationFrame(step);
    };

    if (delay > 0) {
      setTimeout(run, delay);
    } else {
      run();
    }
  }, [text, speed, scrambleMs, playOnce, delay]);

  /* Auto-trigger on IntersectionObserver */
  useEffect(() => {
    if (!autoplay) return;
    const el = outputRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger();
          if (playOnce) io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [autoplay, playOnce, trigger]);

  /* Cleanup on unmount */
  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    },
    [],
  );

  return { ref: outputRef, trigger };
}
