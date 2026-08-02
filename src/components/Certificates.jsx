import CertificateCard from "./CertificateCard";

const certs = [
  { title: "Oracle Java SE 21", issuer: "Oracle", year: "2025" },
  { title: "DCA Course", issuer: "NEON Computer Education", year: "2023" },
  { title: "Azure Cloud Computing", issuer: "Microsoft", year: "2025" },
];

function Certificates() {
  return (
    <section className="section section--soft" id="certificates">
      <div className="section-heading">
        <span className="section-label">Certificates</span>
        <h2>Credentials that validate my technical depth</h2>
      </div>

      <div className="certificate-container">
        {certs.map((cert, index) => (
          <CertificateCard
            key={cert.title}
            {...cert}
            revealDelay={index * 110}
          />
        ))}
      </div>
    </section>
  );
}

export default Certificates;