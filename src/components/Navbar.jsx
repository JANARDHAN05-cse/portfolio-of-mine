import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "highlights", label: "Highlights" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Framer Motion variants for the header
const headerVariants = {
  top: {
    top: 0,
    width: "100%",
    maxWidth: "100%",
    padding: "16px 64px",
    borderRadius: "0px",
    background: "rgba(250, 244, 236, 0.88)",
    boxShadow: "0 8px 24px rgba(70, 46, 20, 0.04)",
    border: "0px solid rgba(228, 210, 183, 0.9)",
  },
  floating: {
    top: 16,
    width: "min(720px, calc(100% - 32px))",
    maxWidth: 720,
    padding: "10px 28px",
    borderRadius: "100px",
    background: "rgba(245, 239, 230, 0.82)",
    boxShadow:
      "0 12px 36px rgba(139, 90, 40, 0.14), 0 2px 8px rgba(139, 90, 40, 0.06)",
    border: "0.5px solid rgba(180, 150, 100, 0.35)",
  },
};

function Navbar({ activeSection }) {
  const [floating, setFloating] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef(null);
  const linkRefs = useRef({});
  const shouldReduceMotion = useReducedMotion();

  // Scroll listener — float when scrolled past 80px
  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide indicator to active link
  useEffect(() => {
    const activeEl = linkRefs.current[activeSection];
    const navEl = navRef.current;
    if (activeEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    }
  }, [activeSection, floating]);

  return (
    <motion.header
      className={`site-header${floating ? " site-header--floating" : ""}`}
      variants={headerVariants}
      animate={floating ? "floating" : "top"}
      initial={{ opacity: 0, y: -48 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.6, delay: 0.05 },
              y: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
            }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="brand">
        <span className="brand-mark">J</span>
        <div>
          <p className="brand-name">JANARDHAN P</p>
          <span className={`brand-subtitle${floating ? " brand-subtitle--hidden" : ""}`}>
            Software Engineering Portfolio
          </span>
        </div>
      </div>

      <nav className="site-nav" ref={navRef}>
        {/* Sliding active indicator */}
        {NAV_LINKS.some((l) => l.id === activeSection) && (
          <motion.span
            className="nav-indicator"
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
            }
          />
        )}

        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-link${activeSection === link.id ? " is-active" : ""}`}
            ref={(el) => { linkRefs.current[link.id] = el; }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}

export default Navbar;
