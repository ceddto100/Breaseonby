import { Link } from 'react-router-dom';

export default function VideoCard({ video, large = false }) {
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views?.toString() || '0';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/biography/${video._id}`} className="group block">
      <div
        className={`bg-dark-card border border-dark-border rounded-lg overflow-hidden neon-hover ${
          large ? '' : ''
        }`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnailUrl || '/placeholder-thumb.jpg'}
            alt={video.subjectName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2 py-1 bg-dark/80 border border-dark-border text-neon font-mono text-xs uppercase tracking-wider">
            {video.category}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className={`font-bebas tracking-wider text-gold ${
              large ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {video.subjectName}
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {video.title}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-mono">
            <span>{formatViews(video.views)} views</span>
            <span>&bull;</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
