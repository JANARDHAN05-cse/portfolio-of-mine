function About() {
  return (
    <section className="section" id="about">
      <div className="section-heading">
        <span className="section-label">About me</span>
        <h2>Building thoughtful software with a strong engineering foundation</h2>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p>
            As a pre-final year B.E. Computer Science Engineering student at Saveetha Engineering College, I have built a strong foundation in software engineering through hands-on development, problem-solving, and continuous learning.
          </p>
          <p>
            With experience in Full Stack Java development using Java, Spring Boot, React, MySQL, and REST APIs, I enjoy transforming ideas into practical software solutions. I have strengthened my analytical thinking by solving 160+ LeetCode problems, won Hack Hustle 2.0 in the Logistics domain, and gained industry exposure through a Software Development Internship at Retech Solution Pvt. Ltd.
          </p>
          <p>
            Currently, I am learning Data Science from the fundamentals while improving my DSA skills, with a growing interest in Python, Data Analysis, and Machine Learning.
          </p>
        </div>

        <aside className="about-panel">
          <div className="about-highlight">
            <p className="eyebrow">Profile snapshot</p>
            <ul>
              <li>Full Stack Java Development</li>
              <li>Data Science & Machine Learning foundations</li>
              <li>Strong analytical and quantitative aptitude</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default About;
