/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Phone {
  id: string;
  brand: string;
  model: string;
  price: number;
  description: string;
  image: string; // Background color or layout spec for a beautiful mock phone sketch
  storage: string; // e.g., "128GB", "256GB"
  color: string; // Hex code or name
  colorName: string; // name
  battery: string; // e.g., "5000 mAh"
  camera: string; // e.g., "50MP Main + 12MP Ultra-wide"
  processor: string; // e.g., "A17 Pro" or "Snapdragon 8 Gen 3"
  stock: number;
  rating: number;
  features: string[];
}

export interface MapLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: { x: number; y: number }; // Relative coordinates for our vector map: 0-100%
  description: string;
}

export type DeliveryStatus = 'ordered' | 'processing' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: DeliveryStatus;
  label: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface TrackedOrder {
  id: string;
  customerName: string;
  phoneModel: string;
  brand: string;
  price: number;
  date: string;
  trackingId: string;
  status: DeliveryStatus;
  steps: TrackingStep[];
  courier: string;
  currentLocationName: string;
  deliveryEstimate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'view_phone' | 'track_order' | 'view_store';
    payload: string;
  };
}
