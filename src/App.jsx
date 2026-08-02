import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Highlights from "./components/Highlights";
import Skills from "./components/Skills";
import ProjectsSection from "./components/ProjectsSection";
import Experience from "./components/Experience";
import Certificates from "./components/Certificates";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const delay = Number(target.dataset.revealDelay || 0);

            setActiveSection(target.id);

            window.setTimeout(() => {
              target.classList.add("is-visible");
            }, delay);

            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section, index) => {
      // Each section gets its unique reveal personality
      if (section.id === "about") {
        section.classList.add("reveal-slide-left");
      } else if (section.id === "contact") {
        section.classList.add("reveal-scale");
      } else {
        section.classList.add("reveal");
      }
      section.dataset.revealDelay = `${index * 60}`;
      observer.observe(section);
    });

    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    document.title = "Janardhan P | Software Engineer";

    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Highlights />
        <Skills />
        <ProjectsSection />
        <Experience />
        <Certificates />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
