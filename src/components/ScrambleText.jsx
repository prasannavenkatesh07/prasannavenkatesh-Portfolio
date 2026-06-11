import { useScramble } from './Usescramble'

/* ─────────────────────────────────────────────────────────
   ScrambleText
   Drop-in replacement for any heading/span where you
   want the decrypt-reveal effect on scroll.

   Props:
     text       — string to display
     as         — HTML tag ('h1'|'h2'|'h3'|'span'|'p')
     className  — class names (Tailwind or custom)
     style      — inline styles
     speed      — ms per scramble frame  (default 42)
     scrambleMs — total scramble window  (default 560)
     delay      — ms before starting     (default 0)
     autoplay   — trigger on scroll into view (default true)
     playOnce   — only play once         (default true)
     onHoverPlay— also replay on mouse hover (default false)

   Example:
     <ScrambleText
       text="The stack I ship with."
       as="h2"
       className="section-heading"
       delay={100}
     />
───────────────────────────────────────────────────────── */
export default function ScrambleText({
  text,
  as: Tag      = 'span',
  className    = '',
  style        = {},
  speed        = 42,
  scrambleMs   = 560,
  delay        = 0,
  autoplay     = true,
  playOnce     = true,
  onHoverPlay  = false,
}) {
  const { ref, trigger } = useScramble({
    text,
    speed,
    scrambleMs,
    autoplay,
    playOnce,
    delay,
  })

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={onHoverPlay ? trigger : undefined}
    >
      {text}
    </Tag>
  )
}