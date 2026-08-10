import { useRef } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import heroPhoto from "../assets/linkedin_profile.png";
import WarpText from "./WarpText";

// ── Stagger config ─────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];
const BASE_DURATION = 0.7;

function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 18, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: BASE_DURATION, ease: EASE, delay },
  };
}

// ── Main Hero ─────────────────────────────────────────────────
function Hero() {
  const frameRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="hero-section" id="home">

      {/* ── Left: Copy ── */}
      <div className="hero-copy">
        <motion.span className="eyebrow" {...fadeUp(0.1)}>
          Software engineering portfolio
        </motion.span>
        
        <motion.div className="hero-name-block" {...fadeUp(0.22)}>
          <h1 className="sr-only">Mr.P.Janardhan</h1>
          <WarpText
            text="Mr.P.Janardhan"
            color="#2d241c"
            warpStrength={0.09}
            warpScale={1.8}
            speed={0.55}
            pointerInfluence={0.45}
            pointerStrength={0.42}
            refraction={0.02}
            ripple
            fontSize="clamp(2.5rem, 5.5vw, 4.5rem)"
            fontWeight={800}
            style={{ height: '130px', width: '100%', maxWidth: '620px' }}
            fontFamily="inherit"
            letterSpacing="-0.04em"
            lineHeight={0.95}
          />
        </motion.div>

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
        <div className="hero-visual-wrapper">

          {/* Photo frame — normal 100% brightness */}
          <div ref={frameRef} className="hero-visual__frame">
            <img
              src={heroPhoto}
              alt="Mr.P.Janardhan"
              className="hero-photo"
            />
          </div>

        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
