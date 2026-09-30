import { useState } from 'react';

const products = [
  {
    name: 'Laptop para desarrollo',
    price: '$2.400.000',
    icon: '💻',
    description:
      'Laptop ideal para programación, desarrollo web y trabajo con herramientas de software.',
  },
  {
    name: 'Monitor profesional',
    price: '$980.000',
    icon: '🖥️',
    description:
      'Monitor de alta resolución ideal para programación, diseño y trabajo profesional.',
  },
  {
    name: 'Teclado mecánico',
    price: '$320.000',
    icon: '⌨️',
    description:
      'Teclado mecánico diseñado para ofrecer comodidad y precisión durante largas jornadas.',
  },
  {
    name: 'Audífonos inalámbricos',
    price: '$280.000',
    icon: '🎧',
    description:
      'Audífonos inalámbricos para disfrutar música, llamadas y reuniones sin cables.',
  },
];

export function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="page-icon">M</span>
        <div>
          <h1>Marketplace</h1>
          <p>Compra y vende productos dentro de RedSocial.</p>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-image" aria-hidden="true">{product.icon}</div>
            <h2>{product.name}</h2>
            <strong>{product.price}</strong>
            <button
              type="button"
              className="primary-button"
              onClick={() => setSelectedProduct(product)}
            >
              Ver producto
            </button>
          </article>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={handleClose} role="presentation">
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="modal-product-icon">{selectedProduct.icon}</div>
            <h2>{selectedProduct.name}</h2>
            <strong>{selectedProduct.price}</strong>
            <p>{selectedProduct.description}</p>

            <button
              type="button"
              className="primary-button modal-button"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
