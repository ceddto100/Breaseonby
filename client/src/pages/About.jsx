import { Helmet } from 'react-helmet-async';
import SubscribeBar from '../components/SubscribeBar';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — UNCOVERED</title>
        <meta name="description" content="The story behind the stories. Learn about UNCOVERED and the Brease On By channel." />
      </Helmet>

      {/* Hero */}
      <section className="pt-24 grain-overlay">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <h1 className="font-bebas text-6xl md:text-8xl tracking-wider text-off-white">
            THE STORY BEHIND THE STORIES
          </h1>
          <div className="w-24 h-1 bg-neon mx-auto mt-6" />
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <p>
            UNCOVERED is more than a YouTube channel — it&apos;s a movement dedicated to
            telling the stories that shaped culture, challenged norms, and defined
            generations.
          </p>
          <p>
            From the rise of legendary musicians to the hustle of street-level
            entrepreneurs, from political powerhouses to cultural icons — we dig
            deep into the lives that matter. No fluff. No filler. Just raw,
            unfiltered biography content that hits different.
          </p>
          <p>
            Every biography on this platform has been researched, scripted, and
            produced with the same energy and attention to detail. We believe every
            life has a story worth telling — and we&apos;re here to find it.
          </p>
        </div>
      </section>

      {/* Creator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Placeholder avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-neon/20 to-neon-red/20 border-2 border-dark-border flex items-center justify-center flex-shrink-0">
            <span className="font-bebas text-gold text-4xl">BOB</span>
          </div>
          <div>
            <h2 className="font-bebas text-3xl tracking-wider text-gold">
              BREASE ON BY
            </h2>
            <p className="font-mono text-xs text-neon uppercase tracking-widest mt-1">
              Creator & Producer
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              The mind behind UNCOVERED. With a passion for storytelling and a
              relentless drive to uncover the truth behind the headlines, Brease On
              By has built a platform that brings biography content to a whole new
              level. What started as a YouTube channel has grown into a full
              documentary network.
            </p>
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-bebas text-3xl tracking-wider text-off-white mb-8">
          FIND US ON
        </h2>
        <div className="flex justify-center gap-6">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dark-border flex items-center justify-center text-gray-400 group-hover:text-neon group-hover:border-neon group-hover:shadow-neon transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <span className="font-mono text-xs text-gray-500 uppercase">YouTube</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dark-border flex items-center justify-center text-gray-400 group-hover:text-neon-red group-hover:border-neon-red group-hover:shadow-neon-red transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </div>
            <span className="font-mono text-xs text-gray-500 uppercase">Instagram</span>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dark-border flex items-center justify-center text-gray-400 group-hover:text-gold group-hover:border-gold group-hover:shadow-gold transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="font-mono text-xs text-gray-500 uppercase">Twitter/X</span>
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h3 className="font-bebas text-2xl tracking-wider text-off-white mb-2">
            BOOKINGS & CONTACT
          </h3>
          <a
            href="mailto:contact@breaseonby.com"
            className="font-mono text-neon hover:text-gold transition-colors"
          >
            contact@breaseonby.com
          </a>
        </div>
      </section>

      <SubscribeBar />
    </>
  );
}
