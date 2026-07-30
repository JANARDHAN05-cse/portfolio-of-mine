function Experience() {
  return (
    <section className="section" id="experience">
      <div className="section-heading">
        <span className="section-label">Experience</span>
        <h2>Industry exposure through practical software delivery</h2>
      </div>

      <div className="experience-grid">
        <article className="experience-card">
          <div className="experience-card__header">
            <p className="eyebrow">Software Development Intern</p>
            <h3>Retech Solution Pvt. Ltd.</h3>
            <p className="muted">Java application development | Debugging | Backend implementation</p>
          </div>

          <ul className="experience-list">
            <li>Supported full-stack delivery by contributing to Java-based software development workflows.</li>
            <li>Implemented backend functionality, fixed bugs, and improved reliability across modules.</li>
            <li>Collaborated with the team to translate requirements into clean, testable code.</li>
            <li>Gained experience in project handoffs, version control, and production-focused delivery.</li>
          </ul>
        </article>

        <aside className="experience-summary">
          <div className="summary-panel">
            <span className="summary-label">What I brought</span>
            <p>Fast learning, clear communication, and a practical focus on building real software systems with Java.</p>
          </div>
          <div className="summary-panel">
            <span className="summary-label">Why it matters</span>
            <p>Strong internship experience makes me ready for new engineering challenges and collaborative product teams.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Experience;
