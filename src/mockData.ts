/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapLocation, TrackedOrder } from './types';

export const INITIAL_PHONES: Phone[] = [
  {
    id: 'phone-1',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 1199,
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    storage: '256GB',
    color: '#3c3d3a',
    colorName: 'Natural Titanium',
    battery: '4441 mAh',
    camera: '48MP Main + 12MP Ultra-wide + 12MP 5x Telephoto',
    processor: 'A17 Pro (3nm)',
    stock: 12,
    rating: 4.8,
    features: ['Titanium Frame', 'Action Button', 'Ray Tracing GPU', 'ProRes Video 4K60']
  },
  {
    id: 'phone-2',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    price: 1299,
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    storage: '512GB',
    color: '#55545a',
    colorName: 'Titanium Gray',
    battery: '5000 mAh',
    camera: '200MP Main + 50MP Periscope + 12MP Ultra-wide + 10MP Telephoto',
    processor: 'Snapdragon 8 Gen 3',
    stock: 8,
    rating: 4.9,
    features: ['S-Pen Included', 'Galaxy AI Suite', '100x Space Zoom', 'Armor Aluminum Frame']
  },
  {
    id: 'phone-3',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    price: 999,
    description: 'The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera yet, and can even edit noise out of videos.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    storage: '128GB',
    color: '#8ea6b4',
    colorName: 'Bay Blue',
    battery: '5050 mAh',
    camera: '50MP Main + 48MP Ultra-wide + 48MP 5x optical zoom',
    processor: 'Google Tensor G3',
    stock: 15,
    rating: 4.7,
    features: ['Magic Eraser', 'Real Tone Technology', 'Direct Gemini Nano integrations', 'Best-in-class Astrophotography']
  },
  {
    id: 'phone-4',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    price: 799,
    description: 'Redefined flagship specifications. Empowered by extreme performance hardware, a highly advanced Trinity Engine, and 100W ultra-fast SUPERVOOC charging.',
    image: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80',
    storage: '256GB',
    color: '#2d4e3f',
    colorName: 'Emerald Green',
    battery: '5400 mAh',
    camera: '50MP Sony LYT-808 + 64MP Periscope + 48MP Ultra-wide',
    processor: 'Snapdragon 8 Gen 3',
    stock: 5,
    rating: 4.6,
    features: ['100W Wired SuperVOOC', 'Hasselblad Camera Calibration', 'Aqua Touch Display', 'Dual Cryo-velocity VC']
  },
  {
    id: 'phone-5',
    brand: 'Nothing',
    model: 'Phone (2)',
    price: 599,
    description: 'A new way to interact. Meet the Glyph Interface. Program custom light and sound patterns for notifications, timers, and progress meters.',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=80',
    storage: '128GB',
    color: '#dedfe3',
    colorName: 'White Glyph Edition',
    battery: '4700 mAh',
    camera: '50MP Main (Sony IMX890) + 50MP Ultra-wide',
    processor: 'Snapdragon 8+ Gen 1',
    stock: 9,
    rating: 4.5,
    features: ['Glyph Interface Lights', 'Nothing OS 2.0 widgets', 'Eco-friendly recycled aluminum', 'Transparent back glass design']
  }
];
export const INITIAL_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-2',
    name: 'Metro Galleria Mall Outlet',
    address: '8900 Kings Highway, Level 2 (Near Nordstoms), Brooklyn, NY 11223',
    phone: '+1 (555) 890-4122',
    hours: 'Mon-Sun: 10:00 AM - 9:30 PM',
    coordinates: { x: 68, y: 62 },
    description: 'Conveniently located inside the main gallery wing. Offering express trade-ins, custom accessory engraving station, and quick device setups.'
  },
  {
    id: 'loc-3',
    name: 'Westside Hub & Repair Center',
    address: '102 Ninth Ave, Corner of 17th Street, New York, NY 10011',
    phone: '+1 (555) 472-9100',
    hours: 'Mon-Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 5:00 PM',
    coordinates: { x: 22, y: 75 },
    description: 'Our primary repair facility and express collection center. Certified technicians deliver screen repairs in 45 minutes or less.'
  }
];

export const INITIAL_ORDERS: TrackedOrder[] = [
  {
    id: 'order-1',
    customerName: 'Marcus Vance',
    phoneModel: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 1199,
    date: '2026-05-25 (Yesterday)',
    trackingId: 'TRK-89240-X',
    status: 'in_transit',
    courier: 'DHL Premium Express',
    currentLocationName: 'Lexington Transit Hub',
    deliveryEstimate: 'Today by 4:30 PM (In Transit)',
    steps: [
      {
        status: 'ordered',
        label: 'Order Placed',
        time: 'May 25, 10:14 AM',
        description: 'Payment authorized and invoice generated successfully.',
        completed: true
      },
      {
        status: 'processing',
        label: 'Quality Verification',
        time: 'May 25, 2:30 PM',
        description: 'Device underwent absolute hardware checks and packaging.',
        completed: true
      },
      {
        status: 'picked_up',
        label: 'Courier Dispatched',
        time: 'May 26, 8:15 AM',
        description: 'Package picked up by DHL Express courier.',
        completed: true
      },
      {
        status: 'in_transit',
        label: 'Sorting & Routing',
        time: 'May 26, 12:40 PM',
        description: 'Sorted at Lexington Logistics Hub. Shifted onto delivery container.',
        completed: true
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        time: 'Pending',
        description: 'Vehicle is currently loading for local neighborhood drop-offs.',
        completed: false
      },
      {
        status: 'delivered',
        label: 'Delivered',
        time: 'Pending',
        description: 'Secure signature matching the buyer account will be required.',
        completed: false
      }
    ]
  },
  {
    id: 'order-2',
    customerName: 'Sarah Jenkins',
    phoneModel: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1299,
    date: '2026-05-24',
    trackingId: 'TRK-10552-P',
    status: 'delivered',
    courier: 'FedEx Priority Ground',
    currentLocationName: 'Signed by Resident',
    deliveryEstimate: 'Delivered yesterday at 3:15 PM',
    steps: [
      {
        status: 'ordered',
        label: 'Order Placed',
        time: 'May 24, 08:30 AM',
        description: 'Purchase processed and receipt delivered to client.',
        completed: true
      },
      {
        status: 'processing',
        label: 'Quality Verification',
        time: 'May 24, 11:00 AM',
        description: 'S-Pen inspection completed. Safe-box enclosed.',
        completed: true
      },
      {
        status: 'picked_up',
        label: 'Courier Dispatched',
        time: 'May 24, 1:45 PM',
        description: 'Dispatched from Brooklyn Central Storehouse.',
        completed: true
      },
      {
        status: 'in_transit',
        label: 'Sorting & Routing',
        time: 'May 24, 5:30 PM',
        description: 'Arrived at destination neighborhood delivery point.',
        completed: true
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        time: 'May 25, 9:00 AM',
        description: 'Driver loaded and initialized delivery route.',
        completed: true
      },
      {
        status: 'delivered',
        label: 'Delivered',
        time: 'May 25, 3:15 PM',
        description: 'Left at reception. Securely signed by J. JENKINS.',
        completed: true
      }
    ]
  },
  {
    id: 'order-3',
    customerName: 'Liam Patterson',
    phoneModel: 'Pixel 8 Pro',
    brand: 'Google',
    price: 999,
    date: '2026-05-26 (Today)',
    trackingId: 'TRK-55102-Y',
    status: 'processing',
    courier: 'UPS Next-Day Special',
    currentLocationName: 'Brooklyn Storehouse',
    deliveryEstimate: 'Expected Tomorrow morning',
    steps: [
      {
        status: 'ordered',
        label: 'Order Placed',
        time: 'May 26, 11:20 AM',
        description: 'Order confirmed and registered into local fulfillment hub.',
        completed: true
      },
      {
        status: 'processing',
        label: 'Quality Verification',
        time: 'May 26, 2:10 PM',
        description: 'Currently preparing for physical configuration and warranty tags.',
        completed: true
      },
      {
        status: 'picked_up',
        label: 'Courier Dispatched',
        time: 'Pending',
        description: 'Awaiting carrier handoff clearance.',
        completed: false
      },
      {
        status: 'in_transit',
        label: 'Sorting & Routing',
        time: 'Pending',
        description: 'Transit tracking details populate upon shipment scan.',
        completed: false
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        time: 'Pending',
        description: 'Dispatched with regional delivery agent.',
        completed: false
      },
      {
        status: 'delivered',
        label: 'Delivered',
        time: 'Pending',
        description: 'Delivery confirmation photo will be attached.',
        completed: false
      }
    ]
  }
];
