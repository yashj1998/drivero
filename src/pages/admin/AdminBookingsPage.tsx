import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  CreditCard,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  X,
  FileText,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, type BookingRecord } from '@/services/api';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings({
        status: statusFilter,
        search: searchQuery,
      });
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId: string, status: string, note?: string) => {
    setIsUpdating(true);
    try {
      const res = await api.updateBookingStatus(bookingId, status, note);
      if (res.success) {
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(res.data);
        }
        await fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await api.deleteBooking(bookingId);
      if (selectedBooking?._id === bookingId) setSelectedBooking(null);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><Send className="w-3 h-3" /> In Transit / Car Sent</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"><Car className="w-3 h-3" /> Active / Delivered</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Operations & Fleet Dispatch</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">RENTAL RESERVATIONS</h1>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Total: <strong className="text-[var(--ink)]">{bookings.length}</strong> bookings shown
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/10 shadow-sm space-y-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed (Ready to Send)' },
            { id: 'in_transit', label: 'In Transit (Car Sent)' },
            { id: 'delivered', label: 'Active Rentals' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-[var(--dark)] text-white shadow-sm font-semibold'
                  : 'bg-[var(--cream)] text-[var(--ink)]/70 hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2.5 bg-[var(--cream)] rounded-xl px-4 py-2.5 border border-black/5">
            <Search className="w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by customer name, phone, email, booking # (DRV-...), or car name..."
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

      {/* Bookings Table / List */}
      <div className="bg-white rounded-[28px] border border-black/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--muted)] text-sm">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
            Loading rental reservations from MongoDB...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-[var(--muted)] text-sm space-y-2">
            <p className="font-semibold text-[var(--ink)] text-base">No bookings found matching criteria</p>
            <p className="text-xs">Try switching filters or search for another customer/booking number.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-[var(--card)]/50 text-[11px] font-semibold uppercase tracking-wider text-[var(--label)]">
                  <th className="py-4 px-6">Booking / Customer</th>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Rental Dates</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs text-[var(--ink)]">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[var(--card)]/30 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--ink)]">{b.bookingNumber}</span>
                          <span className="text-[10px] text-[var(--muted)]">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-semibold text-xs text-[var(--ink)]">{b.customerSnapshot?.name}</p>
                        <p className="text-[11px] text-[var(--muted)]">{b.customerSnapshot?.phone} · {b.customerSnapshot?.email}</p>
                        {b.customerSnapshot?.licenseNumber && (
                          <p className="text-[10px] text-amber-800 font-medium">License: {b.customerSnapshot.licenseNumber}</p>
                        )}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.carSnapshot?.img || b.car?.img}
                          alt={b.carSnapshot?.name}
                          className="w-14 h-10 object-cover rounded-xl shrink-0 bg-black/10"
                        />
                        <div>
                          <p className="font-semibold text-xs">{b.carSnapshot?.name}</p>
                          <p className="text-[10px] text-[var(--muted)] uppercase">{b.carSnapshot?.tag} · ${b.carSnapshot?.pricePerDay}/day</p>
                        </div>
                      </div>
                    </td>

                    {/* Dates & Location */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{b.days} Day{b.days > 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-[11px] text-[var(--muted)] flex items-center gap-1 truncate max-w-[180px]" title={b.pickupLocation}>
                          <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                          <span className="truncate">{b.pickupLocation}</span>
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-display text-lg text-[var(--ink)]">${b.priceBreakdown?.total}</span>
                        <p className="text-[10px] text-[var(--muted)]">
                          Subtotal ${b.priceBreakdown?.subtotal} + Ins ${b.priceBreakdown?.insurance}
                        </p>
                        {b.priceBreakdown?.discount > 0 && (
                          <p className="text-[10px] text-emerald-600 font-medium">-{b.priceBreakdown.discount} promo</p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'in_transit', 'Chauffeur dispatched with rented vehicle to customer location.')}
                            disabled={isUpdating}
                            title="Dispatch and send car to customer"
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Car</span>
                          </button>
                        )}

                        {b.status === 'in_transit' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'delivered', 'Vehicle handed over to customer.')}
                            disabled={isUpdating}
                            title="Mark as active delivery"
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Delivered</span>
                          </button>
                        )}

                        {b.status === 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'completed', 'Car returned in good order.')}
                            disabled={isUpdating}
                            title="Complete rental return"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Completed</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-xl bg-[var(--card)] hover:bg-black/10 text-[var(--ink)] transition-colors"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Booking Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Inspector Modal Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--cream)] rounded-[28px] max-w-2xl w-full border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-up my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <span className="eyebrow">Reservation File</span>
                <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
                  BOOKING #{selectedBooking.bookingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Transition Control Bar */}
            <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Operational Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'confirmed', 'Admin marked as Confirmed.')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--card)] hover:bg-black/10 text-xs font-medium"
                >
                  Set Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'in_transit', 'Dispatched vehicle with chauffeur to customer.')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch & Send Car</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'delivered', 'Handed over car to customer.')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'completed', 'Completed rental cycle.')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'cancelled', 'Cancelled by concierge.')}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Customer & Vehicle Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Customer */}
              <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-2">
                <p className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider">Customer Details</p>
                <p className="font-semibold text-sm">{selectedBooking.customerSnapshot?.name}</p>
                <div className="text-xs text-[var(--muted)] space-y-1">
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedBooking.customerSnapshot?.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedBooking.customerSnapshot?.phone}</p>
                  <p className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-amber-700" /> Driver License: <strong className="text-[var(--ink)]">{selectedBooking.customerSnapshot?.licenseNumber || 'Not provided'}</strong></p>
                </div>
              </div>

              {/* Vehicle */}
              <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-2">
                <p className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider">Reserved Vehicle</p>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedBooking.carSnapshot?.img || selectedBooking.car?.img}
                    alt={selectedBooking.carSnapshot?.name}
                    className="w-16 h-11 object-cover rounded-xl"
                  />
                  <div>
                    <p className="font-semibold text-sm leading-tight">{selectedBooking.carSnapshot?.name}</p>
                    <p className="text-[11px] text-[var(--muted)] uppercase mt-0.5">{selectedBooking.carSnapshot?.tag} · ${selectedBooking.carSnapshot?.pricePerDay}/day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip details & Delivery Notes */}
            <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[var(--label)] uppercase font-semibold block">Pick-up Location</span>
                  <span className="font-medium text-[var(--ink)] text-sm">{selectedBooking.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-[var(--label)] uppercase font-semibold block">Rental Period</span>
                  <span className="font-medium text-[var(--ink)] text-sm">{selectedBooking.days} Days ({new Date(selectedBooking.pickupDate).toLocaleDateString()} to {new Date(selectedBooking.returnDate).toLocaleDateString()})</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-[var(--cream)] rounded-xl border border-black/5">
                  <span className="font-semibold text-[var(--ink)] block mb-0.5">Special Customer Requests:</span>
                  <p className="text-[var(--muted)]">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider mb-2">Financial Breakdown</p>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Rental Subtotal</span>
                <span className="font-medium text-[var(--ink)]">${selectedBooking.priceBreakdown?.subtotal}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Comprehensive Insurance</span>
                <span className="font-medium text-[var(--ink)]">${selectedBooking.priceBreakdown?.insurance}</span>
              </div>
              {selectedBooking.priceBreakdown?.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promotional Discount ({selectedBooking.priceBreakdown?.promoCode})</span>
                  <span>-${selectedBooking.priceBreakdown?.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-black/5 flex justify-between items-baseline font-bold text-sm">
                <span>Total Amount Charged</span>
                <span className="font-display text-2xl text-[var(--ink)]">${selectedBooking.priceBreakdown?.total}</span>
              </div>
            </div>

            {/* Timeline */}
            {selectedBooking.statusTimeline && selectedBooking.statusTimeline.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider">Status History Log</p>
                <div className="space-y-1.5 text-xs">
                  {selectedBooking.statusTimeline.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white/60 border border-black/5">
                      <Clock className="w-3.5 h-3.5 text-[var(--muted)] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--ink)]">
                          {t.status.replace('_', ' ')}:
                        </span>{' '}
                        <span className="text-[var(--muted)]">{t.note || 'Status updated'}</span>
                        <span className="text-[10px] text-[var(--label)] block mt-0.5">
                          {new Date(t.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 rounded-full bg-[var(--dark)] text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
