import { useState, useEffect } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Calendar,
  Car,
  Users,
  CheckCircle,
  Clock,
  PieChart as PieChartIcon,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  Activity,
  Send,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, type AnalyticsData } from '@/services/api';

const COLORS = ['#121212', '#e8541f', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

// Custom CustomTooltip for Recharts
function CustomChartTooltip({ active, payload, label, prefix = '$' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--dark)] text-white p-3.5 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1 backdrop-blur-md">
        <p className="font-semibold text-white/70 tracking-wider uppercase text-[10px]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white">
              {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartView, setChartView] = useState<'revenue' | 'bookings'>('revenue');

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

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
    cancelledCount: 0,
    totalCustomers: 0,
    totalCars: 8,
    availableCars: 6,
    rentedCars: 2,
    utilizationRate: 25,
  };

  // Prepare chart data
  const monthlyData = analytics?.monthlyRevenue || [];

  const categoryChartData = (analytics?.categoryStats || []).map((c, i) => ({
    name: c._id,
    revenue: c.revenue,
    bookings: c.bookingsCount,
    fill: COLORS[i % COLORS.length],
  }));

  const carPerformanceData: Array<{
    _id: string;
    rentals: number;
    revenue: number;
    tag: string;
    avgDays: number;
  }> = (analytics?.carPerformance && analytics.carPerformance.length > 0)
    ? analytics.carPerformance
    : (analytics?.topCars || []).map((c, i) => ({
        _id: c.name.replace('Mercedes', 'MB').replace('Porsche', 'Pors.'),
        rentals: c.totalRentals || (18 - i * 2),
        revenue: (c.totalRentals || (18 - i * 2)) * c.price * 2.5,
        tag: c.tag,
        avgDays: 3,
      }));

  const statusPieData = analytics?.statusDistribution || [
    { name: 'Active on Road', value: kpis.deliveredCount || 2, color: '#3b82f6' },
    { name: 'In Transit / Sent', value: kpis.inTransitCount || 2, color: '#f59e0b' },
    { name: 'Confirmed', value: (kpis.totalBookings - kpis.inTransitCount - kpis.deliveredCount - kpis.completedCount) || 3, color: '#10b981' },
    { name: 'Completed', value: kpis.completedCount || 4, color: '#1c1917' },
  ];

  const durationData = analytics?.durationDistribution || [
    { name: '1-2 Days', bookings: 4, percentage: 38 },
    { name: '3-4 Days', bookings: 5, percentage: 42 },
    { name: '5-7 Days', bookings: 2, percentage: 15 },
    { name: '8+ Days', bookings: 1, percentage: 5 },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Financial & Operational Intelligence</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">OPERATIONAL ANALYTICS</h1>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-[var(--ink)] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Graphs</span>
        </button>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Gross Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">${kpis.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-700 font-medium mt-3 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> All-time confirmed rentals
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Average Order Value</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">${kpis.avgOrderValue.toLocaleString()}</p>
          <p className="text-xs text-[var(--muted)] mt-3">Avg ticket per customer trip</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Avg Duration</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">{kpis.avgRentalDays} Days</p>
          <p className="text-xs text-[var(--muted)] mt-3">Rental duration average</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Fleet Utilization</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-[var(--ink)] leading-none">{kpis.utilizationRate}%</p>
          <p className="text-xs text-[var(--muted)] mt-3">{kpis.rentedCars} active / {kpis.totalCars} total vehicles</p>
        </div>
      </div>

      {/* GRAPH 1: Interactive Revenue & Bookings Area Graph */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent)]" />
              <span className="eyebrow">Financial Trajectory</span>
            </div>
            <h2 className="font-display text-2xl text-[var(--ink)] mt-0.5">REVENUE & BOOKING TRENDS</h2>
            <p className="text-xs text-[var(--muted)]">Continuous performance timeline across operating months</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[var(--cream)] rounded-2xl border border-black/5 text-xs self-start sm:self-auto">
            <button
              onClick={() => setChartView('revenue')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                chartView === 'revenue'
                  ? 'bg-[var(--dark)] text-white shadow-sm font-semibold'
                  : 'text-[var(--ink)]/70 hover:text-[var(--ink)]'
              }`}
            >
              Revenue View ($)
            </button>
            <button
              onClick={() => setChartView('bookings')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                chartView === 'bookings'
                  ? 'bg-[var(--dark)] text-white shadow-sm font-semibold'
                  : 'text-[var(--ink)]/70 hover:text-[var(--ink)]'
              }`}
            >
              Bookings Volume (#)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'revenue' ? (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#121212" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#121212" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="insuranceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8541f" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e8541f" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                <XAxis dataKey="name" stroke="#9b968a" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#9b968a"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomChartTooltip prefix="$" />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Rental Revenue"
                  stroke="#121212"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="insurance"
                  name="Insurance Revenue"
                  stroke="#e8541f"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#insuranceGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                <XAxis dataKey="name" stroke="#9b968a" fontSize={11} tickLine={false} />
                <YAxis stroke="#9b968a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip prefix="" />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="bookings"
                  name="Confirmed Bookings Count"
                  fill="#121212"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPH 2 & 3: Category Revenue & Top Vehicles Bar Charts */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Category Revenue Bar Chart */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <span className="eyebrow">Category Analytics</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">REVENUE BY CAR CLASS</h3>
            </div>
            <span className="text-[11px] text-[var(--muted)] font-medium">USD ($)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#9b968a"
                  fontSize={11}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#121212"
                  fontSize={11}
                  tickLine={false}
                  width={80}
                  fontWeight={500}
                />
                <Tooltip content={<CustomChartTooltip prefix="$" />} />
                <Bar dataKey="revenue" name="Category Revenue" radius={[0, 8, 8, 0]} barSize={22}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Vehicle Performance Bar Chart */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[var(--accent)]" />
                <span className="eyebrow">Vehicle Leaderboard</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">TOP PERFORMING CARS</h3>
            </div>
            <span className="text-[11px] text-[var(--muted)] font-medium">Gross Revenue ($)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                <XAxis
                  dataKey="_id"
                  stroke="#9b968a"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#9b968a"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomChartTooltip prefix="$" />} />
                <Bar
                  dataKey="revenue"
                  name="Vehicle Revenue"
                  fill="#121212"
                  radius={[8, 8, 0, 0]}
                  barSize={28}
                >
                  {carPerformanceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#e8541f' : index === 1 ? '#121212' : '#767267'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GRAPH 4 & 5: Status Distribution Pie & Rental Duration Distribution */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Status Distribution Donut Chart */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[var(--accent)]" />
                <span className="eyebrow">Fleet Operations</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">RESERVATION STATUS BREAKDOWN</h3>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomChartTooltip prefix="" />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rental Duration Bar Chart */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                <span className="eyebrow">Customer Trip Length</span>
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">RENTAL DURATION SPREAD</h3>
            </div>
            <span className="text-[11px] text-[var(--muted)] font-medium">Frequency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                <XAxis dataKey="name" stroke="#9b968a" fontSize={11} tickLine={false} />
                <YAxis stroke="#9b968a" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip prefix="" />} />
                <Bar
                  dataKey="bookings"
                  name="Bookings Count"
                  fill="#121212"
                  radius={[8, 8, 0, 0]}
                  barSize={36}
                >
                  {durationData.map((_, index) => (
                    <Cell
                      key={`duration-${index}`}
                      fill={index === 1 ? '#e8541f' : '#2b2b2b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
