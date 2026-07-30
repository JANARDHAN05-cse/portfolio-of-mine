function SkillCard({ title, skills }) {
  return (
    <article className="skill-card">
      <h3>{title}</h3>
      <div className="skill-tags">
        {skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

export default SkillCard;
