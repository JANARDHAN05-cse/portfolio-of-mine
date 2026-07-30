function CertificateCard({ title, issuer, year }) {
  return (
    <article className="certificate-card">
      <h2>{title}</h2>
      <p>{issuer}</p>
      <span>{year}</span>
    </article>
  );
}

export default CertificateCard;
