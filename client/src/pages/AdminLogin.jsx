import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await adminLogin({ username, password });
      login(data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — UNCOVERED</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-bebas text-gold text-5xl tracking-widest">UNCOVERED</h1>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-2">
              Admin Access
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-dark-card border border-dark-border rounded-lg p-8"
          >
            {error && (
              <div className="mb-4 p-3 bg-neon-red/10 border border-neon-red/30 text-neon-red text-sm font-mono">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon py-3 disabled:opacity-50"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
