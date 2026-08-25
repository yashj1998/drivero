import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Check, AlertCircle, Loader2, Send, Clock, Shield } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PillButton } from '@/components/PillButton';
import { sendContactInquiry, type ContactFormData, type SendEmailResponse } from '@/services/emailService';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@driveo.com' },
  { icon: Phone, label: 'Phone', value: '+1 (415) 555-0192' },
  { icon: MapPin, label: 'Office', value: '100 Market St, San Francisco' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7' },
];

export function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SendEmailResponse | null>(null);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setErrorMessage(null);
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setStatus('error');
      setErrorMessage('Please enter both your first and last name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please write your message or question.');
      return;
    }

    setStatus('submitting');

    try {
      const response = await sendContactInquiry(formData);
      setResult(response);
      setStatus('success');
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong while sending your inquiry. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
    setStatus('idle');
    setErrorMessage(null);
    setResult(null);
  };

  return (
    <>
      {/* Header */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <Reveal>
          <p className="eyebrow mb-3">Get in touch</p>
          <h1 className="font-display text-[48px] md:text-[72px] leading-none">CONTACT US</h1>
          <p className="mt-5 text-[var(--muted)] text-[15px] max-w-md leading-relaxed">
            Questions about a booking, a special vehicle request, or our VIP concierge? Our team replies within a few hours.
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
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
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
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 items-stretch">
          {/* Form container */}
          <Reveal variant="scale" className="bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] p-8 md:p-10 flex flex-col justify-center">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[var(--ink)] text-white flex items-center justify-center mb-5 shadow-lg shadow-black/10">
                  <Check className="w-8 h-8 text-white" />
                </div>
                
                <span className="inline-block px-3 py-1 bg-[var(--card)] border border-black/5 rounded-full text-[11px] font-semibold text-[var(--muted)] mb-3 uppercase tracking-wider">
                  Ticket #{result?.referenceId || 'DRV-CONFIRMED'}
                </span>

                <h2 className="font-display text-3xl md:text-4xl mb-2 text-[var(--ink)]">INQUIRY RECEIVED</h2>
                
                <p className="text-[var(--muted)] text-sm max-w-md mb-6 leading-relaxed">
                  Thank you, <strong className="text-[var(--ink)]">{formData.firstName}</strong>. Your message has been routed to the Driveo Concierge team (<span className="text-[var(--ink)] font-medium">info.yashjoshi7355@gmail.com</span>).
                </p>

                {/* Submitted Details Recap */}
                <div className="w-full bg-[var(--card)]/60 border border-black/5 rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--label)] font-semibold">Inquiry Summary</span>
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Est. reply: &lt; 2 hrs
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <span className="text-[var(--label)] block font-medium">From:</span>
                      <span className="font-semibold text-[var(--ink)]">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div>
                      <span className="text-[var(--label)] block font-medium">Email:</span>
                      <span className="font-semibold text-[var(--ink)] break-all">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div>
                        <span className="text-[var(--label)] block font-medium">Phone:</span>
                        <span className="font-semibold text-[var(--ink)]">{formData.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-black/5 text-xs text-[var(--ink)]/80 italic line-clamp-3">
                    "{formData.message}"
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <PillButton onClick={handleReset} variant="dark">
                    Send Another Message
                  </PillButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="eyebrow">Send a message</p>
                  <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[var(--accent)]" /> Direct Concierge Route
                  </span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-start gap-3 text-sm animate-fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <div className="flex-1 leading-snug">{errorMessage}</div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="First name *"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(val) => handleChange('firstName', val)}
                    disabled={status === 'submitting'}
                    required
                  />
                  <InputField
                    label="Last name *"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(val) => handleChange('lastName', val)}
                    disabled={status === 'submitting'}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="Email address *"
                    placeholder="jane@example.com"
                    type="email"
                    value={formData.email}
                    onChange={(val) => handleChange('email', val)}
                    disabled={status === 'submitting'}
                    required
                  />
                  <InputField
                    label="Phone number (optional)"
                    placeholder="+1 (415) 555-0192"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(val) => handleChange('phone', val)}
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold block mb-2">
                    Message or Special Request *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the vehicle, dates, or custom services you need..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    disabled={status === 'submitting'}
                    required
                    className="w-full text-sm bg-[var(--card)]/50 rounded-2xl px-4 py-3 outline-none resize-none border border-transparent focus:border-[var(--ink)]/30 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <PillButton
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto justify-center min-w-[180px]"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Send Message
                      </>
                    )}
                  </PillButton>
                  <p className="text-xs text-[var(--muted)] text-center sm:text-right">
                    Automated email dispatch via Resend
                  </p>
                </div>
              </form>
            )}
          </Reveal>

          {/* Map / Showroom Panel */}
          <Reveal delay={1} variant="scale">
            <div className="hero-gradient rounded-[24px] overflow-hidden h-full min-h-[420px] relative shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)]">
              <img
                src="https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Driveo luxury interior"
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
                <span className="text-[11px] font-semibold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Showroom Open
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="eyebrow text-white/70 mb-2">Visit our flagship</p>
                <p className="font-display text-3xl leading-tight">SAN FRANCISCO<br />SHOWROOM</p>
                <p className="text-white/80 text-sm mt-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--accent)]" />
                  100 Market St · Open daily 9am–7pm
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Complimentary valet parking for test drive appointments.
                </p>
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

function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold block mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="w-full text-sm bg-[var(--card)]/50 rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-[var(--ink)]/30 focus:bg-white transition-all disabled:opacity-50"
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
