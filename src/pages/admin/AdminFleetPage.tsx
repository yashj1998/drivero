import { useState, useEffect } from 'react';
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Gauge,
  Cog,
  Fuel,
  Users,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, type CarItem } from '@/services/api';
import { carTypes } from '@/data/cars';

export function AdminFleetPage() {
  const [fleet, setFleet] = useState<CarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarItem | null>(null);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Mercedes');
  const [tag, setTag] = useState<CarItem['tag']>('Sports');
  const [price, setPrice] = useState(250);
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(4.9);
  const [seats, setSeats] = useState(2);
  const [featuresText, setFeaturesText] = useState('Nappa Leather, Surround Sound, Carbon Spoiler, Heated Seats');
  const [zeroToSixty, setZeroToSixty] = useState('3.2s');
  const [transmission, setTransmission] = useState('7-speed auto');
  const [fuel, setFuel] = useState('Premium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchFleet = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCars();
      if (res.success) {
        setFleet(res.data);
      }
    } catch (err) {
      console.error('Error fetching fleet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const openAddModal = () => {
    setEditingCar(null);
    setName('');
    setBrand('Mercedes');
    setTag('Sports');
    setPrice(250);
    setImg('https://images.pexels.com/photos/7662147/pexels-photo-7662147.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
    setDescription('High-performance luxury grand tourer with handcrafted engine and aerodynamic body.');
    setRating(4.9);
    setSeats(2);
    setFeaturesText('Handcrafted Leather, Surround Sound, Carbon Ceramic Brakes, Active Aero');
    setZeroToSixty('3.2s');
    setTransmission('Automatic');
    setFuel('Premium');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (car: CarItem) => {
    setEditingCar(car);
    setName(car.name);
    setBrand(car.brand);
    setTag(car.tag);
    setPrice(car.price);
    setImg(car.img);
    setDescription(car.description);
    setRating(car.rating || 4.9);
    setSeats(car.seats || 2);
    setFeaturesText(car.features ? car.features.join(', ') : '');
    const gSpec = car.specs?.find((s) => s.label.includes('0–60') || s.label.includes('Speed'))?.value || '3.5s';
    const tSpec = car.specs?.find((s) => s.label.includes('Transmission'))?.value || 'Automatic';
    const fSpec = car.specs?.find((s) => s.label.includes('Fuel'))?.value || 'Premium';
    setZeroToSixty(gSpec);
    setTransmission(tSpec);
    setFuel(fSpec);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleToggleAvailability = async (car: CarItem) => {
    if (!car._id) return;
    try {
      await api.updateCar(car._id, {
        isAvailable: !car.isAvailable,
      });
      await fetchFleet();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle vehicle availability');
    }
  };

  const handleDeleteCar = async (car: CarItem) => {
    if (!car._id) return;
    if (!confirm(`Are you sure you want to remove ${car.name} from the fleet database?`)) return;
    try {
      await api.deleteCar(car._id);
      await fetchFleet();
    } catch (err: any) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !brand.trim() || !img.trim() || !description.trim()) {
      setFormError('Please fill in all required vehicle details.');
      return;
    }

    setIsSubmitting(true);

    const payload: Partial<CarItem> = {
      name: name.trim(),
      brand: brand.trim(),
      tag,
      price: Number(price),
      img: img.trim(),
      gallery: [img.trim()],
      rating: Number(rating),
      seats: Number(seats),
      description: description.trim(),
      features: featuresText.split(',').map((f) => f.trim()).filter(Boolean),
      specs: [
        { icon: 'Gauge', label: '0–60 mph', value: zeroToSixty },
        { icon: 'Cog', label: 'Transmission', value: transmission },
        { icon: 'Fuel', label: 'Fuel', value: fuel },
        { icon: 'Users', label: 'Seats', value: `${seats}` },
      ],
    };

    try {
      if (editingCar && editingCar._id) {
        await api.updateCar(editingCar._id, payload);
      } else {
        await api.createCar(payload);
      }
      setIsAddModalOpen(false);
      await fetchFleet();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Fleet Operations</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">FLEET INVENTORY</h1>
        </div>

        <button
          onClick={openAddModal}
          className="btn-pill inline-flex items-center gap-2 bg-[var(--dark)] text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-md btn-pill-dark"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Fleet Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-[var(--muted)] text-sm bg-white rounded-[28px] border border-black/10">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
          Loading fleet inventory from MongoDB...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {fleet.map((car) => (
            <div
              key={car.slug}
              className="bg-white rounded-[24px] p-5 border border-black/10 shadow-sm flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--label)] tracking-wider">{car.brand}</span>
                    <h3 className="font-semibold text-base text-[var(--ink)] leading-tight">{car.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl text-[var(--ink)] leading-none">${car.price}</span>
                    <span className="text-[10px] text-[var(--muted)] block">/ day</span>
                  </div>
                </div>

                {/* Car Photo */}
                <div className="relative min-h-[140px] rounded-xl overflow-hidden my-3 bg-black/5">
                  <img src={car.img} alt={car.name} className="w-full h-36 object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/70 backdrop-blur-sm text-white">
                      {car.tag}
                    </span>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--muted)] mb-3">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {car.rating} Rating</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {car.seats} Seats</span>
                  <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {car.totalRentals || 0} Total Rentals</span>
                  <span className="flex items-center gap-1">
                    {car.isAvailable !== false ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5"><Check className="w-3 h-3" /> Available</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Rented / Out</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(car)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-colors ${
                    car.isAvailable !== false
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {car.isAvailable !== false ? 'Mark Rented' : 'Set Available'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(car)}
                    className="p-2 rounded-xl bg-[var(--card)] hover:bg-black/10 text-[var(--ink)] transition-colors"
                    title="Edit vehicle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--cream)] rounded-[28px] max-w-2xl w-full border border-black/10 shadow-2xl p-6 sm:p-8 space-y-5 animate-fade-up my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <span className="eyebrow">Fleet Customization</span>
                <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
                  {editingCar ? `EDIT ${editingCar.name.toUpperCase()}` : 'ADD NEW LUXURY VEHICLE'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Car Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aston Martin DB12"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Brand Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aston Martin, Ferrari, Porsche"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Category Tag *
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as CarItem['tag'])}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs outline-none cursor-pointer"
                  >
                    {carTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Daily Rate ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                  Image URL (High-Res JPG/PNG) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.pexels.com/..."
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    0–60 Acceleration
                  </label>
                  <input
                    type="text"
                    value={zeroToSixty}
                    onChange={(e) => setZeroToSixty(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Transmission
                  </label>
                  <input
                    type="text"
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                    Fuel / Engine Type
                  </label>
                  <input
                    type="text"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl p-3 text-xs outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[10px] uppercase tracking-wider text-[var(--label)] mb-1 block">
                  Included Features (comma separated)
                </label>
                <input
                  type="text"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-black/10 text-xs font-semibold hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill bg-[var(--dark)] text-white text-xs font-semibold px-7 py-2.5 rounded-full btn-pill-dark disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</span>
                  ) : (
                    <span>{editingCar ? 'Update Vehicle' : 'Save to Fleet'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
