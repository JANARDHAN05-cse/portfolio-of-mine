import { useEffect, useRef, useState } from "react";

function Contact() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const contacts = [
    {
      label: "Email",
      value: "janardhan2028sec@gmail.com",
      href: "mailto:janardhan2028sec@gmail.com",
    },
    {
      label: "Phone",
      value: "9677004689",
      href: "tel:9677004689",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/janardhan5",
      href: "https://www.linkedin.com/in/janardhan5/",
    },
  ];

  useEffect(() => {
    const node = sectionRef.current;
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

  return (
    <section className="section" id="contact" ref={sectionRef}>
      <div className="section-heading">
        <span className="section-label">Contact</span>
        <h2>Let's connect on the next project or internship.</h2>
      </div>

      <div className="contact-grid">
        {contacts.map((item, index) => (
          <a
            key={item.label}
            className={`contact-card contact-card--animate${visible ? " contact-card--visible" : ""}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
          >
            <span className="contact-card__label">{item.label}</span>
            <p>{item.value}</p>
          </a>
        ))}
      </div>

      <p className="contact-note">
        Ready for internships, software development roles, and collaborative
        engineering opportunities.
      </p>
    </section>
  );
}

export default Contact;
