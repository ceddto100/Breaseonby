import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const subscribedDate = user.subscribedAt
    ? new Date(user.subscribedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <Helmet>
        <title>My Account — UNCOVERED</title>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="font-bebas text-4xl tracking-wider text-off-white mb-2">
          MY ACCOUNT
        </h1>
        <div className="w-20 h-1 bg-neon mb-10" />

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          {/* Profile */}
          <div className="flex items-center gap-6 mb-8">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-2 border-dark-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neon/20 border-2 border-neon/30 flex items-center justify-center">
                <span className="font-bebas text-neon text-3xl">
                  {user.displayName?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-bebas text-2xl tracking-wider text-off-white">
                {user.displayName}
              </h2>
              <p className="font-mono text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Subscriber badge */}
          {user.subscribed && subscribedDate && (
            <div className="mb-6 p-4 border border-neon/30 bg-neon/5 rounded-lg">
              <p className="font-mono text-xs text-neon uppercase tracking-widest">
                SUBSCRIBER SINCE {subscribedDate}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-dark-border/50">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Status
              </span>
              <span className="font-mono text-sm text-neon">
                {user.subscribed ? 'Active Subscriber' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-dark-border/50">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Role
              </span>
              <span
                className={`font-mono text-sm ${
                  user.role === 'admin' ? 'text-gold' : 'text-gray-400'
                }`}
              >
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="font-mono text-sm text-neon-red border border-neon-red/30 px-6 py-2 hover:bg-neon-red/10 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </>
  );
}
