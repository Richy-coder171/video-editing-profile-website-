import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ScrollProgress from './ScrollProgress.jsx';
import { useAuth } from '../../contexts/authContext.js';
import { primaryContactLinks } from '../../data/contactLinks.js';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Reels', to: '/reels' },
  { label: 'Videos', to: '/videos' },
  { label: 'Designs', to: '/designs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const navClass = ({ isActive }) =>
  `relative px-3 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] transition ${
    isActive ? 'text-acid after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:bg-acid' : 'text-white/55 hover:text-white'
  }`;

const SiteLayout = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-frost">
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="relative grid h-9 w-9 place-items-center border border-white/20 bg-frost font-display text-lg font-black text-ink">
              C<span className="absolute -right-1 -top-1 h-2 w-2 bg-acid" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg font-bold uppercase tracking-[0.08em] text-white">
                Cut / Frame
              </span>
              <span className="block truncate font-mono text-[0.55rem] uppercase tracking-[0.13em] text-white/40">Editing portfolio</span>
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
              <NavLink to="/admin-login" className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/35 transition hover:text-white">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-bold uppercase tracking-[0.08em] text-frost">Cut / Frame</p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.13em] text-white/35">Picture. Rhythm. Finish.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/50">
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
          {primaryContactLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              {primaryContactLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition hover:border-acid/40 hover:text-white"
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <link.icon size={15} />
                  <span className="truncate">{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
