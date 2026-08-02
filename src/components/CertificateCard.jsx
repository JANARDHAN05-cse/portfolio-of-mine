import { useEffect, useRef, useState } from "react";

/**
 * CertificateCard — stagger-reveals with per-card delay from parent.
 */
function CertificateCard({ title, issuer, year, revealDelay = 0 }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

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
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={`certificate-card cert-card--animate${visible ? " cert-card--visible" : ""}`}
      style={{ transitionDelay: visible ? `${revealDelay}ms` : "0ms" }}
    >
      <h3>{title}</h3>
      <p>
        <span>Issued by</span> {issuer}
      </p>
      <p className="certificate-year">{year}</p>
    </article>
  );
}

export default CertificateCard;
