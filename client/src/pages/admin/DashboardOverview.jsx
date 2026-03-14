import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-500 font-mono">Failed to load dashboard data.</p>;
  }

  const topVideosChart = (stats.topVideos || []).map((v) => ({
    name: v.subjectName?.length > 12 ? v.subjectName.slice(0, 12) + '...' : v.subjectName,
    views: v.views || 0,
  }));

  return (
    <div>
      <h1 className="font-bebas text-3xl tracking-wider text-off-white mb-2">DASHBOARD</h1>
      <div className="w-16 h-1 bg-neon mb-8" />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Videos" value={stats.totalVideos} color="text-neon" />
        <StatCard label="Total Views" value={stats.totalViews?.toLocaleString()} color="text-gold" />
        <StatCard label="Total Subscribers" value={stats.totalSubscribers} color="text-neon-red" />
        <StatCard
          label="Featured Video"
          value={stats.featuredVideo || '—'}
          color="text-off-white"
          small
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {topVideosChart.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">
              Top 5 Most Viewed
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVideosChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #1a1a1a' }}
                  labelStyle={{ color: '#F0F0F0' }}
                />
                <Bar dataKey="views" fill="#39FF14" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent videos as a simple line-like display */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">
            Views Distribution
          </h3>
          {topVideosChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={topVideosChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #1a1a1a' }}
                  labelStyle={{ color: '#F0F0F0' }}
                />
                <Line type="monotone" dataKey="views" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 font-mono text-sm py-20 text-center">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent videos */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">
            Recent Uploads
          </h3>
          {(stats.recentVideos || []).length > 0 ? (
            <div className="space-y-3">
              {stats.recentVideos.map((v) => (
                <div key={v._id} className="flex justify-between items-center py-2 border-b border-dark-border/50">
                  <div>
                    <p className="font-mono text-sm text-off-white">{v.title}</p>
                    <p className="font-mono text-xs text-gray-500">
                      {v.views} views &middot; {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {v.featured && <span className="font-mono text-xs text-gold">FEATURED</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-sm">No videos yet</p>
          )}
        </div>

        {/* Recent subscribers */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">
            Recent Subscribers
          </h3>
          {(stats.recentSubscribers || []).length > 0 ? (
            <div className="space-y-3">
              {stats.recentSubscribers.map((s) => (
                <div key={s._id} className="flex items-center gap-3 py-2 border-b border-dark-border/50">
                  {s.avatar ? (
                    <img src={s.avatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center">
                      <span className="font-mono text-xs text-gray-500">
                        {s.displayName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-off-white truncate">{s.email}</p>
                    <p className="font-mono text-xs text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-sm">No subscribers yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, small }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`font-bebas ${small ? 'text-xl' : 'text-4xl'} ${color} mt-2 truncate`}>
        {value}
      </p>
    </div>
  );
}
