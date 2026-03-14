import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import VideoCard from '../components/VideoCard';
import AdUnit from '../components/AdUnit';
import { getVideos } from '../api';

const CATEGORIES = ['All', 'Musicians', 'Athletes', 'Hustlers', 'Icons', 'Politicians'];

export default function Biographies() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category !== 'All') params.category = category;
        if (sort === 'views') params.sort = 'views';
        if (search) params.search = search;

        const { data } = await getVideos(params);
        setVideos(data.videos || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [category, sort, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>All Biographies — UNCOVERED</title>
        <meta name="description" content="Browse our full library of biography documentaries. Filter by musicians, athletes, hustlers, icons, and politicians." />
      </Helmet>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-bebas text-6xl md:text-8xl tracking-wider text-off-white">
            ALL BIOGRAPHIES
          </h1>
          <div className="w-32 h-1 bg-neon mt-3" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 items-start lg:items-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all ${
                  category === cat
                    ? 'bg-neon text-dark border-neon'
                    : 'bg-transparent text-gray-400 border-dark-border hover:border-neon hover:text-neon'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3 lg:ml-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-dark border border-dark-border text-off-white px-4 py-2 font-mono text-xs uppercase focus:outline-none focus:border-neon"
            >
              <option value="newest">Newest</option>
              <option value="views">Most Viewed</option>
            </select>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-dark border border-dark-border text-off-white px-4 py-2 font-mono text-xs placeholder-gray-600 focus:outline-none focus:border-neon w-40 md:w-56"
              />
            </form>
          </div>
        </div>

        {/* Video grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={video._id}>
                <VideoCard video={video} />
                {/* Ad after every 8 videos */}
                {(index + 1) % 8 === 0 && index < videos.length - 1 && (
                  <div className="col-span-full">
                    <AdUnit size="rectangle" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-mono text-lg">No biographies found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-mono text-sm px-4 py-2 border border-dark-border text-gray-400 hover:border-neon hover:text-neon disabled:opacity-30 disabled:hover:border-dark-border disabled:hover:text-gray-400 transition-all"
            >
              PREV
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`font-mono text-sm w-10 h-10 border transition-all ${
                  page === p
                    ? 'bg-neon text-dark border-neon'
                    : 'border-dark-border text-gray-400 hover:border-neon hover:text-neon'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-mono text-sm px-4 py-2 border border-dark-border text-gray-400 hover:border-neon hover:text-neon disabled:opacity-30 disabled:hover:border-dark-border disabled:hover:text-gray-400 transition-all"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </>
  );
}
