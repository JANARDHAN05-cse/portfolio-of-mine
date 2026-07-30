function Contact() {
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

  return (
    <section className="section" id="contact">
      <div className="section-heading">
        <span className="section-label">Contact</span>
        <h2>Let's connect on the next project or internship.</h2>
      </div>

      <div className="contact-grid">
        {contacts.map((item) => (
          <a
            key={item.label}
            className="contact-card"
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-card__label">{item.label}</span>
            <p>{item.value}</p>
          </a>
        ))}
      </div>

      <p className="contact-note">
        Ready for internships, software development roles, and collaborative engineering opportunities.
      </p>
    </section>
  );
}

export default Contact;
