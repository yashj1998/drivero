export interface CarSpec {
  icon: string;
  label: string;
  value: string;
}

export interface CarItem {
  _id?: string;
  slug: string;
  name: string;
  brand: string;
  tag: 'Sports' | 'Convertible' | 'Supercar' | 'Coupe' | 'SUV' | 'Luxury';
  price: number;
  img: string;
  gallery: string[];
  rating: number;
  seats: number;
  specs: CarSpec[];
  description: string;
  features: string[];
  isAvailable?: boolean;
  totalRentals?: number;
}

export interface BookingCustomer {
  name: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
}

export interface BookingPayload {
  carId?: string;
  carSlug?: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  pickupLocation: string;
  deliveryAddress?: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  promoCode?: string;
  notes?: string;
}

export interface BookingRecord {
  _id: string;
  bookingNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber?: string;
    address?: string;
  };
  customerSnapshot: BookingCustomer;
  car: {
    _id: string;
    name: string;
    slug: string;
    brand: string;
    img: string;
    price: number;
    tag: string;
    isAvailable?: boolean;
  };
  carSnapshot: {
    name: string;
    slug: string;
    brand: string;
    tag: string;
    pricePerDay: number;
    img: string;
  };
  pickupLocation: string;
  deliveryAddress?: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  priceBreakdown: {
    subtotal: number;
    insurance: number;
    discount: number;
    promoCode?: string;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  statusTimeline: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  kpis: {
    totalRevenue: number;
    avgOrderValue: number;
    avgRentalDays: number;
    totalBookings: number;
    activeRentals: number;
    inTransitCount: number;
    deliveredCount: number;
    completedCount: number;
    pendingCount: number;
    cancelledCount: number;
    totalCustomers: number;
    totalCars: number;
    availableCars: number;
    rentedCars: number;
    utilizationRate: number;
  };
  categoryStats: Array<{
    _id: string;
    bookingsCount: number;
    revenue: number;
  }>;
  carPerformance?: Array<{
    _id: string;
    tag: string;
    rentals: number;
    revenue: number;
    avgDays: number;
  }>;
  topCars: CarItem[];
  monthlyRevenue: Array<{
    name: string;
    period: string;
    revenue: number;
    insurance?: number;
    bookings: number;
  }>;
  durationDistribution?: Array<{
    name: string;
    bookings: number;
    percentage: number;
  }>;
  statusDistribution?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentBookings: BookingRecord[];
}

const rawApiUrl = (import.meta.env.VITE_API_URL as string) || '/api';
const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : (rawApiUrl === '/api' ? '/api' : `${rawApiUrl.replace(/\/$/, '')}/api`);

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('drivero_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Cars
  async getCars(params?: { tag?: string; sort?: string; search?: string; availableOnly?: boolean }): Promise<{ success: boolean; data: CarItem[] }> {
    const query = new URLSearchParams();
    if (params?.tag && params.tag !== 'All') query.append('tag', params.tag);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.search) query.append('search', params.search);
    if (params?.availableOnly) query.append('availableOnly', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; data: CarItem[] }>(`/cars${queryString}`);
  },

  async getCar(identifier: string): Promise<{ success: boolean; data: CarItem }> {
    return request<{ success: boolean; data: CarItem }>(`/cars/${identifier}`);
  },

  async createCar(carData: Partial<CarItem>): Promise<{ success: boolean; data: CarItem; message: string }> {
    return request<{ success: boolean; data: CarItem; message: string }>('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  async updateCar(id: string, carData: Partial<CarItem>): Promise<{ success: boolean; data: CarItem; message: string }> {
    return request<{ success: boolean; data: CarItem; message: string }>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  async deleteCar(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/cars/${id}`, {
      method: 'DELETE',
    });
  },

  // Bookings
  async createBooking(payload: BookingPayload): Promise<{ success: boolean; data: BookingRecord; message: string }> {
    return request<{ success: boolean; data: BookingRecord; message: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getBookings(params?: { status?: string; search?: string; page?: number; limit?: number }): Promise<{ success: boolean; data: BookingRecord[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; data: BookingRecord[]; total: number }>(`/bookings${queryString}`);
  },

  async getBooking(id: string): Promise<{ success: boolean; data: BookingRecord }> {
    return request<{ success: boolean; data: BookingRecord }>(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string, note?: string): Promise<{ success: boolean; data: BookingRecord; message: string }> {
    return request<{ success: boolean; data: BookingRecord; message: string }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  async deleteBooking(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Customers
  async getCustomers(params?: { search?: string; page?: number; limit?: number }): Promise<{ success: boolean; data: CustomerRecord[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; data: CustomerRecord[]; total: number }>(`/customers${queryString}`);
  },

  async getCustomer(id: string): Promise<{ success: boolean; data: { customer: CustomerRecord; bookings: BookingRecord[] } }> {
    return request<{ success: boolean; data: { customer: CustomerRecord; bookings: BookingRecord[] } }>(`/customers/${id}`);
  },

  // Analytics
  async getAnalytics(): Promise<{ success: boolean; data: AnalyticsData }> {
    return request<{ success: boolean; data: AnalyticsData }>('/analytics');
  },

  // Admin Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{ success: boolean; token: string; user: any; message?: string }> {
    return request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getAdminMe(): Promise<{ success: boolean; user: any }> {
    return request<{ success: boolean; user: any }>('/auth/me');
  },
};
