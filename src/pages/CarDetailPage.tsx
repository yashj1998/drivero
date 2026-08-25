import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Check, Calendar, MapPin, Clock } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillButton } from '@/components/PillButton';
import { getCar, cars } from '@/data/cars';

export function CarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const car = slug ? getCar(slug) : undefined;
  const [activeImg, setActiveImg] = useState(0);
  const [days, setDays] = useState(1);

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

  const related = cars.filter((c) => c.slug !== car.slug && c.tag === car.tag).slice(0, 3);

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
            <div className="rounded-[28px] overflow-hidden bg-[var(--card)] aspect-[16/10] relative">
              <img
                src={car.gallery[activeImg]}
                alt={car.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
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
          </Reveal>

          {/* Info */}
          <div>
            <Reveal>
              <p className="eyebrow mb-3">{car.tag}</p>
              <h1 className="font-display text-[40px] md:text-[52px] leading-none">{car.name.toUpperCase()}</h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(car.rating) ? 'text-[var(--ink)] fill-[var(--ink)]' : 'text-[var(--label)]'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--muted)]">{car.rating} · {car.seats} seats</span>
              </div>
              <p className="mt-5 text-[var(--muted)] text-[15px] leading-relaxed">{car.description}</p>
            </Reveal>

            {/* Specs */}
            <Reveal delay={1} className="mt-8 grid grid-cols-2 gap-3">
              {car.specs.map((s) => (
                <div key={s.label} className="bg-[var(--card)] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-[var(--ink)]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold">{s.label}</p>
                    <p className="text-sm font-medium">{s.value}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Features */}
            <Reveal delay={2} className="mt-8">
              <p className="eyebrow mb-4">What's included</p>
              <ul className="grid grid-cols-2 gap-2.5">
                {car.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink)]/80">
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
        <Reveal variant="scale" className="bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] p-6 md:p-8">
          <div className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-6 items-end">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Pick-up location</p>
              <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-4 py-3">
                <MapPin className="w-4 h-4 text-[var(--muted)]" />
                <input type="text" placeholder="City or airport" className="text-sm bg-transparent outline-none w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Pick-up</p>
                <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-3 py-3">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <input type="date" className="text-sm bg-transparent outline-none w-full" />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Return</p>
                <div className="flex items-center gap-2 border border-black/10 rounded-2xl px-3 py-3">
                  <Clock className="w-4 h-4 text-[var(--muted)]" />
                  <input type="date" className="text-sm bg-transparent outline-none w-full" />
                </div>
              </div>
            </div>

            {/* Days stepper */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold mb-2">Days</p>
              <div className="flex items-center gap-3 border border-black/10 rounded-2xl px-4 py-3">
                <button onClick={() => setDays((d) => Math.max(1, d - 1))} className="text-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors">−</button>
                <span className="text-sm font-medium w-6 text-center">{days}</span>
                <button onClick={() => setDays((d) => d + 1)} className="text-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors">+</button>
              </div>
            </div>

            <PillButton className="h-[52px]" onClick={() => undefined}>
              Book Now
            </PillButton>
          </div>

          {/* Price breakdown */}
          <div className="mt-6 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
              <span>${car.price}/day × {days} = ${subtotal}</span>
              <span>Insurance: ${insurance}</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
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
    </>
  );
}
