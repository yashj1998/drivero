import { Car } from '../models/Car.js';
import { AdminUser } from '../models/AdminUser.js';
import { Customer } from '../models/Customer.js';
import { Booking } from '../models/Booking.js';

const initialCars = [
  {
    slug: 'mercedes-amg-gt',
    name: 'Mercedes AMG GT',
    brand: 'Mercedes',
    tag: 'Sports',
    price: 240,
    img: 'https://images.pexels.com/photos/7662147/pexels-photo-7662147.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/7662147/pexels-photo-7662147.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/16124126/pexels-photo-16124126.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4274827/pexels-photo-4274827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.9,
    seats: 2,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '3.1s' },
      { icon: 'Cog', label: 'Transmission', value: '7-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '2' },
    ],
    description:
      'A hand-built twin-turbo V8 wrapped in a long-hood grand tourer silhouette. The AMG GT blends track-bred aggression with everyday comfort — sculpted side intakes, a deep front splitter, and a cabin that wraps around the driver.',
    features: ['Hand-stitched Nappa leather', 'Burmester 3D surround sound', 'Active rear spoiler', 'AMG ride control suspension'],
    isAvailable: true,
    totalRentals: 18,
  },
  {
    slug: 'bmw-z4-roadster',
    name: 'BMW Z4 Roadster',
    brand: 'BMW',
    tag: 'Convertible',
    price: 190,
    img: 'https://images.pexels.com/photos/14022454/pexels-photo-14022454.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/14022454/pexels-photo-14022454.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/93615/pexels-photo-93615.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/1030766/pexels-photo-1030766.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.8,
    seats: 2,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '4.4s' },
      { icon: 'Cog', label: 'Transmission', value: '8-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '2' },
    ],
    description:
      'Open-top freedom with a turbocharged inline-six. The Z4 Roadster delivers a perfectly balanced chassis, a folding soft-top that opens in 10 seconds, and a cockpit tuned for the pure joy of driving.',
    features: ['10-second power soft-top', 'Adaptive M suspension', 'Harman Kardon audio', 'Wireless Apple CarPlay'],
    isAvailable: true,
    totalRentals: 14,
  },
  {
    slug: 'audi-r8-v10',
    name: 'Audi R8 V10',
    brand: 'Audi',
    tag: 'Supercar',
    price: 320,
    img: 'https://images.pexels.com/photos/33453087/pexels-photo-33453087.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/33453087/pexels-photo-33453087.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/33907041/pexels-photo-33907041.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10274125/pexels-photo-10274125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 5.0,
    seats: 2,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '2.6s' },
      { icon: 'Cog', label: 'Transmission', value: '7-speed DCT' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '2' },
    ],
    description:
      'A naturally aspirated V10 mounted behind the driver, a carbon-fiber cockpit, and the kind of exhaust note that turns every tunnel into a concert. The R8 is the everyday supercar.',
    features: ['Naturally aspirated V10', 'Carbon fiber monocoque', 'Virtual Cockpit display', 'Magnetic ride control'],
    isAvailable: true,
    totalRentals: 24,
  },
  {
    slug: 'porsche-911-carrera',
    name: 'Porsche 911 Carrera',
    brand: 'Porsche',
    tag: 'Coupe',
    price: 280,
    img: 'https://images.pexels.com/photos/439405/pexels-photo-439405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/439405/pexels-photo-439405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/17017141/pexels-photo-17017141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/20695256/pexels-photo-20695256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.9,
    seats: 4,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '3.5s' },
      { icon: 'Cog', label: 'Transmission', value: '8-speed PDK' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '4' },
    ],
    description:
      'The icon. Sixty years of rear-engine evolution distilled into one timeless silhouette. The 911 Carrera is precise, composed, and endlessly rewarding — a car that feels alive at every speed.',
    features: ['PDK dual-clutch transmission', 'Sport Chrono Package', 'BOSE surround sound', 'Adaptive sport seats'],
    isAvailable: true,
    totalRentals: 29,
  },
  {
    slug: 'range-rover-sport',
    name: 'Range Rover Sport',
    brand: 'Range Rover',
    tag: 'SUV',
    price: 210,
    img: 'https://images.pexels.com/photos/4639907/pexels-photo-4639907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/4639907/pexels-photo-4639907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/18231626/pexels-photo-18231626.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/13512047/pexels-photo-13512047.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.7,
    seats: 5,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '5.1s' },
      { icon: 'Cog', label: 'Transmission', value: '8-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Diesel' },
      { icon: 'Users', label: 'Seats', value: '5' },
    ],
    description:
      'Commanding presence meets genuine capability. The Range Rover Sport glides over rough roads on adaptive air suspension, with a cabin so quiet you can hear yourself think.',
    features: ['Air suspension', 'Meridian surround sound', 'Heated and cooled seats', 'Terrain Response 2'],
    isAvailable: true,
    totalRentals: 16,
  },
  {
    slug: 'mercedes-s-class',
    name: 'Mercedes S-Class',
    brand: 'Mercedes',
    tag: 'Luxury',
    price: 260,
    img: 'https://images.pexels.com/photos/20123634/pexels-photo-20123634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/20123634/pexels-photo-20123634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/15264253/pexels-photo-15264253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4274827/pexels-photo-4274827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.9,
    seats: 5,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '4.4s' },
      { icon: 'Cog', label: 'Transmission', value: '9-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '5' },
    ],
    description:
      'The benchmark of the luxury sedan. Massaging seats, a 3D driver display, and an interior that feels like a private lounge on wheels. The S-Class redefines what a car can be.',
    features: ['Massaging executive seats', 'Burmester 4D sound', 'MBUX hyperscreen', 'Rear-axle steering'],
    isAvailable: true,
    totalRentals: 21,
  },
  {
    slug: 'audi-s5-coupe',
    name: 'Audi S5 Coupe',
    brand: 'Audi',
    tag: 'Coupe',
    price: 170,
    img: 'https://images.pexels.com/photos/7126210/pexels-photo-7126210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/7126210/pexels-photo-7126210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10987310/pexels-photo-10987310.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10626380/pexels-photo-10626380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.6,
    seats: 4,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '4.5s' },
      { icon: 'Cog', label: 'Transmission', value: '8-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '4' },
    ],
    description:
      "A turbocharged V6 with quattro all-wheel drive in a sharp, understated coupe body. The S5 is the thinking driver's choice — fast, composed, and effortlessly capable.",
    features: ['quattro all-wheel drive', 'Virtual Cockpit Plus', 'Bang & Olufsen audio', 'Adaptive cruise assist'],
    isAvailable: true,
    totalRentals: 12,
  },
  {
    slug: 'bmw-8-series',
    name: 'BMW 8 Series',
    brand: 'BMW',
    tag: 'Convertible',
    price: 230,
    img: 'https://images.pexels.com/photos/11588669/pexels-photo-11588669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/11588669/pexels-photo-11588669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/11588676/pexels-photo-11588676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/11588678/pexels-photo-11588678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    rating: 4.8,
    seats: 4,
    specs: [
      { icon: 'Gauge', label: '0–60 mph', value: '3.9s' },
      { icon: 'Cog', label: 'Transmission', value: '8-speed auto' },
      { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
      { icon: 'Users', label: 'Seats', value: '4' },
    ],
    description:
      'A grand tourer reborn. The 8 Series Convertible pairs a muscular twin-turbo V8 with a wind-deflecting soft-top, so four adults can enjoy top-down cruising at any speed.',
    features: ['Two-stage soft-top', 'xDrive all-wheel drive', 'Bowers & Wilkins audio', 'Gesture control'],
    isAvailable: true,
    totalRentals: 19,
  },
];

export async function seedDatabase() {
  try {
    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@drivero.com';
    const existingAdmin = await AdminUser.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      console.log(`[Seed] Creating default Admin user: ${adminEmail}`);
      const admin = new AdminUser({
        name: 'Driveo Super Admin',
        email: adminEmail.toLowerCase(),
        password: 'admin123', // Will be hashed by model hook
        role: 'superadmin',
      });
      await admin.save();
      console.log(`[Seed] Default Admin created successfully (Password: admin123)`);
    }

    // Also ensure admin@drivero.com exists for easy demo login
    const demoAdmin = await AdminUser.findOne({ email: 'admin@drivero.com' });
    if (!demoAdmin && adminEmail.toLowerCase() !== 'admin@drivero.com') {
      const demo = new AdminUser({
        name: 'Driveo Admin',
        email: 'admin@drivero.com',
        password: 'admin123',
        role: 'admin',
      });
      await demo.save();
      console.log(`[Seed] Demo Admin created (admin@drivero.com / admin123)`);
    }

    // 2. Seed Cars
    const carsCount = await Car.countDocuments();
    let seededCars = [];
    if (carsCount === 0) {
      console.log('[Seed] Seeding initial fleet of 8 cars into MongoDB drivero...');
      seededCars = await Car.insertMany(initialCars);
      console.log(`[Seed] Seeded ${seededCars.length} cars successfully.`);
    } else {
      seededCars = await Car.find();
    }

    // 3. Seed Sample Customers & Bookings if none exist
    const bookingsCount = await Booking.countDocuments();
    if (bookingsCount === 0 && seededCars.length > 0) {
      console.log('[Seed] Seeding realistic initial customer & booking history for analytics...');
      
      const sampleCustomers = [
        {
          name: 'Alexander Wright',
          email: 'alex.wright@example.com',
          phone: '+1 (555) 234-8901',
          licenseNumber: 'DL-NY-893021',
          address: '742 Evergreen Terrace, New York, NY',
          city: 'New York',
          totalBookings: 2,
          totalSpent: 1640,
        },
        {
          name: 'Sophia Laurent',
          email: 'sophia.laurent@example.com',
          phone: '+1 (555) 872-4419',
          licenseNumber: 'DL-CA-920184',
          address: '450 Ocean Drive, Miami, FL',
          city: 'Miami',
          totalBookings: 1,
          totalSpent: 960,
        },
        {
          name: 'Marcus Vance',
          email: 'marcus.vance@example.com',
          phone: '+1 (555) 612-9034',
          licenseNumber: 'DL-TX-551029',
          address: '1200 Grand Ave, Austin, TX',
          city: 'Austin',
          totalBookings: 1,
          totalSpent: 750,
        },
      ];

      const createdCustomers = await Customer.insertMany(sampleCustomers);

      const porsche = seededCars.find(c => c.slug === 'porsche-911-carrera') || seededCars[0];
      const audi = seededCars.find(c => c.slug === 'audi-r8-v10') || seededCars[1];
      const amg = seededCars.find(c => c.slug === 'mercedes-amg-gt') || seededCars[2];

      const sampleBookings = [
        {
          bookingNumber: 'DRV-94821',
          customer: createdCustomers[0]._id,
          customerSnapshot: {
            name: createdCustomers[0].name,
            email: createdCustomers[0].email,
            phone: createdCustomers[0].phone,
            licenseNumber: createdCustomers[0].licenseNumber,
            address: createdCustomers[0].address,
            city: createdCustomers[0].city,
          },
          car: porsche._id,
          carSnapshot: {
            name: porsche.name,
            slug: porsche.slug,
            brand: porsche.brand,
            tag: porsche.tag,
            pricePerDay: porsche.price,
            img: porsche.img,
          },
          pickupLocation: 'JFK Airport, Terminal 4',
          deliveryAddress: '742 Evergreen Terrace, New York, NY',
          pickupDate: new Date(Date.now() + 86400000),
          returnDate: new Date(Date.now() + 86400000 * 4),
          days: 3,
          priceBreakdown: {
            subtotal: porsche.price * 3,
            insurance: 75,
            discount: 0,
            promoCode: '',
            total: porsche.price * 3 + 75,
          },
          status: 'in_transit', // Car dispatched / on the way to customer
          statusTimeline: [
            { status: 'confirmed', timestamp: new Date(Date.now() - 3600000 * 6), note: 'Booking verified & confirmed' },
            { status: 'in_transit', timestamp: new Date(Date.now() - 3600000), note: 'Chauffeur dispatched with vehicle' },
          ],
          paymentStatus: 'paid',
          notes: 'Customer requested complimentary bottled water and child booster seat.',
        },
        {
          bookingNumber: 'DRV-72910',
          customer: createdCustomers[1]._id,
          customerSnapshot: {
            name: createdCustomers[1].name,
            email: createdCustomers[1].email,
            phone: createdCustomers[1].phone,
            licenseNumber: createdCustomers[1].licenseNumber,
            address: createdCustomers[1].address,
            city: createdCustomers[1].city,
          },
          car: audi._id,
          carSnapshot: {
            name: audi.name,
            slug: audi.slug,
            brand: audi.brand,
            tag: audi.tag,
            pricePerDay: audi.price,
            img: audi.img,
          },
          pickupLocation: 'Miami Beach Executive Lounge',
          deliveryAddress: '450 Ocean Drive, Miami, FL',
          pickupDate: new Date(Date.now() - 86400000 * 3),
          returnDate: new Date(Date.now() - 86400000),
          days: 2,
          priceBreakdown: {
            subtotal: audi.price * 2,
            insurance: 50,
            discount: 100,
            promoCode: 'DRIVEO20',
            total: audi.price * 2 + 50 - 100,
          },
          status: 'completed',
          statusTimeline: [
            { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 4) },
            { status: 'in_transit', timestamp: new Date(Date.now() - 86400000 * 3) },
            { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 3) },
            { status: 'completed', timestamp: new Date(Date.now() - 86400000) },
          ],
          paymentStatus: 'paid',
          notes: 'Weekend rental for video production shoot.',
        },
        {
          bookingNumber: 'DRV-58301',
          customer: createdCustomers[2]._id,
          customerSnapshot: {
            name: createdCustomers[2].name,
            email: createdCustomers[2].email,
            phone: createdCustomers[2].phone,
            licenseNumber: createdCustomers[2].licenseNumber,
            address: createdCustomers[2].address,
            city: createdCustomers[2].city,
          },
          car: amg._id,
          carSnapshot: {
            name: amg.name,
            slug: amg.slug,
            brand: amg.brand,
            tag: amg.tag,
            pricePerDay: amg.price,
            img: amg.img,
          },
          pickupLocation: 'Austin Bergstrom International',
          deliveryAddress: '1200 Grand Ave, Austin, TX',
          pickupDate: new Date(Date.now() + 86400000 * 2),
          returnDate: new Date(Date.now() + 86400000 * 5),
          days: 3,
          priceBreakdown: {
            subtotal: amg.price * 3,
            insurance: 75,
            discount: 0,
            promoCode: '',
            total: amg.price * 3 + 75,
          },
          status: 'confirmed',
          statusTimeline: [
            { status: 'confirmed', timestamp: new Date(), note: 'Payment processed successfully' },
          ],
          paymentStatus: 'paid',
          notes: 'Executive corporate rental.',
        }
      ];

      await Booking.insertMany(sampleBookings);
      console.log('[Seed] Seeded sample bookings and analytics records.');
    }
  } catch (error) {
    console.error('[Seed Error] Database seeding encountered an error:', error);
  }
}
