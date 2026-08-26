import { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  Car,
  Eye,
  X,
  Clock,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, type CustomerRecord, type BookingRecord } from '@/services/api';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    customer: CustomerRecord;
    bookings: BookingRecord[];
  } | null>(null);
  const [isLoadingCustomerDetails, setIsLoadingCustomerDetails] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCustomers({ search: searchQuery });
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleInspectCustomer = async (customerId: string) => {
    setIsLoadingCustomerDetails(true);
    try {
      const res = await api.getCustomer(customerId);
      if (res.success && res.data) {
        setSelectedCustomer(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load customer profile');
    } finally {
      setIsLoadingCustomerDetails(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Customer Intelligence</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">CUSTOMER DIRECTORY</h1>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Total: <strong className="text-[var(--ink)]">{customers.length}</strong> registered clients
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/10 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2.5 bg-[var(--cream)] rounded-xl px-4 py-2.5 border border-black/5">
            <Search className="w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, license number, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[var(--ink)] outline-none w-full placeholder:text-black/30"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--dark)] text-white text-xs font-semibold hover:bg-black/80 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[28px] border border-black/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--muted)] text-sm">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
            Loading customer records from MongoDB...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-[var(--muted)] text-sm space-y-2">
            <p className="font-semibold text-[var(--ink)] text-base">No customers found</p>
            <p className="text-xs">Customers will automatically appear here as they book vehicles.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-[var(--card)]/50 text-[11px] font-semibold uppercase tracking-wider text-[var(--label)]">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Driver's License</th>
                  <th className="py-4 px-6">Total Bookings</th>
                  <th className="py-4 px-6">Lifetime Value</th>
                  <th className="py-4 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs text-[var(--ink)]">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[var(--card)]/30 transition-colors">
                    {/* Customer Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-700 to-stone-900 text-white flex items-center justify-center font-display text-base shrink-0 shadow-sm">
                          {c.name ? c.name[0].toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[var(--ink)]">{c.name}</p>
                          <p className="text-[10px] text-[var(--muted)]">Member since {new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink)]">
                          <Mail className="w-3.5 h-3.5 text-[var(--muted)]" /> {c.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                          <Phone className="w-3.5 h-3.5 text-[var(--muted)]" /> {c.phone}
                        </p>
                        {c.city && (
                          <p className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                            <MapPin className="w-3 h-3 text-[var(--accent)]" /> {c.city}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* License */}
                    <td className="py-4 px-6">
                      {c.licenseNumber ? (
                        <span className="font-mono bg-[var(--card)] px-2.5 py-1 rounded-lg border border-black/5 text-xs font-semibold text-[var(--ink)]">
                          {c.licenseNumber}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)] text-[11px]">Unverified</span>
                      )}
                    </td>

                    {/* Total Bookings */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-[var(--ink)]">{c.totalBookings}</span>
                        <p className="text-[10px] text-[var(--muted)]">
                          Last: {c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-4 px-6">
                      <span className="font-display text-lg text-[var(--ink)]">${c.totalSpent.toLocaleString()}</span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleInspectCustomer(c._id)}
                        disabled={isLoadingCustomerDetails}
                        className="px-3 py-1.5 rounded-xl bg-[var(--card)] hover:bg-black/10 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--ink)]" />
                        <span>Rental History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile & Rental History Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--cream)] rounded-[28px] max-w-2xl w-full border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-up my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--dark)] text-white flex items-center justify-center font-display text-xl">
                  {selectedCustomer.customer.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--ink)]">{selectedCustomer.customer.name}</h3>
                  <p className="text-xs text-[var(--muted)]">Customer Record ID: {selectedCustomer.customer._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-black/10 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--label)]">Lifetime Spend</p>
                <p className="font-display text-2xl text-[var(--ink)] mt-1">${selectedCustomer.customer.totalSpent}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-black/10 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--label)]">Rentals Count</p>
                <p className="font-display text-2xl text-[var(--ink)] mt-1">{selectedCustomer.customer.totalBookings}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-black/10 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--label)]">Driver License</p>
                <p className="font-mono text-xs font-bold text-[var(--ink)] mt-2">{selectedCustomer.customer.licenseNumber || 'None'}</p>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider">Contact & Address</p>
              <div className="grid sm:grid-cols-2 gap-2 text-[var(--ink)]">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[var(--muted)]" /> {selectedCustomer.customer.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[var(--muted)]" /> {selectedCustomer.customer.phone}</p>
                {selectedCustomer.customer.address && (
                  <p className="flex items-center gap-1.5 sm:col-span-2"><MapPin className="w-3.5 h-3.5 text-[var(--accent)]" /> {selectedCustomer.customer.address}</p>
                )}
              </div>
            </div>

            {/* Past Bookings List */}
            <div className="space-y-3">
              <h4 className="font-display text-lg text-[var(--ink)]">RENTAL HISTORY ({selectedCustomer.bookings.length})</h4>
              {selectedCustomer.bookings.length === 0 ? (
                <p className="text-xs text-[var(--muted)] p-4 bg-white rounded-2xl border border-black/5 text-center">
                  No previous reservations on record.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedCustomer.bookings.map((b) => (
                    <div
                      key={b._id}
                      className="p-4 rounded-2xl bg-white border border-black/10 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={b.carSnapshot?.img || b.car?.img}
                          alt={b.carSnapshot?.name}
                          className="w-14 h-10 object-cover rounded-xl shrink-0 bg-black/10"
                        />
                        <div>
                          <p className="font-bold text-sm text-[var(--ink)]">{b.bookingNumber}</p>
                          <p className="font-semibold text-xs text-[var(--ink)]/80">{b.carSnapshot?.name}</p>
                          <p className="text-[10px] text-[var(--muted)]">
                            {new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()} ({b.days} days)
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-display text-base text-[var(--ink)] block">${b.priceBreakdown?.total}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-700">{b.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2.5 rounded-full bg-[var(--dark)] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
