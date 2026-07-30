function ProjectCase({ title, roles, summary, highlights }) {
  return (
    <article className="project-case">
      <div className="project-case__header">
        <span className="project-case__tag">Case Study</span>
        <h3>{title}</h3>
        <p className="muted">{roles}</p>
      </div>

      <p>{summary}</p>

      <ul className="project-highlights">
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export default ProjectCase;
