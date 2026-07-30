const highlights = [
  {
    title: "Full Stack Java Strength",
    description:
      "Built reliable web applications using Java, Spring Boot, React, MySQL, and REST APIs with strong engineering habits.",
  },
  {
    title: "Problem Solver",
    description:
      "Solved 160+ LeetCode problems to sharpen algorithmic thinking and data structures skills for real engineering work.",
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

function Highlights() {
  return (
    <section className="section section--soft" id="highlights">
      <div className="section-heading">
        <span className="section-label">Profile Highlights</span>
        <h2>Achievements and strengths that recruiters notice</h2>
      </div>

      <div className="highlight-grid">
        {highlights.map((item) => (
          <article className="highlight-card" key={item.title}>
            <p className="highlight-card__title">{item.title}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
