import { useEffect, useRef, useState } from "react";

/**
 * Animated SkillCard — title appears first, then chips cascade in
 * one-by-one with 60ms stagger. All driven by CSS + IntersectionObserver.
 */
function SkillCard({ title, skills }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      className={`skill-card skill-card--animate${visible ? " skill-card--visible" : ""}`}
      ref={cardRef}
    >
      <h3 className={`skill-card__title${visible ? " skill-card__title--visible" : ""}`}>
        {title}
      </h3>
      <div className="skill-tags">
        {skills.map((skill, index) => (
          <span
            key={skill}
            className={`skill-tag skill-tag--animate${visible ? " skill-tag--visible" : ""}`}
            style={{ transitionDelay: visible ? `${80 + index * 60}ms` : "0ms" }}
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

export default SkillCard;
