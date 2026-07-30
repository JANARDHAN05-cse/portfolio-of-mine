import SkillCard from "./SkillCard";

function Skills() {
  return (
    <section className="section section--soft" id="skills">
      <div className="section-heading">
        <span className="section-label">Skills</span>
        <h2>Technical expertise across software, data, and core CS fundamentals</h2>
      </div>

      <div className="skills-grid">
        <SkillCard
          title="Programming Languages"
          skills={["Java", "Python", "C", "C++", "JavaScript", "SQL"]}
        />

        <SkillCard
          title="Full Stack"
          skills={["Spring Boot", "React", "REST APIs", "HTML", "CSS", "MySQL"]}
        />

        <SkillCard
          title="Data Science"
          skills={["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "PyTorch", "Jupyter Notebook"]}
        />

        <SkillCard
          title="Core CS"
          skills={["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Problem Solving"]}
        />

        <SkillCard
          title="Tools"
          skills={["Git", "GitHub", "VS Code", "IntelliJ IDEA", "PyCharm", "Windows"]}
        />
      </div>
    </section>
  );
}

export default Skills;
