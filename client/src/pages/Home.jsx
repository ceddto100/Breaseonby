import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import VideoCard from '../components/VideoCard';
import AdUnit from '../components/AdUnit';
import { getFeaturedVideos, getVideos, getPopularVideos } from '../api';

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes, popularRes] = await Promise.all([
          getFeaturedVideos(),
          getVideos({ sort: 'newest', limit: 3 }),
          getPopularVideos(),
        ]);
        setFeatured(featuredRes.data[0] || null);
        setLatest(latestRes.data.videos || []);
        setPopular(popularRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    fetchData();
  }, []);

  const merchUrl = import.meta.env.VITE_MERCH_URL || '#';

  return (
    <>
      <Helmet>
        <title>UNCOVERED — Every Life Has a Story. We Find It.</title>
        <meta
          name="description"
          content="UNCOVERED is a premium biography video platform by Brease On By. Explore in-depth stories of musicians, athletes, hustlers, icons, and politicians."
        />
        <meta property="og:title" content="UNCOVERED — Every Life Has a Story" />
        <meta property="og:description" content="Premium biography documentaries by Brease On By Uncovered." />
      </Helmet>

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden grain-overlay">
        {/* Background video */}
        {featured?.cloudinaryUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src={featured.cloudinaryUrl} type="video/mp4" />
          </video>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-bebas text-gold text-7xl md:text-9xl tracking-[0.2em] mb-4">
            UNCOVERED
          </h1>
          <p className="text-gray-400 text-lg md:text-xl tracking-wider mb-8 font-inter">
            Every life has a story. We find it.
          </p>

          {featured && (
            <div className="mb-8">
              <p className="font-mono text-neon text-sm uppercase tracking-widest mb-2">
                Now Featuring
              </p>
              <h2 className="font-bebas text-gold text-4xl md:text-6xl tracking-wider">
                {featured.subjectName}
              </h2>
              <p className="text-gray-300 text-lg mt-2">{featured.title}</p>
            </div>
          )}

          <Link
            to={featured ? `/biography/${featured._id}` : '/biographies'}
            className="inline-block btn-neon text-xl px-10 py-4"
          >
            WATCH NOW
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* AD: Leaderboard below hero */}
      <AdUnit size="leaderboard" />

      {/* LATEST DROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-bebas text-4xl md:text-5xl tracking-wider text-off-white">
            LATEST DROPS
          </h2>
          <div className="w-24 h-1 bg-neon mt-2" />
        </div>

        {latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latest.map((video) => (
              <VideoCard key={video._id} video={video} large />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 font-mono">No videos yet. Stay tuned.</p>
        )}
      </section>

      {/* AD: Rectangle between sections */}
      <AdUnit size="rectangle" />

      {/* MOST WATCHED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-bebas text-4xl md:text-5xl tracking-wider text-off-white">
            MOST WATCHED
          </h2>
          <div className="w-24 h-1 bg-neon-red mt-2" />
        </div>

        {popular.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {popular.map((video) => (
              <div key={video._id} className="min-w-[280px] md:min-w-[320px] flex-shrink-0">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 font-mono">Coming soon.</p>
        )}
      </section>

      {/* MERCH BANNER */}
      <section className="mx-4 sm:mx-6 lg:mx-8 my-16">
        <div className="bg-neon rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-bebas text-dark text-4xl md:text-5xl tracking-wider">
              REP THE BRAND
            </h2>
            <p className="font-bebas text-dark/70 text-2xl tracking-wider">
              SHOP UNCOVERED MERCH
            </p>
          </div>
          <a
            href={merchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-dark text-neon font-bebas text-xl tracking-wider px-8 py-4 hover:shadow-neon transition-shadow"
          >
            SHOP NOW
          </a>
        </div>
      </section>

      {/* AD: Leaderboard above footer */}
      <AdUnit size="leaderboard" />
    </>
  );
}
