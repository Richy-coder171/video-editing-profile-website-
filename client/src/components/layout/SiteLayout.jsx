import { Link, NavLink, Outlet } from 'react-router-dom';
import { Clapperboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ScrollProgress from './ScrollProgress.jsx';
import { useAuth } from '../../contexts/authContext.js';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Reels', to: '/reels' },
  { label: 'Videos', to: '/videos' },
  { label: 'Designs', to: '/designs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const navClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-ink shadow-glow' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

const SiteLayout = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-frost">
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-electric/25 bg-white text-ink shadow-glow">
              <Clapperboard size={20} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-sm font-semibold uppercase tracking-[0.22em] text-white sm:tracking-[0.28em]">
                Cinematic
              </span>
              <span className="block truncate text-xs text-white/60">Video Editing Portfolio</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink to="/admin" className={navClass}>
                  Dashboard
                </NavLink>
                <button className="icon-button" onClick={logout} aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <NavLink to="/admin-login" className="btn-ghost">
                Admin
              </NavLink>
            )}
          </div>

          <button
            className="icon-button md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="absolute inset-x-0 top-full border-t border-white/10 bg-ink/95 px-4 py-4 shadow-[0_28px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl md:hidden">
            <nav className="mx-auto grid max-w-md gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={(state) => `${navClass(state)} flex items-center justify-start px-4 py-3`} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to={isAuthenticated ? '/admin' : '/admin-login'}
                className={(state) => `${navClass(state)} flex items-center justify-start px-4 py-3`}
                onClick={() => setOpen(false)}
              >
                {isAuthenticated ? 'Dashboard' : 'Admin'}
              </NavLink>
              {isAuthenticated && (
                <button
                  className="btn-ghost justify-start"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <Outlet />

      <footer className="border-t border-white/10 bg-black px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>Cinematic Video Editing Portfolio</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-white" to="/reels">
              Reels
            </Link>
            <Link className="hover:text-white" to="/videos">
              Video edits
            </Link>
            <Link className="hover:text-white" to="/designs">
              Design work
            </Link>
            <Link className="hover:text-white" to="/contact">
              Hire me
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
