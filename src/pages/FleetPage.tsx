import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { BookingModal } from '@/components/BookingModal';
import { cars as initialLocalCars, carTypes, type CarType } from '@/data/cars';
import { api, type CarItem } from '@/services/api';

export function FleetPage() {
  const [activeType, setActiveType] = useState<CarType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('price-low');
  const [fleetList, setFleetList] = useState<CarItem[]>(initialLocalCars as unknown as CarItem[]);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<CarItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadCars() {
      try {
        const res = await api.getCars();
        if (res.success && res.data && res.data.length > 0) {
          setFleetList(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using local cars data:', err);
      }
    }
    loadCars();
  }, []);

  const filtered = useMemo(() => {
    let list = activeType === 'All' ? [...fleetList] : fleetList.filter((c) => c.tag === activeType);
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeType, sortBy, fleetList]);

  const handleOpenBooking = (car: CarItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedCarForBooking(car);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Header */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Our collection</p>
              <h1 className="font-display text-[48px] md:text-[72px] leading-none">THE FLEET</h1>
              <p className="mt-5 text-[var(--muted)] text-[15px] max-w-md leading-relaxed">
                Hand-picked luxury and high-performance vehicles, each maintained to factory standards. Book online instantly and have your car delivered to your door.
              </p>
            </div>

            <div className="bg-[var(--card)] border border-black/5 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span>Use code <strong className="text-[var(--ink)] font-semibold">DRIVEO20</strong> at checkout for 20% off your first ride</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Filters */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-10">
        <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-black/10 py-5">
          {/* Type pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
            <FilterPill active={activeType === 'All'} onClick={() => setActiveType('All')}>
              All ({fleetList.length})
            </FilterPill>
            {carTypes.map((t) => {
              const count = fleetList.filter((c) => c.tag === t).length;
              return (
                <FilterPill key={t} active={activeType === t} onClick={() => setActiveType(t)}>
                  {t} {count > 0 && `(${count})`}
                </FilterPill>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[var(--muted)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm font-medium bg-transparent outline-none cursor-pointer text-[var(--ink)]"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-8 md:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((car, i) => (
            <Reveal
              key={car.slug || i}
              variant="scale"
              delay={(i % 4) as 0 | 1 | 2 | 3}
              as="article"
              className="group bg-[var(--card)] rounded-[24px] p-5 flex flex-col overflow-hidden transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]"
            >
              <Link to={`/fleet/${car.slug}`} className="flex flex-col flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-[15px] leading-tight group-hover:text-[var(--accent)] transition-colors">{car.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mt-1">{car.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl leading-none">${car.price}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">/ day</p>
                  </div>
                </div>

                <div className="relative mt-2 min-h-[140px] overflow-hidden rounded-[16px] bg-black/5">
                  <img src={car.img} alt={car.name} className="card-art w-full h-[150px] object-cover" loading="lazy" />
                  {car.isAvailable === false && (
                    <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                      Currently Rented
                    </div>
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                <Link
                  to={`/fleet/${car.slug}`}
                  className="text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
                >
                  Details <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleOpenBooking(car, e)}
                  className="btn-pill inline-flex items-center gap-1.5 bg-[var(--dark)] text-white text-xs font-medium px-4 py-2 rounded-full btn-pill-dark"
                >
                  Book Now
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)] text-sm">
            No vehicles match this filter. Try another category.
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={selectedCarForBooking}
      />
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 ${
        active
          ? 'bg-[var(--dark)] text-white shadow-sm'
          : 'bg-[var(--card)] text-[var(--ink)]/70 hover:bg-[var(--card)]/60 hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  );
}
