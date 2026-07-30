const education = [
  {
    institution: "Saveetha Engineering College",
    degree: "B.E. Computer Science Engineering",
    detail: "CGPA 9.38 | 2024 - Present",
  },
  {
    institution: "Chennai Higher Secondary School",
    degree: "Higher Secondary Education (12th)",
    detail: "92.67% | 2024",
  },
  {
    institution: "St. Francis Savio Matriculation School",
    degree: "Secondary Education (10th)",
    detail: "84.8% | 2022",
  },
];

function Education() {
  return (
    <section className="section section--soft" id="education">
      <div className="section-heading">
        <span className="section-label">Education</span>
        <h2>Academic record with strong performance and technical focus</h2>
      </div>

      <div className="education-list">
        {education.map((item) => (
          <article className="education-card" key={item.institution}>
            <h3>{item.institution}</h3>
            <p className="education-degree">{item.degree}</p>
            <p className="education-detail">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Education;
