import { useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import heroPhoto from "../assets/linkedin_profile.png";

// ── Stagger config ─────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];
const BASE_DURATION = 0.7;
const ROPE_REST = 90; // natural rope length in SVG units (px)

function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 18, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: BASE_DURATION, ease: EASE, delay },
  };
}

// ── 3D Mortarboard (Image-2 style) ────────────────────────────
function GradCap({ isLit }) {
  return (
    <motion.svg
      viewBox="0 0 120 92"
      className="grad-cap-svg"
      aria-hidden="true"
      animate={
        isLit
          ? {
              filter: [
                "drop-shadow(0 3px 6px rgba(0,0,0,0.22))",
                "drop-shadow(0 0 22px rgba(229,169,88,1)) drop-shadow(0 0 8px rgba(229,169,88,0.55))",
                "drop-shadow(0 0 11px rgba(229,169,88,0.65))",
              ],
            }
          : { filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.22))" }
      }
      transition={{ duration: 0.55, ease: EASE }}
    >
      <defs>
        <linearGradient id="cTop" x1="20" y1="10" x2="100" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#3d404d" />
          <stop offset="50%"  stopColor="#252731" />
          <stop offset="100%" stopColor="#16171d" />
        </linearGradient>
        <linearGradient id="cRim" x1="20" y1="35" x2="100" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#181920" />
          <stop offset="100%" stopColor="#0a0a0e" />
        </linearGradient>
        <linearGradient id="cSkull" x1="40" y1="38" x2="80" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2d2f3a" />
          <stop offset="100%" stopColor="#14151a" />
        </linearGradient>
        <linearGradient id="gRope" x1="60" y1="27" x2="95" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fff0a0" />
          <stop offset="20%"  stopColor="#e5b044" />
          <stop offset="55%"  stopColor="#b38119" />
          <stop offset="80%"  stopColor="#f0cc60" />
          <stop offset="100%" stopColor="#8a5c08" />
        </linearGradient>
      </defs>

      {/* Skull cap body */}
      <path
        d="M38 38 Q60 49 82 38 L77 60 Q60 69 43 60 Z"
        fill="url(#cSkull)" stroke="#111216" strokeWidth="1.8"
      />

      {/* Mortarboard top face (angled perspective) */}
      <polygon
        points="60,7 115,27 60,47 5,27"
        fill="url(#cTop)" stroke="#121317" strokeWidth="2.2" strokeLinejoin="round"
      />

      {/* Rim bevel */}
      <polygon
        points="5,27 60,47 115,27 115,31 60,51 5,31"
        fill="url(#cRim)" stroke="#0b0b0e" strokeWidth="1"
      />

      {/* Specular highlight on top face */}
      <polyline
        points="6,27 60,8 114,27"
        stroke="#63687a" strokeWidth="1.4" opacity="0.8" fill="none"
      />

      {/* Gold center button */}
      <ellipse cx="60" cy="27" rx="5.5" ry="3.8" fill="#181920" stroke="#d4af37" strokeWidth="1.5" />
      <ellipse cx="59.5" cy="26.3" rx="3.8" ry="2.2" fill="#ffe066" opacity="0.9" />

      {/* Braided gold tassel — loops from button over right shoulder, down to knot */}
      <path
        d="M60 27 Q82 19 97 28 Q106 34 101 46 Q97 57 103 68 Q107 75 101 82 Q96 87 91 81"
        fill="none" stroke="url(#gRope)" strokeWidth="5.2" strokeLinecap="round"
      />
      {/* Braid twist highlight */}
      <path
        d="M60 27 Q82 19 97 28 Q106 34 101 46 Q97 57 103 68 Q107 75 101 82"
        fill="none" stroke="#fff8d0" strokeWidth="1.6"
        strokeDasharray="3 3.5" opacity="0.9"
      />

      {/* Tassel knot bulge */}
      <ellipse cx="91" cy="82" rx="5.5" ry="4.5" fill="url(#gRope)" stroke="#5a3c00" strokeWidth="0.8" />

      {/* Tassel fringe strands */}
      <path
        d="M87 85 L85 92 M91 86 L90 92 M95 85 L97 92"
        stroke="url(#gRope)" strokeWidth="2.2" strokeLinecap="round"
      />
    </motion.svg>
  );
}

// ── Flexible SVG Rope (bezier updates via MotionValue) ─────────
function FlexibleRope({ dragY, isLit }) {
  const mainColor  = isLit ? "#b8894a" : "#96785a";
  const twistColor = isLit ? "#dec878" : "#bda06a";

  // Path `d` attribute as a reactive MotionValue string
  const pathD = useTransform(dragY, (raw) => {
    const y   = Math.max(0, raw);
    const cx  = 14;                      // horizontal center of SVG (28px wide)
    const sy  = 0;
    const ey  = ROPE_REST + y;           // rope-end Y extends as user pulls
    // Control point creates natural catenary sag; sway increases when pulled
    const cpx = cx + (y > 8 ? Math.sin(y * 0.048) * 8 : -3.5);
    const cpy = sy + (ey - sy) * 0.42;
    return `M ${cx} ${sy} Q ${cpx} ${cpy} ${cx} ${ey}`;
  });

  return (
    <svg
      className="rope-svg"
      viewBox="0 0 28 230"
      overflow="visible"
      aria-hidden="true"
    >
      {/* Main rope strand */}
      <motion.path
        d={pathD}
        stroke={mainColor}
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Braided twist dashes */}
      <motion.path
        d={pathD}
        stroke={twistColor}
        strokeWidth="1.4"
        strokeDasharray="3.5 3.5"
        fill="none"
        strokeLinecap="round"
        opacity={0.88}
      />
    </svg>
  );
}

// ── Rope-end Knot (grab handle — no text) ─────────────────────
function RopeKnot({ isLit }) {
  const c = isLit ? "#b8894a" : "#96785a";
  const h = isLit ? "#dec878" : "#bda06a";
  return (
    <svg viewBox="0 0 28 32" width="28" height="32">
      {/* Knot body */}
      <ellipse cx="14" cy="10" rx="7.5" ry="5.5" fill={c} />
      <ellipse cx="13.5" cy="8.8" rx="4.8" ry="3.2" fill={h} opacity={0.55} />
      <path d="M6.5 10.5 Q14 19 21.5 10.5" stroke={h} strokeWidth="1.5" fill="none" />
      {/* Fringe strands */}
      <line x1="10" y1="14" x2="9"  y2="30" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14" y1="15" x2="14" y2="31" stroke={h} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="14" x2="19" y2="30" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Pull Interaction (drag-down to toggle light) ───────────────
function PullStringLight({ isLit, onToggle, shouldReduceMotion }) {
  const dragY = useMotionValue(0);

  const handleDragEnd = useCallback(
    (_, info) => {
      // Elastic spring snap-back
      animate(dragY, 0, { type: "spring", stiffness: 420, damping: 20, mass: 0.7 });
      if (info.offset.y > 45) onToggle();
    },
    [dragY, onToggle]
  );

  if (shouldReduceMotion) return null;

  return (
    // Container: position:absolute → sits at top-right corner of .hero-visual-wrapper
    <div className="pull-string-container" aria-label="Pull rope to toggle light">
      {/* 3D cap — static */}
      <GradCap isLit={isLit} />

      {/* Rope hangs below cap */}
      <div className="rope-wrapper">
        {/* Reactive flexible SVG rope */}
        <FlexibleRope dragY={dragY} isLit={isLit} />

        {/* Draggable rope-end knot */}
        <motion.div
          className="rope-knot"
          style={{ y: dragY }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 130 }}
          dragElastic={0.5}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
        >
          <RopeKnot isLit={isLit} />
        </motion.div>
      </div>
    </div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────
function Hero() {
  const [isLit, setIsLit]       = useState(false);
  const shouldReduceMotion      = useReducedMotion();
  const handleToggle            = useCallback(() => setIsLit((p) => !p), []);

  // Gentle float when lit
  const frameAnimate = shouldReduceMotion
    ? {}
    : isLit
    ? {
        y: [0, -7, 0],
        transition: {
          y: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
        },
      }
    : { y: 0, transition: { duration: 0.6, ease: EASE } };

  return (
    <section className="hero-section" id="home">

      {/* ── Left: Copy ── */}
      <div className="hero-copy">
        <motion.span className="eyebrow" {...fadeUp(0.1)}>
          Software engineering portfolio
        </motion.span>
        <motion.h1 {...fadeUp(0.22)}>Hi, I'm JANARDHAN P.</motion.h1>
        <motion.p className="hero-intro" {...fadeUp(0.36)}>
          I am a pre-final year B.E. Computer Science Engineering student at
          Saveetha Engineering College, building dependable software with Java,
          Spring Boot, React, MySQL, and Python.
        </motion.p>
        <motion.div className="hero-actions" {...fadeUp(0.5)}>
          <a href="#contact" className="button button--primary">Contact me</a>
          <a href="#projects" className="button button--secondary">View case studies</a>
        </motion.div>
      </div>

      {/* ── Right: Visual ── */}
      <motion.div
        className="hero-visual"
        aria-label="Portrait preview"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.45 }}
      >
        {/* Wrapper: lets us absolutely position cap at top-right of frame */}
        <div className="hero-visual-wrapper">

          {/* Warm ambient orb behind frame */}
          <motion.div
            className="hero-ambient-spotlight"
            animate={{ opacity: isLit ? 1 : 0, scale: isLit ? 1.15 : 0.85 }}
            transition={{ duration: 0.7, ease: EASE }}
            aria-hidden="true"
          />

          {/* Photo frame */}
          <motion.div
            className={`hero-visual__frame${isLit ? " hero-visual__frame--lit" : ""}`}
            animate={frameAnimate}
          >
            {/* Inner glow overlay */}
            <motion.div
              className={`hero-glow-overlay${isLit ? " hero-glow-overlay--lit" : ""}`}
              aria-hidden="true"
            />

            {/* Photo — dramatically dimmed at rest, illuminated on pull */}
            <motion.img
              src={heroPhoto}
              alt="Janardhan P"
              className="hero-photo"
              animate={
                shouldReduceMotion
                  ? {}
                  : isLit
                  ? {
                      filter: [
                        "brightness(0.68) contrast(0.9) saturate(0.75)",
                        "brightness(1.45) contrast(1.15) saturate(1.3)",
                        "brightness(0.82) contrast(0.95)",
                        "brightness(1.2) contrast(1.08) saturate(1.22)",
                      ],
                    }
                  : { filter: "brightness(0.68) contrast(0.9) saturate(0.75)" }
              }
              transition={
                isLit
                  ? { duration: 0.52, times: [0, 0.25, 0.52, 1], ease: EASE }
                  : { duration: 0.6, ease: EASE }
              }
            />
          </motion.div>

          {/* Cap + rope — pinned to top-right corner of the frame */}
          <PullStringLight
            isLit={isLit}
            onToggle={handleToggle}
            shouldReduceMotion={shouldReduceMotion}
          />

        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
