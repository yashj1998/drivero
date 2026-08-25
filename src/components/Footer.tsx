import { Link } from 'react-router-dom';

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="max-w-[1300px] mx-auto px-6 md:px-10 mt-20 md:mt-28 pb-10">
      <div className="border-t border-black/10 pt-10 grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
        <div>
          <Link to="/" className="flex items-center gap-1.5 mb-4">
            <span className="font-display text-2xl tracking-wide">DRIVEO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-3" />
          </Link>
          <p className="text-[var(--muted)] text-sm max-w-xs leading-relaxed">
            Premium car rental for people who want the drive to feel as good as the destination.
          </p>
        </div>

        <FooterCol
          title="Company"
          links={[
            { label: 'About', to: '/about' },
            { label: 'Fleet', to: '/fleet' },
            { label: 'Careers', to: '/about' },
            { label: 'Press', to: '/about' },
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            { label: 'Help Center', to: '/contact' },
            { label: 'Contact', to: '/contact' },
            { label: 'Insurance', to: '/about' },
            { label: 'FAQ', to: '/contact' },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: 'Privacy', to: '/about' },
            { label: 'Terms', to: '/about' },
            { label: 'Cookies', to: '/about' },
            { label: 'Licenses', to: '/about' },
          ]}
        />
      </div>

      <div className="mt-10 pt-6 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[var(--muted)]">© 2026 Driveo. All rights reserved.</p>
        <p className="text-xs text-[var(--muted)]">Designed in the spirit of the open road.</p>
      </div>
    </footer>
  );
}
