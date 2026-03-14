import { useState, useEffect } from 'react';
import { getSubscribers, removeSubscriber, exportSubscribers } from '../../api';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove subscriber ${name}?`)) return;
    try {
      await removeSubscriber(id);
      setMessage('Subscriber removed');
      fetchSubscribers();
    } catch {
      setMessage('Failed to remove subscriber');
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportSubscribers();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage('Export failed');
    }
  };

  const filtered = subscribers.filter(
    (s) =>
      !search ||
      s.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bebas text-3xl tracking-wider text-off-white mb-2">SUBSCRIBERS</h1>
      <div className="w-16 h-1 bg-neon mb-6" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-gray-400">
            Total: <span className="text-neon">{subscribers.length}</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm w-56"
          />
        </div>
        <button onClick={handleExport} className="btn-neon px-4 py-2 text-sm">
          EXPORT CSV
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-neon/10 border border-neon/30 text-neon text-sm font-mono">
          {message}
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Avatar</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Display Name</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Email</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Joined</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Role</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                  <td className="p-4">
                    {s.avatar ? (
                      <img src={s.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center">
                        <span className="font-mono text-xs text-gray-500">
                          {s.displayName?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-off-white font-mono text-sm">{s.displayName || '—'}</td>
                  <td className="p-4 text-gray-400 font-mono text-sm">{s.email}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {new Date(s.subscribedAt || s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`font-mono text-xs px-2 py-1 rounded ${
                      s.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-dark-border text-gray-500'
                    }`}>
                      {s.role?.toUpperCase() || 'USER'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRemove(s._id, s.displayName || s.email)}
                      className="font-mono text-xs text-neon-red border border-neon-red/30 px-3 py-1 hover:bg-neon-red/10"
                    >
                      REMOVE
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
