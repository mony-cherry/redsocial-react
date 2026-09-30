import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="page-card empty-page">
      <span className="page-icon">?</span>
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe en RedSocial.</p>
      <Link className="primary-button link-button" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
