import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Headset, Wallet, Car, Award, Users, Globe, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillLink } from '@/components/PillButton';
import { heroCar } from '@/data/cars';

const stats = [
  { icon: Users, value: '10K+', label: 'Happy Customers' },
  { icon: Car, value: '120+', label: 'Vehicles Available' },
  { icon: Globe, value: '25', label: 'Cities Worldwide' },
  { icon: Award, value: '4.9', label: 'Average Rating' },
];

const values = [
  { icon: ShieldCheck, title: 'Safety First', text: 'Every car is inspected before and after each rental. No exceptions.' },
  { icon: Wallet, title: 'Radical Transparency', text: 'The price you see is the price you pay. No hidden fees, ever.' },
  { icon: Headset, title: 'Human Concierge', text: 'Real people, available around the clock, wherever the road takes you.' },
  { icon: TrendingUp, title: 'Curated, Not Crowded', text: 'A focused fleet of exceptional cars — not every car, just the right ones.' },
];

const milestones = [
  { year: '2019', text: 'Driveo launches with 12 cars in a single city.' },
  { year: '2021', text: 'Expanded to 10 cities and crossed 5,000 rentals.' },
  { year: '2023', text: 'Introduced door-to-door delivery and 24/7 concierge.' },
  { year: '2026', text: 'Now serving 25 cities with a fleet of 120+ vehicles.' },
];

export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Reveal>
            <p className="eyebrow mb-5">Our Story</p>
            <h1 className="font-display text-[52px] md:text-[80px] leading-[0.85]">
              WE BELIEVE<br />THE DRIVE<br />IS THE<br />DESTINATION
            </h1>
          </Reveal>
          <Reveal variant="scale" delay={1}>
            <div className="hero-gradient rounded-[28px] overflow-hidden aspect-[4/3] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]">
              <img src={heroCar} alt="Luxury car" className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Intro text */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="max-w-2xl">
          <p className="text-[var(--ink)] text-[18px] md:text-[22px] leading-[1.5] font-light">
            Driveo started with a simple frustration: renting a great car was harder than it needed to be. Endless paperwork, surprise fees, and a fleet that felt like an afterthought. So we built the opposite — a focused collection of exceptional vehicles, delivered to your door, with a price that never changes.
          </p>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="border-y border-black/10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={(i + 1) as 1 | 2 | 3 | 4} className="flex flex-col items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--card)] flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[var(--ink)]" />
                </div>
                <div>
                  <p className="font-display text-3xl leading-none">{s.value}</p>
                  <p className="text-[12px] uppercase tracking-wider text-[var(--muted)] mt-2">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">What drives us</p>
          <h2 className="font-display text-[38px] md:text-[44px] leading-none">OUR PRINCIPLES</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={(i % 2 + 1) as 1 | 2}
              className="bg-[var(--card)] rounded-[24px] p-7 flex items-start gap-5 transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                <v.icon className="w-5 h-5 text-[var(--ink)]" />
              </div>
              <div>
                <p className="font-semibold text-base mb-1.5">{v.title}</p>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">The road so far</p>
          <h2 className="font-display text-[38px] md:text-[44px] leading-none">OUR JOURNEY</h2>
        </Reveal>
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-px bg-black/10 hidden md:block" />
          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={(i + 1) as 1 | 2 | 3 | 4} className="relative">
                <div className="w-3 h-3 rounded-full bg-[var(--dark)] absolute -top-1.5 left-0 hidden md:block" />
                <p className="font-display text-2xl mb-2">{m.year}</p>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">{m.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal variant="scale" className="promo-gradient rounded-[28px] p-10 md:p-16 text-center">
          <h3 className="font-display text-[34px] md:text-[52px] text-white leading-[0.9]">READY TO DRIVE?</h3>
          <p className="text-white/60 text-sm mt-4 max-w-md mx-auto">
            Explore our fleet and find the car that turns the journey into the best part of the trip.
          </p>
          <div className="mt-8 flex justify-center">
            <PillLink to="/fleet" variant="light">Browse the Fleet</PillLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
