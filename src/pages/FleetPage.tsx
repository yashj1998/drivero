import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { cars, carTypes, type CarType } from '@/data/cars';

export function FleetPage() {
  const [activeType, setActiveType] = useState<CarType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('price-low');

  const filtered = useMemo(() => {
    let list = activeType === 'All' ? [...cars] : cars.filter((c) => c.tag === activeType);
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeType, sortBy]);

  return (
    <>
      {/* Header */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <Reveal>
          <p className="eyebrow mb-3">Our collection</p>
          <h1 className="font-display text-[48px] md:text-[72px] leading-none">THE FLEET</h1>
          <p className="mt-5 text-[var(--muted)] text-[15px] max-w-md leading-relaxed">
            Eight hand-picked vehicles, each maintained to factory standards. Filter by type, sort by price or rating, and find the one that speaks to you.
          </p>
        </Reveal>
      </section>

      {/* Filters */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-10">
        <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-black/10 py-5">
          {/* Type pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
            <FilterPill active={activeType === 'All'} onClick={() => setActiveType('All')}>
              All
            </FilterPill>
            {carTypes.map((t) => (
              <FilterPill key={t} active={activeType === t} onClick={() => setActiveType(t)}>
                {t}
              </FilterPill>
            ))}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((car, i) => (
            <Reveal
              key={car.slug}
              variant="scale"
              delay={(i % 4) as 0 | 1 | 2 | 3}
              as="article"
              className="group bg-[var(--card)] rounded-[24px] p-5 flex flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]"
            >
              <Link to={`/fleet/${car.slug}`} className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">{car.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mt-1">{car.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl leading-none">${car.price}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">/ day</p>
                  </div>
                </div>
                <div className="relative mt-2 flex-1 min-h-[140px] overflow-hidden rounded-[16px]">
                  <img src={car.img} alt={car.name} className="card-art w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">View details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--ink)]/60 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)] text-sm">
            No vehicles match this filter. Try another category.
          </div>
        )}
      </section>
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
          ? 'bg-[var(--dark)] text-white'
          : 'bg-[var(--card)] text-[var(--ink)]/70 hover:bg-[var(--card)]/60 hover:text-[var(--ink)]'
      }`}
    >
      {children}
    </button>
  );
}
