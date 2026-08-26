import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Car,
  BarChart3,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

const navItems = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Fleet Management', path: '/admin/fleet', icon: Car },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If loading, show sleek loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-display tracking-widest text-lg">DRIVEO ADMIN CONCIERGE</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[var(--ink)] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[var(--dark)] text-white p-6 border-r border-white/10 shrink-0 sticky top-0 h-screen justify-between shadow-2xl">
        <div className="space-y-8">
          {/* Logo & Badge */}
          <div>
            <Link to="/" className="flex items-center gap-1.5 group mb-2">
              <span className="font-display text-2xl tracking-wider text-white group-hover:text-[var(--accent)] transition-colors">DRIVEO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-3" />
            </Link>
            <div className="flex items-center gap-2 mt-1 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[10px] uppercase font-bold tracking-widest w-fit">
              <Shield className="w-3 h-3 text-[var(--accent)]" />
              <span>Admin Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-white text-[var(--dark)] shadow-md font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${active ? 'text-[var(--dark)]' : 'text-white/60'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-[var(--dark)]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Actions */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-display text-white text-base">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="leading-tight overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-white/50 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium border border-white/10 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3 h-3 text-white/50" />
          </Link>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[var(--dark)] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-1.5">
          <span className="font-display text-xl tracking-wide">DRIVEO ADMIN</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2" />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-white/80 hover:bg-white/10"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] z-40 bg-[var(--dark)] text-white p-6 flex flex-col justify-between animate-fade-in">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    active ? 'bg-white text-[var(--dark)] font-semibold' : 'text-white/70'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50">Logged in as {user?.email}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 font-medium py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
