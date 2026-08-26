import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Check, Calendar, MapPin, Clock, ShieldCheck, Gauge, Cog, Fuel, Users } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillButton } from '@/components/PillButton';
import { BookingModal } from '@/components/BookingModal';
import { getCar as getLocalCar, cars as localCars } from '@/data/cars';
import { api, type CarItem } from '@/services/api';

const iconMap: Record<string, any> = {
  Gauge,
  Cog,
  Fuel,
  Users,
};

export function CarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarItem | undefined>(slug ? (getLocalCar(slug) as unknown as CarItem) : undefined);
  const [activeImg, setActiveImg] = useState(0);
  const [days, setDays] = useState(2);
  const [pickupLocation, setPickupLocation] = useState('Los Angeles International Airport (LAX)');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    const pDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const rDate = new Date(pDate.getTime() + days * 24 * 60 * 60 * 1000);
    setPickupDate(pDate.toISOString().split('T')[0]);
    setReturnDate(rDate.toISOString().split('T')[0]);
  }, []);

  // Fetch dynamic car data
  useEffect(() => {
    if (!slug) return;
    async function loadCar() {
      try {
        const res = await api.getCar(slug!);
        if (res.success && res.data) {
          setCar(res.data);
        }
      } catch (err) {
        console.warn('Using local fallback for car:', slug);
      }
    }
    loadCar();
  }, [slug]);

  if (!car) {
    return (
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-20 text-center">
        <p className="font-display text-4xl mb-4">VEHICLE NOT FOUND</p>
        <p className="text-[var(--muted)] text-sm mb-8">The car you're looking for isn't in our fleet.</p>
        <PillButton onClick={() => navigate('/fleet')}>Back to Fleet</PillButton>
      </section>
    );
  }

  const subtotal = car.price * days;
  const insurance = 25 * days;
  const total = subtotal + insurance;

  const related = localCars.filter((c) => c.slug !== car.slug && c.tag === car.tag).slice(0, 3);

  const handleOpenBooking = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-8">
        <Link to="/fleet" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </Link>
      </section>

      {/* Main */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-12">
          {/* Gallery */}
          <Reveal variant="scale">
            <div className="rounded-[28px] overflow-hidden bg-[var(--card)] aspect-[16/10] relative shadow-md">
              <img
                src={car.gallery?.[activeImg] || car.img}
                alt={car.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {car.isAvailable === false && (
                <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  Currently Rented
                </div>
              )}
            </div>
            {car.gallery && car.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {car.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-[16px] overflow-hidden aspect-[4/3] transition-all duration-300 ${
                      activeImg === i ? 'ring-2 ring-[var(--dark)] ring-offset-2 ring-offset-[var(--cream)]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          {/* Info */}
          <div>
            <Reveal>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow">{car.tag}</span>
                <span className="text-[var(--label)]">·</span>
                <span className="text-xs text-[var(--muted)]">{car.brand}</span>
              </div>
              <h1 className="font-display text-[40px] md:text-[52px] leading-none">{car.name.toUpperCase()}</h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(car.rating || 5) ? 'text-[var(--ink)] fill-[var(--ink)]' : 'text-[var(--label)]'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--muted)]">{car.rating || 5.0} · {car.seats || 2} seats</span>
              </div>
              <p className="mt-5 text-[var(--muted)] text-[15px] leading-relaxed">{car.description}</p>
            </Reveal>

            {/* Specs */}
            <Reveal delay={1} className="mt-8 grid grid-cols-2 gap-3">
              {car.specs && car.specs.map((s, idx) => {
                const IconComponent = typeof s.icon === 'string' ? (iconMap[s.icon] || Gauge) : (s.icon || Gauge);
                return (
                  <div key={idx} className="bg-[var(--card)] rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-[var(--ink)]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold">{s.label}</p>
                      <p className="text-sm font-medium">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </Reveal>

            {/* Features */}
            <Reveal delay={2} className="mt-8">
              <p className="eyebrow mb-4">What's included</p>
              <ul className="grid grid-cols-2 gap-2.5">
                {car.features && car.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[var(--ink)]/80">
                    <span className="w-5 h-5 rounded-full bg-[var(--card)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--ink)]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Booking bar */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <Reveal variant="scale" className="bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] p-6 md:p-8 border border-black/5">
          <div className="grid md:grid-cols-[1.2fr_1.2fr_auto_auto] gap-6 items-end">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Pick-up location</p>
              <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-4 py-3 bg-[var(--cream)]/30">
                <MapPin className="w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="City, hotel or airport"
                  className="text-sm bg-transparent outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Pick-up</p>
                <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-3 py-3 bg-[var(--cream)]/30">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="text-xs bg-transparent outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Return</p>
                <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-3 py-3 bg-[var(--cream)]/30">
                  <Clock className="w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="text-xs bg-transparent outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Days stepper */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Days</p>
              <div className="flex items-center gap-3 border border-black/10 rounded-2xl px-4 py-3 bg-[var(--cream)]/30">
                <button
                  type="button"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="text-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors px-1"
                >
                  −
                </button>
                <span className="text-sm font-medium w-6 text-center">{days}</span>
                <button
                  type="button"
                  onClick={() => setDays((d) => d + 1)}
                  className="text-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors px-1"
                >
                  +
                </button>
              </div>
            </div>

            <PillButton className="h-[52px] px-8" onClick={handleOpenBooking}>
              Book Now
            </PillButton>
          </div>

          {/* Price breakdown */}
          <div className="mt-6 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
              <span>${car.price}/day × {days} = ${subtotal}</span>
              <span>Insurance: ${insurance}</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Doorstep Delivery Included
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold">Total</span>
              <span className="font-display text-3xl">${total}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
          <Reveal className="mb-8">
            <p className="eyebrow mb-3">You might also like</p>
            <h2 className="font-display text-[32px] md:text-[38px] leading-none">SIMILAR RIDES</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {related.map((c, i) => (
              <Reveal
                key={c.slug}
                variant="scale"
                delay={(i + 1) as 1 | 2 | 3}
                as="article"
                className="group bg-[var(--card)] rounded-[24px] p-5 flex flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]"
              >
                <Link to={`/fleet/${c.slug}`} className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-[15px] leading-tight">{c.name}</p>
                      <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mt-1">{c.tag}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl leading-none">${c.price}</p>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">/ day</p>
                    </div>
                  </div>
                  <div className="relative mt-2 flex-1 min-h-[120px] overflow-hidden rounded-[16px]">
                    <img src={c.img} alt={c.name} className="card-art w-full h-full object-cover" loading="lazy" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        car={car}
        initialDays={days}
        initialLocation={pickupLocation}
        initialPickupDate={pickupDate}
        initialReturnDate={returnDate}
      />
    </>
  );
}
