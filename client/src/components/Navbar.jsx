import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/biographies', label: 'Biographies' },
    { to: '/merch', label: 'Merch' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-dark/85 backdrop-blur-xl border-b border-dark-border shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <span className="font-bebas text-gold text-3xl md:text-4xl tracking-widest">
              Breaseonby
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-bebas text-lg tracking-wider transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-neon'
                    : 'text-off-white hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="font-bebas text-lg tracking-wider text-gold hover:text-neon transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <UserAvatar />
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-neon px-5 py-2 font-bebas text-lg tracking-wider"
              >
                SIGN IN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-off-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-dark-border bg-dark/70 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-bebas text-xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                    location.pathname === link.to
                      ? 'text-neon'
                      : 'text-off-white hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="font-bebas text-xl tracking-wider text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/account"
                    className="font-bebas text-xl tracking-wider text-off-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  >
                    My Account
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="font-bebas text-xl tracking-wider text-neon drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
