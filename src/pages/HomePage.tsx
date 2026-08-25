import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillLink } from '@/components/PillButton';
import { SearchBar } from '@/components/SearchBar';
import { cars, features, avatars, heroCar, promoCar } from '@/data/cars';

export function HomePage() {
  return (
    <>
      {/* HERO */}
      <header className="relative">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-fade-up">
              <p className="eyebrow mb-5">Premium Car Rental</p>
              <h1 className="font-display text-[64px] md:text-[92px] leading-[0.85] tracking-tight">
                DRIVE THE<br />WORLD
              </h1>
              <p className="mt-6 text-[var(--muted)] text-[15px] max-w-sm leading-relaxed">
                Hand-picked luxury and performance vehicles, delivered to your door. No lines, no paperwork, no waiting.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <PillLink to="/fleet">Explore Fleet</PillLink>
                <Link to="/about" className="text-sm font-medium text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors link-underline">
                  How it works
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="hero-gradient rounded-[28px] overflow-hidden relative aspect-[4/3] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]">
                <img
                  src={heroCar}
                  alt="Luxury sports car"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -top-4 -right-2 md:-right-6 bg-white rounded-full pl-2 pr-5 py-2 flex items-center gap-3 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)]">
                <div className="flex -space-x-2">
                  {avatars.map((a, i) => (
                    <img
                      key={i}
                      src={a}
                      alt=""
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="font-display text-lg">10K+</p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1300px] mx-auto px-6 md:px-10 mt-8 md:mt-12">
          <SearchBar />
        </div>
      </header>

      {/* FEATURE STRIP */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="border-y border-black/10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i + 1) as 1 | 2 | 3 | 4} className="flex flex-col items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--card)] flex items-center justify-center transition-transform hover:scale-110">
                  <f.icon className="w-5 h-5 text-[var(--ink)]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-[13px] text-[var(--muted)] mt-0.5 leading-snug">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FLEET GRID */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">Choose your perfect ride</p>
            <h2 className="font-display text-[38px] md:text-[44px] leading-none">THE FLEET</h2>
          </div>
          <Link to="/fleet" className="text-sm font-medium text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1.5 link-underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {cars.slice(0, 8).map((car, i) => (
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
                <div className="relative mt-2 flex-1 min-h-[120px] overflow-hidden rounded-[16px]">
                  <img
                    src={car.img}
                    alt={car.name}
                    className="card-art w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal variant="scale" className="relative promo-gradient rounded-[28px] overflow-hidden">
          <img src={promoCar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-14 min-h-[340px]">
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-white/50 mb-4">Limited Time Offer</p>
              <h3 className="font-display text-[34px] md:text-[42px] text-white leading-[0.9]">
                GET 20% OFF<br />YOUR FIRST RIDE
              </h3>
              <p className="text-white/60 text-sm mt-4 max-w-xs">
                New members only. Apply the code at checkout and the discount is yours.
              </p>
              <div className="mt-7">
                <PillLink to="/fleet" variant="light">Claim Offer</PillLink>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-[22px] p-7 w-full max-w-sm">
                <p className="font-display text-[72px] md:text-[88px] text-white leading-none">20%</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">OFF FIRST BOOKING</p>

                <div className="mt-5 inline-flex items-center gap-2 border border-white/25 rounded-full px-4 py-2">
                  <span className="text-white/80 text-sm font-medium tracking-wider">DRIVEO20</span>
                  <span className="w-px h-4 bg-white/20" />
                  <span className="text-white/50 text-[11px] uppercase tracking-wider">Code</span>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-white/70 fill-white/70" />
                    <span className="text-white/70 text-xs">4.9 rating</span>
                  </div>
                  <div className="w-px h-3 bg-white/15" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-white/70 text-xs">Secure pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* LOGO STRIP */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal>
          <p className="eyebrow text-center mb-8">Trusted by leading brands</p>
          <div className="flex flex-wrap items-center justify-between gap-6 opacity-50 grayscale">
            {['Mercedes', 'BMW', 'Audi', 'Porsche', 'Range Rover'].map((b) => (
              <span key={b} className="font-display text-xl md:text-2xl tracking-wide text-[var(--ink)]/70">
                {b.toUpperCase()}
              </span>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
