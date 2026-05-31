/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone } from '../types';
import { Search, SlidersHorizontal, Check, ArrowRight, ShieldCheck, Zap, Truck, Sparkles, MessageCircle, ShoppingBag, Eye, Star } from 'lucide-react';

interface CatalogProps {
  phones: Phone[];
  onOpenChatWithPhone: (phone: Phone) => void;
  onPlaceOrder: (phone: Phone, storage: string, color: string, customerName: string, deliveryAddress: string, courier: string) => void;
}

export default function Catalog({ phones, onOpenChatWithPhone, onPlaceOrder }: CatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  
  // Storage and color states for the detail modal
  const [detailStorage, setDetailStorage] = useState('');
  const [detailColor, setDetailColor] = useState('');
  
  // Checkout form state
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('DHL Premium Express');

  // Find all distinct brands for filter chips
  const brands = ['All', ...Array.from(new Set(phones.map((p) => p.brand)))];

  // Filter listings
  const filteredPhones = phones.filter((phone) => {
    const matchesSearch =
      phone.brand.toLowerCase().includes(search.toLowerCase()) ||
      phone.model.toLowerCase().includes(search.toLowerCase()) ||
      phone.description.toLowerCase().includes(search.toLowerCase()) ||
      phone.features.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    const matchesBrand = selectedBrand === 'All' || phone.brand === selectedBrand;
    const matchesPrice = phone.price <= maxPrice;

    return matchesSearch && matchesBrand && matchesPrice;
  });

  // Calculate dynamic price based on storage choice in modal
  const getDynamicPrice = (phone: Phone, storage: string) => {
    let basePrice = phone.price;
    if (storage === '256GB') basePrice += 100;
    if (storage === '512GB') basePrice += 220;
    if (storage === '1TB') basePrice += 400;
    return basePrice;
  };

  const handleOpenSpecs = (phone: Phone) => {
    setSelectedPhone(phone);
    setDetailStorage(phone.storage || '128GB');
    setDetailColor(phone.colorName);
    setShowCheckout(false);
  };

  const executeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhone || !customerName.trim() || !deliveryAddress.trim()) return;

    onPlaceOrder(
      selectedPhone,
      detailStorage,
      detailColor,
      customerName,
      deliveryAddress,
      selectedCourier
    );

    // Reset states
    setShowCheckout(false);
    setSelectedPhone(null);
    setCustomerName('');
    setDeliveryAddress('');
  };

  return (
    <div className="space-y-8 animate-fade-in" id="catalog-section">
      {/* Search and Filters Hub - Clean interface, soft borders */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              id="catalog-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by brand, specifications or features..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-55/40 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 transition-all text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="text-slate-450 w-3.5 h-3.5 mr-1 hidden sm:block" />
            <span className="text-[10px] font-mono text-slate-405 mr-2 uppercase tracking-wide hidden sm:block">Manufacturer:</span>
            <div className="flex flex-wrap gap-1" id="brand-filters-container">
              {brands.map((brand) => (
                <button
                  key={brand}
                  id={`brand-filter-${brand}`}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    selectedBrand === brand
                      ? 'bg-slate-950 border border-slate-950 text-white shadow-xs'
                      : 'bg-slate-100/60 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price slider overlay */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Maximum Budget:</span>
              <span className="text-slate-950 font-semibold">${maxPrice} USD</span>
            </div>
            <input
              type="range"
              id="catalog-price-slider"
              min="400"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Showing {filteredPhones.length} of {phones.length} devices
          </div>
        </div>
      </div>

      {/* Flagships Grid */}
      {filteredPhones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="product-grid">
          {filteredPhones.map((phone) => (
            <div
              key={phone.id}
              id={`phone-card-${phone.id}`}
              className="group bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-[520px]"
            >
              {/* Product Image Frame */}
              <div className="p-4 bg-slate-55/30 border-b border-slate-200/40 flex justify-center items-center h-52 relative overflow-hidden">
                <img
                  src={phone.image}
                  alt={phone.model}
                  referrerPolicy="no-referrer"
                  className="h-full object-contain max-w-full rounded-md transition-transform duration-505 group-hover:scale-105"
                />

                {/* Floating Tags */}
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-950 text-white font-mono text-[8px] font-bold tracking-wider px-2 py-0.5 rounded shadow-xs uppercase">
                    {phone.brand}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm shadow-xs border border-slate-200/60 rounded px-1.5 py-0.5 font-mono text-[10px] text-amber-500 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{phone.rating}</span>
                </div>
              </div>

              {/* Card Meta Container */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-bold text-slate-950 group-hover:text-slate-800 transition-colors leading-snug font-display">
                    {phone.model}
                  </h3>
                  
                  {/* Color Name Chip & Battery */}
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-200 shadow-inner flex-shrink-0"
                      style={{ backgroundColor: phone.color }}
                      title={phone.colorName}
                    />
                    <span className="text-[11px] text-slate-500 font-light">{phone.colorName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-mono text-slate-400">{phone.battery}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {phone.description}
                  </p>

                  {/* Bullet Spec Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3.5 border-t border-slate-100">
                    <div>
                      <span className="block font-mono text-[8px] font-semibold tracking-wider text-slate-400 uppercase">Architecture</span>
                      <span className="text-[11px] font-medium text-slate-700 truncate block mt-0.5">{phone.processor}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8px] font-semibold tracking-wider text-slate-400 uppercase">Optics Sensor</span>
                      <span className="text-[11px] font-medium text-slate-700 truncate block mt-0.5">{phone.camera.split(' + ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Core Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">MSRP</span>
                    <span className="text-md font-bold text-slate-950">${phone.price}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      id={`phone-card-inquire-${phone.id}`}
                      onClick={() => onOpenChatWithPhone(phone)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg border border-slate-200/80 transition-all cursor-pointer"
                      title="Consult seller assistant"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      id={`phone-card-specs-${phone.id}`}
                      onClick={() => handleOpenSpecs(phone)}
                      className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Specifications</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center max-w-sm mx-auto space-y-3">
          <Search className="w-6 h-6 text-slate-300 mx-auto" />
          <h3 className="text-xs font-bold text-slate-850">Empty query match</h3>
          <p className="text-[11px] text-slate-500 leading-normal">
            No listings currently match those active query criteria. Try adjusting filters or budget limitations.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedBrand('All');
              setMaxPrice(1500);
            }}
            className="mt-1 text-[11px] font-semibold text-slate-950 hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Full Dedicated Specifications / Quick Purchase Checkout Overlay Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="specs-modal">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedPhone(null)}
          />

          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200/80 transform transition-all flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Product Visual Frame (Left) */}
              <div className="md:w-5/12 bg-slate-950 p-8 flex flex-col justify-between relative overflow-hidden text-white border-b md:border-b-0 md:border-r border-white/5">
                {/* Visual backlighting */}
                <div 
                  className="absolute -left-1/4 -bottom-1/4 w-80 h-80 rounded-full opacity-10 blur-2xl"
                  style={{ backgroundColor: selectedPhone.color }}
                />

                <div className="z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">{selectedPhone.brand} Series</span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-display">{selectedPhone.model}</h2>
                  </div>
                  <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded text-[10px] font-mono border border-white/5">
                    ${getDynamicPrice(selectedPhone, detailStorage)}
                  </span>
                </div>

                {/* Render actual smartphone image */}
                <div className="my-8 flex justify-center items-center z-10">
                  <img
                    src={selectedPhone.image}
                    alt={selectedPhone.model}
                    referrerPolicy="no-referrer"
                    className="max-h-56 object-contain rounded-xl shadow-2xl bg-white p-2 border border-slate-200"
                  />
                </div>

                {/* Footer specs badges */}
                <div className="z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Finish:</span>
                    <span className="font-medium text-white">{detailColor}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-medium text-white">{detailStorage}</span>
                  </div>
                </div>
              </div>

              {/* Specs & Checkout Controls (Right) */}
              <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between bg-white max-h-[85vh] md:max-h-full">
                
                {/* Close modal button top-right */}
                <button
                  id="close-specs-modal"
                  onClick={() => setSelectedPhone(null)}
                  className="absolute top-6 right-6 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold">✕</span>
                </button>

                {!showCheckout ? (
                  /* Specifications Details Sheet */
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-bold text-slate-950 tracking-wider font-mono uppercase bg-slate-100 px-2 py-0.5 rounded">Specification Sheet</span>
                      <h3 className="text-lg font-bold text-slate-950 mt-2 font-display">Technical Matrix</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Customize default hardware parameters before checkout.</p>
                    </div>

                    {/* Step 1: Storage Configurator */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-435 uppercase tracking-wide block">Storage Capacity:</label>
                      <div className="grid grid-cols-3 gap-2" id="modal-storage-options">
                        {['128GB', '256GB', '512GB'].map((st) => (
                          <button
                            key={st}
                            id={`storage-option-${st}`}
                            onClick={() => setDetailStorage(st)}
                            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                              detailStorage === st
                                ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-750 hover:bg-slate-100/50 hover:border-slate-300'
                            }`}
                          >
                            <span className="block text-xs font-bold">{st}</span>
                            <span className="text-[9px] opacity-70">
                              {st === '128GB' ? 'Included' : st === '256GB' ? '+$100' : '+$220'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Color Configuration */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-435 uppercase tracking-wide block">Color Finish Selection:</label>
                      <div className="flex flex-wrap gap-2" id="modal-color-options">
                        {[
                          { name: selectedPhone.colorName, hex: selectedPhone.color },
                          { name: 'Cosmic Slate', hex: '#1e293b' },
                          { name: 'Stellar Gold', hex: '#d97706' }
                        ].map((col) => (
                          <button
                            key={col.name}
                            id={`color-option-${col.name.replace(/\s+/g, '-')}`}
                            onClick={() => setDetailColor(col.name)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                              detailColor === col.name
                                ? 'bg-slate-50 border-slate-950 text-slate-950 font-semibold'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-500'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: col.hex }} />
                            <span>{col.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specifications Properties Checklist */}
                    <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200/50 space-y-3">
                      <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Device Architecture</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-slate-700" />
                          <span>Processor: <strong className="text-slate-950 font-normal">{selectedPhone.processor}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                          <span>Rear Camera: <strong className="text-slate-950 font-normal">{selectedPhone.camera.split(' + ')[0]}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-slate-700" />
                          <span>Standard Battery: <strong className="text-slate-950 font-normal">{selectedPhone.battery}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                          <span>Fulfillment check: <strong className="text-slate-900 font-normal">Warranty Active</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Extended Highlight Items */}
                    <div className="space-y-1.5">
                      <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Exclusive Highlights</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPhone.features.map((feature, i) => (
                          <span key={i} className="bg-slate-50 text-slate-650 font-mono text-[9px] uppercase tracking-wide px-2 py-0.5 rounded border border-slate-200/40">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Checkout Switch Panel Trigger */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Total MSRP</span>
                        <span className="text-lg font-bold text-slate-950">
                          ${getDynamicPrice(selectedPhone, detailStorage)}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onOpenChatWithPhone(selectedPhone)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all"
                        >
                          Seller Support
                        </button>
                        <button
                          id="trigger-checkout-form"
                          onClick={() => setShowCheckout(true)}
                          className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Fulfillment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Integration Checkout Form */
                  <form onSubmit={executeCheckout} className="space-y-5" id="checkout-form">
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="text-[11px] text-slate-600 hover:text-slate-950 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        ← Back to technical specifications
                      </button>
                      <h3 className="text-lg font-bold text-slate-950 mt-2 font-display">Fulfillment Coordinates</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Define coordinates to configure shipping order tracking.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Customer name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Customer Full Name:</label>
                        <input
                          type="text"
                          id="checkout-name-input"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your full signature name"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/20 focus:border-slate-950 max-w-lg focus:outline-none"
                        />
                      </div>

                      {/* Delivery address */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Fulfillment Destination:</label>
                        <input
                          type="text"
                          id="checkout-address-input"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Fulfillment destination address"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/20 focus:border-slate-950 max-w-lg focus:outline-none"
                        />
                      </div>

                      {/* Select courier */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Fulfillment Courier:</label>
                        <select
                          id="checkout-courier-select"
                          value={selectedCourier}
                          onChange={(e) => setSelectedCourier(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-slate-950/20 focus:border-slate-950 focus:outline-none max-w-lg cursor-pointer"
                        >
                          <option>DHL Premium Express</option>
                          <option>FedEx Priority Ground</option>
                          <option>UPS Next-Day Special</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-slate-600 font-mono text-[10px] border border-slate-200/60 max-w-lg">
                      <div className="flex justify-between font-bold text-slate-950 border-b border-slate-100 pb-1">
                        <span>Fulfillment Unit:</span>
                        <span>{selectedPhone.model} ({detailStorage})</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span>Base MSRP Charge:</span>
                        <span>${selectedPhone.price} USD</span>
                      </div>
                      <div className="flex justify-between text-slate-950 border-t border-slate-250/20 pt-1.5 font-bold mt-1.5">
                        <span>Estimated Invoice:</span>
                        <span>${getDynamicPrice(selectedPhone, detailStorage)} USD</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPhone(null)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all"
                      >
                        Close
                      </button>
                      <button
                        id="submit-order-button"
                        type="submit"
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Authorize Invoice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
