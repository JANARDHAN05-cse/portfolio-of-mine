import CertificateCard from "./CertificateCard";

function Certificates() {
  return (
    <section className="section">
      <h1>Certificates</h1>

      <div className="certificate-container">
        <CertificateCard
          title="Oracle Java SE 21"
          issuer="Oracle"
          year="2025"
        />

        <CertificateCard
          title="DCA Course"
          issuer="NEON Computer Education"
          year="2023"
        />

        <CertificateCard
          title="Azure Cloud Computing"
          issuer="Microsoft"
          year="2025"
        />
      </div>
    </section>
  );
}

export default Certificates;