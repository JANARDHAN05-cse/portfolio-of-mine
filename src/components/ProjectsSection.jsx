import { useEffect, useRef, useState } from "react";
import ProjectCase from "./ProjectCase";

const projects = [
  {
    title: "Student Registration System",
    roles: "Java • Spring Boot • React • MySQL",
    summary:
      "Built a polished full-stack student records platform with secure CRUD workflows, clean forms, and data validation for academic administration.",
    highlights: [
      "Database-backed student record management with responsive UI",
      "REST APIs for create, update, and query workflows",
      "Focus on usability, data integrity, and real-world application flow",
    ],
  },
  {
    title: "Employee Management System",
    roles: "Java • Spring Boot • MySQL",
    summary:
      "Delivered an internal-facing employee system for role management, reporting, and data-driven operational workflows.",
    highlights: [
      "Role-based employee data tracking and status management",
      "Clean interface with productivity-focused interactions",
      "Designed for maintainable backend operations and future growth",
    ],
  },
  {
    title: "Face Detection System",
    roles: "Python • OpenCV",
    summary:
      "Built a real-time face detection solution that identifies faces from a live video feed and highlights them with reliable accuracy.",
    highlights: [
      "OpenCV-based image processing with live visual feedback",
      "Real-time detection loop and performance-aware implementation",
      "Focused on practical machine learning readiness and demo quality",
    ],
  },
];

function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="section section--soft" id="projects" ref={sectionRef}>
      <div className="section-heading">
        <span className="section-label">Projects</span>
        <h2>Three projects that showcase my practical engineering skills</h2>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`project-card-wrapper ${isVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <ProjectCase {...project} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;
