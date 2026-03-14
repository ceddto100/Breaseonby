import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Sign In — UNCOVERED</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 grain-overlay">
        <div className="relative z-10 w-full max-w-md text-center">
          <h1 className="font-bebas text-gold text-7xl tracking-widest mb-2">
            UNCOVERED
          </h1>
          <p className="text-gray-400 text-lg tracking-wider mb-10 font-inter">
            Every life has a story. We find it.
          </p>

          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <div className="flex justify-center mb-6">
              <GoogleLoginButton />
            </div>
            <p className="font-mono text-xs text-gray-500 leading-relaxed">
              Sign in to subscribe and track your favorite biographies
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
