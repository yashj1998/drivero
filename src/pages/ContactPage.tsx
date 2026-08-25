import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Check } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillButton } from '@/components/PillButton';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@driveo.com' },
  { icon: Phone, label: 'Phone', value: '+1 (415) 555-0192' },
  { icon: MapPin, label: 'Office', value: '100 Market St, San Francisco' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7' },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* Header */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <Reveal>
          <p className="eyebrow mb-3">Get in touch</p>
          <h1 className="font-display text-[48px] md:text-[72px] leading-none">CONTACT US</h1>
          <p className="mt-5 text-[var(--muted)] text-[15px] max-w-md leading-relaxed">
            Questions about a booking, a special request, or a long-term rental? Our team replies within a few hours.
          </p>
        </Reveal>
      </section>

      {/* Contact info cards */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((c, i) => (
            <Reveal
              key={c.label}
              delay={(i + 1) as 1 | 2 | 3 | 4}
              className="bg-[var(--card)] rounded-[20px] p-5 flex flex-col gap-3 transition-transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <c.icon className="w-4 h-4 text-[var(--ink)]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold">{c.label}</p>
                <p className="text-sm font-medium mt-1">{c.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 md:gap-8">
          {/* Form */}
          <Reveal variant="scale" className="bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--card)] flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-[var(--ink)]" />
                </div>
                <p className="font-display text-3xl mb-2">MESSAGE SENT</p>
                <p className="text-[var(--muted)] text-sm max-w-xs">
                  Thanks for reaching out. Our team will get back to you within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-medium text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors link-underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <p className="eyebrow mb-6">Send a message</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="First name" placeholder="Jane" />
                  <Input label="Last name" placeholder="Doe" />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Input label="Email" placeholder="jane@email.com" type="email" />
                  <Input label="Phone" placeholder="+1 415 555 0192" type="tel" />
                </div>
                <div className="mt-4">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold block mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what you need..."
                    className="w-full text-sm bg-[var(--card)]/50 rounded-2xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[var(--ink)]/20 transition-colors"
                  />
                </div>
                <div className="mt-6">
                  <PillButton type="submit" className="w-full md:w-auto justify-center">
                    Send Message
                  </PillButton>
                </div>
              </form>
            )}
          </Reveal>

          {/* Map / image panel */}
          <Reveal delay={1} variant="scale">
            <div className="hero-gradient rounded-[24px] overflow-hidden h-full min-h-[400px] relative">
              <img
                src="https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Car interior"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="eyebrow text-white/60 mb-2">Visit our flagship</p>
                <p className="font-display text-2xl text-white leading-tight">SAN FRANCISCO<br />SHOWROOM</p>
                <p className="text-white/60 text-sm mt-2">100 Market St · Open daily 9am–7pm</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 mt-16 md:mt-24">
        <Reveal className="mb-8">
          <p className="eyebrow mb-3">Quick answers</p>
          <h2 className="font-display text-[32px] md:text-[38px] leading-none">FAQ</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={(i % 2 + 1) as 1 | 2} className="bg-[var(--card)] rounded-[20px] p-6">
              <p className="font-semibold text-sm mb-2">{f.q}</p>
              <p className="text-[14px] text-[var(--muted)] leading-relaxed">{f.a}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function Input({
  label,
  placeholder,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold block mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full text-sm bg-[var(--card)]/50 rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-[var(--ink)]/20 transition-colors"
      />
    </div>
  );
}

const faqs = [
  { q: 'How do I book a car?', a: 'Browse the fleet, pick a car, choose your dates, and confirm. You\'ll receive an email within minutes.' },
  { q: 'Is insurance included?', a: 'Yes — every rental comes with comprehensive coverage. Additional premium insurance is available at checkout.' },
  { q: 'Can I cancel my booking?', a: 'Free cancellation up to 48 hours before pick-up. After that, a small fee may apply.' },
  { q: 'Do you deliver?', a: 'We offer free door-to-door delivery within the city. Airport deliveries are available for a flat fee.' },
  { q: 'What documents do I need?', a: 'A valid driver\'s license and a credit card in the driver\'s name. That\'s it — no extra paperwork.' },
  { q: 'Is there a mileage limit?', a: 'Most rentals include 200 miles per day. Unlimited mileage is available on select vehicles.' },
];
