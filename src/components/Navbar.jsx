function Navbar({ activeSection }) {
  const links = [
    { id: "about", label: "About" },
    { id: "highlights", label: "Highlights" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark">J</span>
        <div>
          <p className="brand-name">JANARDHAN P</p>
          <span className="brand-subtitle">Software Engineering Portfolio</span>
        </div>
      </div>

      <nav className="site-nav">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={activeSection === link.id ? "is-active" : ""}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
