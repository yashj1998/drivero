import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@drivero.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[var(--dark)] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 md:px-12 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="font-display text-2xl tracking-wider text-white">DRIVEO</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-3" />
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          ← Return to Website
        </Link>
      </header>

      {/* Center Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6 animate-fade-up">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-[var(--accent)] flex items-center justify-center mx-auto shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="eyebrow text-white/50 tracking-widest pt-2">Executive Portal</p>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-white">ADMIN ACCESS</h1>
            <p className="text-xs text-white/60">Manage bookings, customer rentals, fleet inventory, and live analytics.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-fade-in text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1.5 block">
                Admin Email
              </label>
              <div className="flex items-center gap-3 border border-white/15 bg-white/5 rounded-2xl px-4 py-3 focus-within:border-white/40 transition-colors">
                <Mail className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="admin@drivero.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1.5 block">
                Password
              </label>
              <div className="flex items-center gap-3 border border-white/15 bg-white/5 rounded-2xl px-4 py-3 focus-within:border-white/40 transition-colors">
                <Lock className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill w-full flex items-center justify-center gap-2 bg-white text-[var(--dark)] font-semibold text-sm py-3.5 rounded-2xl shadow-lg hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Fill Helper */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-[11px] text-white/50">Quick demo access with preconfigured credentials:</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium transition-colors border border-white/10"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Demo (admin@drivero.com / admin123)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-white/40 relative z-10">
        © 2026 Driveo Luxury Fleet Operations. Restricted Access.
      </footer>
    </div>
  );
}
