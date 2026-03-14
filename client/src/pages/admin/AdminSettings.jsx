import { useState, useEffect } from 'react';
import { getSettings, updateSettings, getVideos } from '../../api';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, videosRes] = await Promise.all([
          getSettings(),
          getVideos({ limit: 100 }),
        ]);
        setSettings(settingsRes.data);
        setVideos(videosRes.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const { data } = await updateSettings(settings);
      setSettings(data);
      setMessage('Settings saved successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!settings) return <p className="text-gray-500 font-mono">Failed to load settings.</p>;

  return (
    <div>
      <h1 className="font-bebas text-3xl tracking-wider text-off-white mb-2">SETTINGS</h1>
      <div className="w-16 h-1 bg-neon mb-8" />

      {message && (
        <div className="mb-6 p-3 bg-neon/10 border border-neon/30 text-neon text-sm font-mono">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Site settings */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="font-bebas text-xl tracking-wider text-off-white mb-4">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.siteTagline || ''}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                Merch Store URL
              </label>
              <input
                type="text"
                value={settings.merchStoreUrl || ''}
                onChange={(e) => setSettings({ ...settings, merchStoreUrl: e.target.value })}
                placeholder="https://your-merch-store.com"
                className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                Featured Video Override
              </label>
              <select
                value={settings.featuredVideoOverride || ''}
                onChange={(e) => setSettings({ ...settings, featuredVideoOverride: e.target.value || null })}
                className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
              >
                <option value="">None (use featured flag)</option>
                {videos.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.subjectName} — {v.title}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode || false}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-neon"
              />
              <span className="font-mono text-sm text-gray-400 uppercase tracking-wider">
                Maintenance Mode
              </span>
            </label>
          </div>
        </div>

        {/* Ad settings */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="font-bebas text-xl tracking-wider text-off-white mb-4">Ad Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                AdSense Publisher ID
              </label>
              <input
                type="text"
                value={settings.adsensePublisherId || ''}
                onChange={(e) => setSettings({ ...settings, adsensePublisherId: e.target.value })}
                placeholder="ca-pub-XXXXXXXXXX"
                className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Leaderboard Slot
                </label>
                <input
                  type="text"
                  value={settings.adSlotLeaderboard || ''}
                  onChange={(e) => setSettings({ ...settings, adSlotLeaderboard: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Rectangle Slot
                </label>
                <input
                  type="text"
                  value={settings.adSlotRectangle || ''}
                  onChange={(e) => setSettings({ ...settings, adSlotRectangle: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Skyscraper Slot
                </label>
                <input
                  type="text"
                  value={settings.adSlotSkyscraper || ''}
                  onChange={(e) => setSettings({ ...settings, adSlotSkyscraper: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin management info */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="font-bebas text-xl tracking-wider text-off-white mb-4">Admin Management</h2>
          <p className="font-mono text-sm text-gray-400 mb-4">
            Admin access is controlled via the <span className="text-neon">APPROVED_ADMIN_EMAILS</span> environment variable.
          </p>
          <p className="font-mono text-xs text-gray-500">
            To add or remove admins, update APPROVED_ADMIN_EMAILS in your Render environment variables and redeploy.
          </p>
        </div>

        <button type="submit" disabled={saving} className="btn-neon px-8 py-3 disabled:opacity-50">
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </form>
    </div>
  );
}
