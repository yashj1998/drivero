import { type ComponentProps } from 'react';
import { MapPin, Car, Calendar, Clock, ChevronDown } from 'lucide-react';

function Field({
  icon,
  label,
  placeholder,
  select,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  select?: boolean;
}) {
  return (
    <div className="p-3 md:px-5 md:py-3 flex items-center gap-3">
      <span className="text-[var(--muted)] shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--label)] font-semibold">{label}</p>
        {select ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--ink)] truncate">{placeholder}</p>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
          </div>
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            className="text-sm text-[var(--ink)] bg-transparent outline-none w-full placeholder:text-[var(--ink)]/40"
          />
        )}
      </div>
    </div>
  );
}

interface SearchBarProps extends ComponentProps<'div'> {}

export function SearchBar({ className = '', ...rest }: SearchBarProps) {
  return (
    <div className={`bg-white rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] p-2 md:p-3 ${className}`} {...rest}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-black/5">
        <Field icon={<MapPin className="w-4 h-4" />} label="Location" placeholder="City or airport" />
        <Field icon={<Car className="w-4 h-4" />} label="Car type" placeholder="Any" select />
        <Field icon={<Calendar className="w-4 h-4" />} label="Pick-up" placeholder="Add date" />
        <Field icon={<Clock className="w-4 h-4" />} label="Return" placeholder="Add date" />
        <div className="p-2 md:p-0 md:pl-3 flex items-center">
          <button className="btn-pill w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[var(--dark)] text-white text-sm font-medium px-6 py-3 rounded-[18px] btn-pill-dark">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
