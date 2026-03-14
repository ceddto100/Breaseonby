import { Helmet } from 'react-helmet-async';

const PRODUCTS = [
  {
    name: 'Classic Logo Tee',
    price: '$34.99',
    image: null,
    description: 'Premium cotton tee with the UNCOVERED wordmark',
  },
  {
    name: 'Uncovered Hoodie',
    price: '$64.99',
    image: null,
    description: 'Heavyweight hoodie with embroidered logo',
  },
  {
    name: 'Snapback Hat',
    price: '$29.99',
    image: null,
    description: 'Structured snapback with neon green accent',
  },
  {
    name: 'Poster Print',
    price: '$19.99',
    image: null,
    description: 'Limited edition 18x24 art print',
  },
];

export default function Merch() {
  const merchUrl = import.meta.env.VITE_MERCH_URL || '#';

  return (
    <>
      <Helmet>
        <title>Merch — UNCOVERED</title>
        <meta name="description" content="Shop official UNCOVERED merch. Wear the story." />
      </Helmet>

      {/* Hero */}
      <section className="pt-24 pb-16 grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <h1 className="font-bebas text-gold text-7xl md:text-9xl tracking-wider">
            UNCOVERED MERCH
          </h1>
          <p className="text-gray-400 text-xl tracking-wider mt-4 font-inter">
            Wear the story
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-dark-card border border-dark-border rounded-lg overflow-hidden neon-hover group"
            >
              {/* Placeholder image */}
              <div className="aspect-square bg-gradient-to-br from-dark-card to-dark flex items-center justify-center">
                <div className="text-center">
                  <span className="font-bebas text-gold/20 text-6xl tracking-wider">
                    UNCOVERED
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bebas text-2xl tracking-wider text-off-white">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bebas text-neon text-2xl">
                    {product.price}
                  </span>
                  <a
                    href={merchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon text-sm px-6 py-2"
                  >
                    SHOP NOW
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16">
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 md:p-16 text-center grain-overlay">
          <div className="relative z-10">
            <h2 className="font-bebas text-4xl md:text-6xl tracking-wider text-off-white">
              NEW DROPS COMING SOON
            </h2>
            <p className="font-bebas text-2xl tracking-wider text-neon mt-2">
              FOLLOW US
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <a
                href="https://www.youtube.com/@BreaseonbyUncovered"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-dark-border flex items-center justify-center text-gray-400 hover:text-neon hover:border-neon hover:shadow-neon transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/breaseonbyuncovered/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-dark-border flex items-center justify-center text-gray-400 hover:text-neon-red hover:border-neon-red hover:shadow-neon-red transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-dark-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold hover:shadow-gold transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
