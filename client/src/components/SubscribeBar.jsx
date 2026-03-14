import { useState } from 'react';
import { subscribe } from '../api';

export default function SubscribeBar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { data } = await subscribe(email);
      setStatus(data.message);
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card border-b border-dark-border py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="font-bebas text-2xl tracking-wider text-off-white mb-2">
          JOIN THE UNCOVERED COMMUNITY
        </h3>
        {status ? (
          <p className="text-neon font-bebas text-lg tracking-wider mt-4">
            {status}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-neon px-6 py-3 font-bebas tracking-wider disabled:opacity-50"
            >
              {loading ? '...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
