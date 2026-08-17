import { useEffect, useRef, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";

const highlights = [
  {
    title: "Full Stack Java Strength",
    description:
      "Built reliable web applications using Java, Spring Boot, React, MySQL, and REST APIs with strong engineering habits.",
  },
  {
    title: "Problem Solver",
    description:
      "Solved {count}+ LeetCode problems to sharpen algorithmic thinking and data structures skills for real engineering work.",
    countTarget: 230,
  },
  {
    title: "Hackathon Winner",
    description:
      "Winner of Hack Hustle 2.0 in the Logistics domain, creating practical solutions under pressure and teamwork.",
  },
  {
    title: "Internship Experience",
    description:
      "Contributed to Java application development, backend implementation, and debugging workflows at Retech Solution Pvt. Ltd.",
  },
  {
    title: "Data Science Focus",
    description:
      "Learning data analysis, machine learning, and Python tools to combine software development with analytics insight.",
  },
  {
    title: "Professional Growth",
    description:
      "Focused on thoughtful, maintainable engineering with clarity, craft, and polished problem-solving delivery.",
  },
];

function HighlightCard({ item, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const { ref: countRef, value: countVal } = useCountUp({
    end: item.countTarget ?? 0,
    duration: 1300,
    decimals: 0,
    suffix: "+",
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
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  let description;
  if (item.countTarget) {
    const parts = item.description.split("{count}+");
    description = (
      <>
        {parts[0]}
        <strong ref={countRef} className="count-highlight">
          {countVal}
        </strong>
        {parts[1]}
      </>
    );
  } else {
    description = item.description;
  }

  return (
    <article
      ref={cardRef}
      className={`highlight-card hcard--animate${visible ? " hcard--visible" : ""}`}
      style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
    >
      <p className="highlight-card__title">{item.title}</p>
      <p>{description}</p>
    </article>
  );
}

function Highlights() {
  return (
    <section className="section section--soft" id="highlights">
      <div className="section-heading">
        <span className="section-label">Profile Highlights</span>
        <h2>Achievements and strengths that recruiters notice</h2>
      </div>

      <div className="highlight-grid">
        {highlights.map((item, index) => (
          <HighlightCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Highlights;
