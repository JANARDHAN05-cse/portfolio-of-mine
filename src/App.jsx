import { useEffect, useState, useCallback } from "react";
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
import GraduationHatRope from "./components/GraduationHatRope";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  // Sequential pull handler: smoothly scrolls section by section, and loops back to Home after reach end
  const handleRopePull = useCallback(() => {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if (!sections.length) return;

    let currentIndex = 0;
    let minDistance = Infinity;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const dist = Math.abs(rect.top - 80);
      if (dist < minDistance) {
        minDistance = dist;
        currentIndex = index;
      }
    });

    const nextIndex = (currentIndex + 1) % sections.length;
    const nextSection = sections[nextIndex];
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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
      {/* 3D Graduation Hat & Rope rendered at root app-shell level so it stays static, above header, and persistent across all sections */}
      <GraduationHatRope onPull={handleRopePull} />
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
