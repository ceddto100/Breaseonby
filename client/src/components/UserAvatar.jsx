import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserAvatar() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-8 h-8 rounded-full border border-dark-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-neon/20 border border-neon/30 flex items-center justify-center">
            <span className="font-bebas text-neon text-sm">
              {user.displayName?.charAt(0) || '?'}
            </span>
          </div>
        )}
        <span className="hidden sm:block font-mono text-xs text-gray-400 max-w-[100px] truncate">
          {user.displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-dark-border">
            <p className="font-mono text-xs text-off-white truncate">{user.displayName}</p>
            <p className="font-mono text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 font-mono text-xs text-gray-400 hover:text-neon hover:bg-dark-border/30 transition-colors"
          >
            MY ACCOUNT
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 font-mono text-xs text-gold hover:bg-dark-border/30 transition-colors"
            >
              DASHBOARD
            </Link>
          )}
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full text-left px-4 py-2 font-mono text-xs text-neon-red hover:bg-dark-border/30 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}
