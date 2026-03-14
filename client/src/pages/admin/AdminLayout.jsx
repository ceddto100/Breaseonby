import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/upload', label: 'Upload Video', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { to: '/admin/videos', label: 'Manage Videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { to: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const currentSection = sidebarLinks.find((l) => l.to === location.pathname)?.label || 'Admin';

  return (
    <>
      <Helmet>
        <title>Admin — UNCOVERED</title>
      </Helmet>

      <div className="pt-16 md:pt-20 min-h-screen overflow-x-hidden">

        {/* Mobile admin top bar — visible on mobile so users can find the nav */}
        <div className="md:hidden sticky top-16 z-30 bg-dark-card border-b border-dark-border px-4 h-12 flex items-center justify-between">
          <span className="font-bebas text-gold tracking-wider">{currentSection}</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-off-white p-1"
            aria-label="Toggle admin menu"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed md:sticky top-28 md:top-20 left-0 z-30 h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] w-64 bg-dark-card border-r border-dark-border flex flex-col transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            {/* Admin header */}
            <div className="p-6 border-b border-dark-border">
              <h2 className="font-bebas text-gold text-xl tracking-widest">UNCOVERED ADMIN</h2>
              {user && (
                <div className="flex items-center gap-2 mt-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center">
                      <span className="font-bebas text-neon text-xs">{user.displayName?.charAt(0)}</span>
                    </div>
                  )}
                  <span className="font-mono text-xs text-gray-500 truncate">{user.displayName}</span>
                </div>
              )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                    location.pathname === link.to
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-gray-400 hover:text-off-white hover:bg-dark-border/30'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
