import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import VideoCard from '../components/VideoCard';
import AdUnit from '../components/AdUnit';
import { getVideo, getVideos } from '../api';


const ensurePlayableVideoUrl = (url = '') => {
  if (!url) return '';

  const [base, query = ''] = url.split('?');
  const [pathWithoutHash, hash = ''] = base.split('#');

  if (/\.[a-z0-9]{3,4}$/i.test(pathWithoutHash)) {
    return url;
  }

  const rebuilt = `${pathWithoutHash}.mp4${hash ? `#${hash}` : ''}`;
  return query ? `${rebuilt}?${query}` : rebuilt;
};

export default function Biography() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const { data } = await getVideo(id);
        setVideo(data);

        // Fetch related videos (same category)
        const { data: relatedData } = await getVideos({
          category: data.category,
          limit: 5,
        });
        setRelated(
          (relatedData.videos || []).filter((v) => v._id !== id).slice(0, 4)
        );
      } catch (err) {
        console.error('Failed to load video:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = video
    ? `${video.subjectName} — UNCOVERED`
    : 'UNCOVERED';

  if (loading) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="pt-24 text-center min-h-screen">
        <h1 className="font-bebas text-4xl text-off-white mt-20">VIDEO NOT FOUND</h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{video.subjectName} — UNCOVERED</title>
        <meta name="description" content={video.description || video.title} />
        <meta property="og:title" content={`${video.subjectName} — UNCOVERED`} />
        <meta property="og:description" content={video.description || video.title} />
        {video.thumbnailUrl && <meta property="og:image" content={video.thumbnailUrl} />}
      </Helmet>

      <div className="pt-20">
        {/* AD: Leaderboard above player */}
        <AdUnit size="leaderboard" />

        {/* Video player + sidebar layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Main content */}
            <div>
              {/* Video player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-dark-border">
                <video
                  src={ensurePlayableVideoUrl(video.cloudinaryUrl)}
                  poster={video.thumbnailUrl}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  playsInline
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>

              {/* Video info */}
              <div className="mt-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-neon uppercase tracking-widest px-2 py-1 border border-neon/30">
                        {video.category}
                      </span>
                      <span className="font-mono text-xs text-neon-red uppercase tracking-widest px-2 py-1 border border-neon-red/30">
                        UNCOVERED
                      </span>
                    </div>
                    <h1 className="font-bebas text-gold text-4xl md:text-6xl tracking-wider">
                      {video.subjectName}
                    </h1>
                    <p className="text-gray-300 text-lg mt-1">{video.title}</p>
                  </div>
                  <div className="font-mono text-xs text-gray-500">
                    {video.views?.toLocaleString()} views
                  </div>
                </div>

                {/* Tags */}
                {video.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs text-gray-500 bg-dark-card border border-dark-border px-3 py-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {video.description && (
                  <div className="mt-6 p-6 bg-dark-card border border-dark-border rounded-lg">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {video.description}
                    </p>
                  </div>
                )}

                {/* AD: Rectangle below player */}
                <AdUnit size="rectangle" />

                {/* Social share bar */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-dark-border text-gray-400 hover:text-gold hover:border-gold hover:shadow-gold transition-all font-mono text-xs uppercase"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-dark-border text-gray-400 hover:text-neon hover:border-neon hover:shadow-neon transition-all font-mono text-xs uppercase"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Share
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 border border-dark-border text-gray-400 hover:text-neon-red hover:border-neon-red hover:shadow-neon-red transition-all font-mono text-xs uppercase"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* MORE STORIES */}
              {related.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-bebas text-3xl tracking-wider text-off-white mb-6">
                    MORE STORIES
                  </h2>
                  <div className="w-20 h-1 bg-neon-red mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {related.map((v) => (
                      <VideoCard key={v._id} video={v} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — desktop only */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AdUnit size="skyscraper" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
