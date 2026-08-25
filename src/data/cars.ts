import {
  ShieldCheck,
  Headset,
  Wallet,
  Car,
  Gauge,
  Users,
  Fuel,
  Cog,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CarType = 'Sports' | 'Convertible' | 'Supercar' | 'Coupe' | 'SUV' | 'Luxury';

export interface CarSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface CarData {
  slug: string;
  name: string;
  brand: string;
  tag: CarType;
  price: number;
  img: string;
  gallery: string[];
  rating: number;
  seats: number;
  specs: CarSpec[];
  description: string;
  features: string[];
}

export const cars: CarData[] = [
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
      { icon: Gauge, label: '0–60 mph', value: '3.1s' },
      { icon: Cog, label: 'Transmission', value: '7-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '2' },
    ],
    description:
      'A hand-built twin-turbo V8 wrapped in a long-hood grand tourer silhouette. The AMG GT blends track-bred aggression with everyday comfort — sculpted side intakes, a deep front splitter, and a cabin that wraps around the driver.',
    features: ['Hand-stitched Nappa leather', 'Burmester 3D surround sound', 'Active rear spoiler', 'AMG ride control suspension'],
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
      { icon: Gauge, label: '0–60 mph', value: '4.4s' },
      { icon: Cog, label: 'Transmission', value: '8-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '2' },
    ],
    description:
      'Open-top freedom with a turbocharged inline-six. The Z4 Roadster delivers a perfectly balanced chassis, a folding soft-top that opens in 10 seconds, and a cockpit tuned for the pure joy of driving.',
    features: ['10-second power soft-top', 'Adaptive M suspension', 'Harman Kardon audio', 'Wireless Apple CarPlay'],
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
      { icon: Gauge, label: '0–60 mph', value: '2.6s' },
      { icon: Cog, label: 'Transmission', value: '7-speed DCT' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '2' },
    ],
    description:
      'A naturally aspirated V10 mounted behind the driver, a carbon-fiber cockpit, and the kind of exhaust note that turns every tunnel into a concert. The R8 is the everyday supercar.',
    features: ['Naturally aspirated V10', 'Carbon fiber monocoque', 'Virtual Cockpit display', 'Magnetic ride control'],
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
      { icon: Gauge, label: '0–60 mph', value: '3.5s' },
      { icon: Cog, label: 'Transmission', value: '8-speed PDK' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '4' },
    ],
    description:
      'The icon. Sixty years of rear-engine evolution distilled into one timeless silhouette. The 911 Carrera is precise, composed, and endlessly rewarding — a car that feels alive at every speed.',
    features: ['PDK dual-clutch transmission', 'Sport Chrono Package', 'BOSE surround sound', 'Adaptive sport seats'],
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
      { icon: Gauge, label: '0–60 mph', value: '5.1s' },
      { icon: Cog, label: 'Transmission', value: '8-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Diesel' },
      { icon: Users, label: 'Seats', value: '5' },
    ],
    description:
      'Commanding presence meets genuine capability. The Range Rover Sport glides over rough roads on adaptive air suspension, with a cabin so quiet you can hear yourself think.',
    features: ['Air suspension', 'Meridian surround sound', 'Heated and cooled seats', 'Terrain Response 2'],
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
      { icon: Gauge, label: '0–60 mph', value: '4.4s' },
      { icon: Cog, label: 'Transmission', value: '9-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '5' },
    ],
    description:
      'The benchmark of the luxury sedan. Massaging seats, a 3D driver display, and an interior that feels like a private lounge on wheels. The S-Class redefines what a car can be.',
    features: ['Massaging executive seats', 'Burmester 4D sound', 'MBUX hyperscreen', 'Rear-axle steering'],
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
      { icon: Gauge, label: '0–60 mph', value: '4.5s' },
      { icon: Cog, label: 'Transmission', value: '8-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '4' },
    ],
    description:
      "A turbocharged V6 with quattro all-wheel drive in a sharp, understated coupe body. The S5 is the thinking driver's choice — fast, composed, and effortlessly capable.",
    features: ['quattro all-wheel drive', 'Virtual Cockpit Plus', 'Bang & Olufsen audio', 'Adaptive cruise assist'],
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
      { icon: Gauge, label: '0–60 mph', value: '3.9s' },
      { icon: Cog, label: 'Transmission', value: '8-speed auto' },
      { icon: Fuel, label: 'Fuel', value: 'Premium' },
      { icon: Users, label: 'Seats', value: '4' },
    ],
    description:
      'A grand tourer reborn. The 8 Series Convertible pairs a muscular twin-turbo V8 with a wind-deflecting soft-top, so four adults can enjoy top-down cruising at any speed.',
    features: ['Two-stage soft-top', 'xDrive all-wheel drive', 'Bowers & Wilkins audio', 'Gesture control'],
  },
];

export const carTypes: CarType[] = ['Sports', 'Convertible', 'Supercar', 'Coupe', 'SUV', 'Luxury'];

export const features = [
  {
    icon: ShieldCheck,
    title: 'Fully Insured',
    text: 'Every rental includes comprehensive coverage.',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    text: 'On-call concierge wherever the road takes you.',
  },
  {
    icon: Wallet,
    title: 'Best Price',
    text: 'No hidden fees. Transparent, flat daily rates.',
  },
  {
    icon: Car,
    title: 'Free Delivery',
    text: 'Door-to-door delivery within the city, on us.',
  },
];

export const avatars = [
  'https://images.pexels.com/photos/6605420/pexels-photo-6605420.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/3290499/pexels-photo-3290499.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/3868929/pexels-photo-3868929.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
  'https://images.pexels.com/photos/907862/pexels-photo-907862.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
];

export const heroCar =
  'https://images.pexels.com/photos/38570/lamborghini-car-speed-prestige-38570.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const promoCar =
  'https://images.pexels.com/photos/27692895/pexels-photo-27692895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function getCar(slug: string): CarData | undefined {
  return cars.find((c) => c.slug === slug);
}
