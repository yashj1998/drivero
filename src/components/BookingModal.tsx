import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Car as CarIcon,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Loader2,
  User,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Sparkles,
} from 'lucide-react';
import { api, type CarItem, type BookingRecord } from '@/services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarItem | null;
  initialDays?: number;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialLocation?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  car,
  initialDays = 2,
  initialPickupDate = '',
  initialReturnDate = '',
  initialLocation = '',
}: BookingModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState(initialLocation || 'Los Angeles International Airport (LAX)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [days, setDays] = useState(initialDays);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Initialize dates
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setConfirmedBooking(null);

      const today = new Date();
      const defaultPickup = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
      const defaultReturn = new Date(defaultPickup.getTime() + (initialDays || 2) * 24 * 60 * 60 * 1000);

      const toISODate = (d: Date) => d.toISOString().split('T')[0];

      setPickupDate(initialPickupDate || toISODate(defaultPickup));
      setReturnDate(initialReturnDate || toISODate(defaultReturn));
      setDays(initialDays || 2);
    }
  }, [isOpen, initialDays, initialPickupDate, initialReturnDate]);

  // Recalculate days when dates change
  const handlePickupDateChange = (val: string) => {
    setPickupDate(val);
    if (val && returnDate) {
      const p = new Date(val);
      const r = new Date(returnDate);
      const diffTime = r.getTime() - p.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDays(diffDays);
      }
    }
  };

  const handleReturnDateChange = (val: string) => {
    setReturnDate(val);
    if (pickupDate && val) {
      const p = new Date(pickupDate);
      const r = new Date(val);
      const diffTime = r.getTime() - p.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDays(diffDays);
      }
    }
  };

  if (!isOpen || !car) return null;

  // Price calculations
  const pricePerDay = car.price;
  const subtotal = pricePerDay * days;
  const insurance = 25 * days;
  const discount = promoApplied ? Math.round((subtotal + insurance) * 0.20) : 0;
  const total = Math.max(0, subtotal + insurance - discount);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'DRIVEO20') {
      setPromoApplied(true);
      setError(null);
    } else {
      setError('Invalid promo code. Try "DRIVEO20" for 20% off.');
      setPromoApplied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your contact phone number.');
      return;
    }
    if (!pickupLocation.trim()) {
      setError('Please specify a pick-up location or airport.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.createBooking({
        carId: car._id,
        carSlug: car.slug,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        licenseNumber: licenseNumber.trim(),
        pickupLocation: pickupLocation.trim(),
        deliveryAddress: deliveryAddress.trim() || pickupLocation.trim(),
        pickupDate,
        returnDate,
        days,
        promoCode: promoApplied ? 'DRIVEO20' : '',
        notes: notes.trim(),
      });

      if (result.success && result.data) {
        setConfirmedBooking(result.data);
      } else {
        setError(result.message || 'Failed to complete booking.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing your booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[var(--cream)] rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-black/10 overflow-hidden my-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-black/10 flex items-center justify-between bg-white/60">
          <div>
            <span className="eyebrow">Reservation Concierge</span>
            <h3 className="font-display text-2xl md:text-3xl tracking-tight text-[var(--ink)] mt-0.5">
              {confirmedBooking ? 'RESERVATION CONFIRMED' : `BOOK ${car.name.toUpperCase()}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[var(--ink)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-1">Vehicle Reserved & Chauffeur Notified</p>
                <h4 className="font-display text-3xl md:text-4xl text-[var(--ink)]">BOOKING #{confirmedBooking.bookingNumber}</h4>
                <p className="text-sm text-[var(--muted)] mt-2 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-[var(--ink)]">{confirmedBooking.customerSnapshot.name}</span>. We've saved your reservation into our system and sent confirmation to <span className="font-semibold text-[var(--ink)]">{confirmedBooking.customerSnapshot.email}</span>.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-black/10 text-left shadow-sm max-w-lg mx-auto space-y-4">
                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                  <img
                    src={car.img}
                    alt={car.name}
                    className="w-20 h-14 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-[15px]">{car.name}</p>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{car.tag} · ${car.price}/day</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[var(--label)] uppercase tracking-wider font-semibold block">Pick-up Location</span>
                    <span className="font-medium text-[var(--ink)] text-sm">{confirmedBooking.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-[var(--label)] uppercase tracking-wider font-semibold block">Duration</span>
                    <span className="font-medium text-[var(--ink)] text-sm">{confirmedBooking.days} Day{confirmedBooking.days > 1 ? 's' : ''} ({new Date(confirmedBooking.pickupDate).toLocaleDateString()} to {new Date(confirmedBooking.returnDate).toLocaleDateString()})</span>
                  </div>
                  <div>
                    <span className="text-[var(--label)] uppercase tracking-wider font-semibold block">Driver License</span>
                    <span className="font-medium text-[var(--ink)]">{confirmedBooking.customerSnapshot.licenseNumber || 'Verified on Delivery'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--label)] uppercase tracking-wider font-semibold block">Total Paid</span>
                    <span className="font-display text-lg text-[var(--ink)]">${confirmedBooking.priceBreakdown.total}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Free doorstep VIP delivery & 24/7 Roadside Concierge included.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="btn-pill w-full sm:w-auto bg-[var(--dark)] text-white text-sm font-medium px-8 py-3 rounded-full btn-pill-dark"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-fade-in">
                  <span className="font-semibold">Notice:</span> {error}
                </div>
              )}

              {/* Car Banner */}
              <div className="bg-white rounded-2xl p-4 border border-black/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={car.img}
                    alt={car.name}
                    className="w-20 h-14 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-base leading-tight">{car.name}</p>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider mt-0.5">{car.brand} · {car.tag} · {car.seats} Seats</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-2xl leading-none text-[var(--ink)]">${car.price}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">/ day</p>
                </div>
              </div>

              {/* Grid 2 Column Form */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Column 1: Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-black/5">
                    <User className="w-4 h-4 text-[var(--muted)]" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Customer Details</h4>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5 border border-black/10 rounded-xl px-3.5 py-2.5 bg-white">
                      <User className="w-4 h-4 text-[var(--muted)]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sophia Laurent"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-sm bg-transparent outline-none w-full text-[var(--ink)] placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5 border border-black/10 rounded-xl px-3.5 py-2.5 bg-white">
                      <Mail className="w-4 h-4 text-[var(--muted)]" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. sophia@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-sm bg-transparent outline-none w-full text-[var(--ink)] placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2.5 bg-white">
                        <Phone className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="text-xs bg-transparent outline-none w-full text-[var(--ink)] placeholder:text-black/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                        Driver License #
                      </label>
                      <div className="flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2.5 bg-white">
                        <CreditCard className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <input
                          type="text"
                          placeholder="e.g. DL-893201"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          className="text-xs bg-transparent outline-none w-full text-[var(--ink)] placeholder:text-black/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                      Special Delivery Notes / Requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Complimentary water, child seat, specific flight arrival time..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-xs w-full border border-black/10 rounded-xl p-3 bg-white outline-none resize-none placeholder:text-black/30 text-[var(--ink)]"
                    />
                  </div>
                </div>

                {/* Column 2: Trip & Delivery Location */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-black/5">
                    <MapPin className="w-4 h-4 text-[var(--muted)]" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--label)]">Trip & Delivery</h4>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                      Pick-up Location / City <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5 border border-black/10 rounded-xl px-3.5 py-2.5 bg-white">
                      <MapPin className="w-4 h-4 text-[var(--muted)]" />
                      <input
                        type="text"
                        required
                        placeholder="Airport, Hotel, or City Location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="text-sm bg-transparent outline-none w-full text-[var(--ink)] placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                        Pick-up Date <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2.5 bg-white">
                        <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <input
                          type="date"
                          required
                          value={pickupDate}
                          onChange={(e) => handlePickupDateChange(e.target.value)}
                          className="text-xs bg-transparent outline-none w-full text-[var(--ink)] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2.5 bg-white">
                        <Clock className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <input
                          type="date"
                          required
                          value={returnDate}
                          onChange={(e) => handleReturnDateChange(e.target.value)}
                          className="text-xs bg-transparent outline-none w-full text-[var(--ink)] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--label)] mb-1.5 block">
                      Promo Code
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 border border-black/10 rounded-xl px-3 py-2 bg-white">
                        <Tag className="w-3.5 h-3.5 text-[var(--muted)]" />
                        <input
                          type="text"
                          placeholder="e.g. DRIVEO20"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="text-xs bg-transparent outline-none w-full text-[var(--ink)] uppercase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 20% promotional discount applied!
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div className="bg-white rounded-2xl p-4 border border-black/10 space-y-2 text-xs">
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Vehicle Rental (${car.price} × {days} day{days > 1 ? 's' : ''})</span>
                      <span className="font-medium text-[var(--ink)]">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Comprehensive Insurance ($25/day)</span>
                      <span className="font-medium text-[var(--ink)]">${insurance}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Promo Discount (20% OFF)</span>
                        <span>-${discount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-black/5 flex justify-between items-baseline">
                      <span className="font-bold text-[13px] uppercase tracking-wider text-[var(--ink)]">Estimated Total</span>
                      <span className="font-display text-2xl text-[var(--ink)]">${total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>No upfront deposit required · Free cancellation up to 24h before pick-up</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 rounded-full border border-black/10 text-xs font-semibold hover:bg-black/5 transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pill inline-flex items-center justify-center gap-2 bg-[var(--dark)] text-white text-sm font-medium px-8 py-3 rounded-full btn-pill-dark disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>Confirm Booking (${total})</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
