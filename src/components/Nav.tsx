import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="font-display text-2xl tracking-wide transition-transform group-hover:scale-[1.02]">DRIVEO</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-3" />
        </Link>

        <div className="hidden md:flex items-center gap-9 text-sm font-medium text-[var(--ink)]/80">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`link-underline transition-colors hover:text-[var(--ink)] ${active ? 'text-[var(--ink)]' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Link
            to="/fleet"
            className="btn-pill inline-flex items-center gap-2 bg-[var(--dark)] text-white text-sm font-medium pl-5 pr-2 py-2 rounded-full btn-pill-dark"
          >
            Book Now
            <span className="btn-icon-chip w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-black/5 bg-[var(--cream)] px-6 py-4 flex flex-col gap-4 text-sm font-medium animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === link.to ? 'text-[var(--ink)]' : 'text-[var(--ink)]/70'}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/fleet"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-[var(--dark)] text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </nav>
  );
}
