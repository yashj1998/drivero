import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CalendarCheck,
  Users,
  Car,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, type AnalyticsData, type BookingRecord } from '@/services/api';

export function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: string, note?: string) => {
    setUpdatingBookingId(bookingId);
    setActionMessage(null);
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus, note);
      if (res.success) {
        setActionMessage(res.message);
        await fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const kpis = analytics?.kpis || {
    totalRevenue: 0,
    avgOrderValue: 0,
    avgRentalDays: 0,
    totalBookings: 0,
    activeRentals: 0,
    inTransitCount: 0,
    deliveredCount: 0,
    completedCount: 0,
    pendingCount: 0,
    totalCustomers: 0,
    totalCars: 8,
    availableCars: 6,
    rentedCars: 2,
    utilizationRate: 25,
  };

  const monthlyData = analytics?.monthlyRevenue || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><Send className="w-3 h-3" /> In Transit / Car Sent</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"><Car className="w-3 h-3" /> Active / Delivered</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-[var(--label)]">Operational Command</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">DASHBOARD OVERVIEW</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-[var(--ink)] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
          <Link
            to="/admin/analytics"
            className="btn-pill bg-[var(--dark)] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-md btn-pill-dark flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Detailed Analytics</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">${kpis.totalRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Avg. ${kpis.avgOrderValue} per booking</span>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Active Rentals</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">{kpis.activeRentals}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="font-semibold text-amber-700">{kpis.inTransitCount} In Transit</span>
            <span>·</span>
            <span className="font-semibold text-blue-700">{kpis.deliveredCount} Delivered</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Total Bookings</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">{kpis.totalBookings}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span>{kpis.completedCount} completed successfully</span>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Fleet Utilization</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">{kpis.utilizationRate}%</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span>{kpis.availableCars} of {kpis.totalCars} cars currently available</span>
          </div>
        </div>
      </div>

      {/* Mini Revenue Curve Graph */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-[28px] p-6 border border-black/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="eyebrow">Revenue Pulse</span>
              <h3 className="font-display text-xl text-[var(--ink)]">FINANCIAL GROWTH</h3>
            </div>
            <Link to="/admin/analytics" className="text-xs text-[var(--accent)] font-semibold hover:underline flex items-center gap-1">
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#121212" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#121212" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9b968a" fontSize={10} tickLine={false} />
                <YAxis stroke="#9b968a" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#121212', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#121212"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#dashGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Bookings & Fleet Overview */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
        {/* Left Column: Recent Bookings & Dispatch Actions */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-[var(--ink)]">RECENT RESERVATIONS</h2>
              <p className="text-xs text-[var(--muted)]">Real-time customer bookings from MongoDB</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 overflow-x-auto">
            {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
              analytics.recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-[var(--card)] border border-black/5 hover:border-black/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Customer & Car Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={b.carSnapshot?.img || b.car?.img}
                      alt={b.carSnapshot?.name}
                      className="w-16 h-12 rounded-xl object-cover shrink-0 bg-black/10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--ink)]">{b.bookingNumber}</span>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-xs text-[var(--ink)]/80 font-medium truncate mt-0.5">
                        {b.customerSnapshot?.name} ({b.customerSnapshot?.phone})
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {b.carSnapshot?.name} · {b.days} days · <span className="font-semibold text-[var(--ink)]">${b.priceBreakdown?.total}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions according to status */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'in_transit', 'Chauffeur dispatched with rented vehicle to customer location.')}
                        disabled={updatingBookingId === b._id}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Rented Car</span>
                      </button>
                    )}

                    {b.status === 'in_transit' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'delivered', 'Vehicle handed over to customer. Active rental underway.')}
                        disabled={updatingBookingId === b._id}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {b.status === 'delivered' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'completed', 'Car returned in excellent condition. Inspection complete.')}
                        disabled={updatingBookingId === b._id}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Complete Return</span>
                      </button>
                    )}

                    <Link
                      to="/admin/bookings"
                      className="p-2 rounded-xl bg-white border border-black/10 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                      title="Inspect full details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-[var(--muted)]">No reservations placed yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Fleet Ranking & Category Breakdown */}
        <div className="space-y-6">
          {/* Top Cars */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-5">
            <h3 className="font-display text-xl text-[var(--ink)]">TOP PERFORMING CARS</h3>

            <div className="space-y-3">
              {analytics?.topCars && analytics.topCars.map((car, idx) => (
                <div key={car.slug || idx} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--cream)] border border-black/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-display text-lg text-[var(--muted)] w-5 text-center">#{idx + 1}</span>
                    <img src={car.img} alt={car.name} className="w-12 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[var(--ink)] truncate">{car.name}</p>
                      <p className="text-[10px] text-[var(--muted)] uppercase">{car.tag} · ${car.price}/day</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[var(--ink)]">{car.totalRentals || 0}</span>
                    <span className="text-[10px] text-[var(--muted)] block">Rentals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-4">
            <h3 className="font-display text-xl text-[var(--ink)]">REVENUE BY CATEGORY</h3>
            <div className="space-y-3">
              {analytics?.categoryStats && analytics.categoryStats.map((c) => {
                const percent = kpis.totalRevenue > 0 ? Math.round((c.revenue / kpis.totalRevenue) * 100) : 0;
                return (
                  <div key={c._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{c._id}</span>
                      <span className="text-[var(--muted)]">${c.revenue.toLocaleString()} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--dark)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
