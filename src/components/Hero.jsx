import heroPhoto from "../assets/linkedin_profile.png";

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <span className="eyebrow">Software engineering portfolio</span>
        <h1>Hi, I’m JANARDHAN P.</h1>
        <p className="hero-intro">
          I am a pre-final year B.E. Computer Science Engineering student at Saveetha Engineering College, building dependable software with Java, Spring Boot, React, MySQL, and Python.
        </p>

        <div className="hero-actions">
          <a href="#contact" className="button button--primary">
            Contact me
          </a>
          <a href="#projects" className="button button--secondary">
            View case studies
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label="Portrait preview">
        <div className="hero-visual__frame">
          <img src={heroPhoto} alt="Janardhan P" className="hero-photo" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
