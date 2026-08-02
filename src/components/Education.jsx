import { useEffect, useRef, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";

const education = [
  {
    institution: "Saveetha Engineering College",
    degree: "B.E. Computer Science Engineering",
    detail: "CGPA {cgpa} | 2024 - Present",
    cgpa: 9.38,
    rawDetail: "2024 - Present",
  },
  {
    institution: "Chennai Higher Secondary School",
    degree: "Higher Secondary Education (12th)",
    detail: "{pct}% | 2024",
    pct: 92.67,
    rawDetail: "2024",
  },
  {
    institution: "St. Francis Savio Matriculation School",
    degree: "Secondary Education (10th)",
    detail: "84.8% | 2022",
  },
];

// Individual education card with timeline reveal
function EduCard({ item, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Count-up for CGPA
  const { ref: cgpaRef, value: cgpaVal } = useCountUp({
    end: item.cgpa ?? 0,
    duration: 1400,
    decimals: 2,
  });

  // Count-up for percentage
  const { ref: pctRef, value: pctVal } = useCountUp({
    end: item.pct ?? 0,
    duration: 1200,
    decimals: 2,
    suffix: "%",
  });

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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Determine detail text
  let detailText;
  if (item.cgpa) {
    detailText = (
      <>
        CGPA <span ref={cgpaRef}>{cgpaVal}</span> | {item.rawDetail}
      </>
    );
  } else if (item.pct) {
    detailText = (
      <>
        <span ref={pctRef}>{pctVal}</span> | {item.rawDetail}
      </>
    );
  } else {
    detailText = item.detail;
  }

  return (
    <article
      ref={cardRef}
      className={`education-card edu-card--animate${visible ? " edu-card--visible" : ""}`}
      style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
    >
      <h3>{item.institution}</h3>
      <p className="education-degree">{item.degree}</p>
      <p className="education-detail">{detailText}</p>
    </article>
  );
}

function Education() {
  return (
    <section className="section section--soft" id="education">
      <div className="section-heading">
        <span className="section-label">Education</span>
        <h2>Academic record with strong performance and technical focus</h2>
      </div>

      <div className="education-list">
        {education.map((item, index) => (
          <EduCard key={item.institution} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Education;
