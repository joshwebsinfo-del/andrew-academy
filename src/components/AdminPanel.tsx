/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone } from '../types';
import { Plus, Edit2, Trash2, ArrowRight, Save, RotateCcw, Smartphone, Info } from 'lucide-react';

interface AdminPanelProps {
  phones: Phone[];
  onSavePhones: (updatedPhones: Phone[]) => void;
  onResetToDefaults: () => void;
}

export default function AdminPanel({ phones, onSavePhones, onResetToDefaults }: AdminPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states matching a Phone object
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState(799);
  const [description, setDescription] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [color, setColor] = useState('#22c55e');
  const [colorName, setColorName] = useState('Forest Green');
  const [battery, setBattery] = useState('5000 mAh');
  const [camera, setCamera] = useState('50MP Dual Lens');
  const [processor, setProcessor] = useState('Sleek-Core M2');
  const [stock, setStock] = useState(10);
  const [rating, setRating] = useState(4.5);
  const [image, setImage] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  // Apply quick templates for extreme convenience
  const applyTemplate = (brandName: string) => {
    if (brandName === 'Apple') {
      setBrand('Apple');
      setModel('iPhone 16 Pro');
      setPrice(999);
      setDescription('Sophisticated design featuring high titanium edge panels and an extraordinary next-gen camera sensor array.');
      setStorage('256GB');
      setColor('#55555c');
      setColorName('Space Gray');
      setBattery('4500 mAh');
      setCamera('48MP Quad Camera System');
      setProcessor('A18 Pro');
      setStock(14);
      setRating(4.9);
      setImage('https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80');
      setFeatures(['Action Button', 'Ray Tracing Shader Support', 'Dynamic Island 2.0']);
    } else if (brandName === 'Samsung') {
      setBrand('Samsung');
      setModel('Galaxy S24+');
      setPrice(949);
      setDescription('Unbelievably rich screen and customized generative intelligence search capabilities built right into the interface.');
      setStorage('256GB');
      setColor('#d97706');
      setColorName('Amber Yellow');
      setBattery('4900 mAh');
      setCamera('108MP Telephoto System');
      setProcessor('Snapdragon 8 Gen 3');
      setStock(18);
      setRating(4.8);
      setImage('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80');
      setFeatures(['S-Pen Assist', 'AI Zoom Enhancer', 'Vision Booster Screen']);
    } else if (brandName === 'Xiaomi/OnePlus') {
      setBrand('OnePlus');
      setModel('OnePlus 12R');
      setPrice(499);
      setDescription('High velocity flagship killer. Built for active mobile gaming tournaments and ultra-low lag latency responses.');
      setStorage('128GB');
      setColor('#06b6d4');
      setColorName('Cool Blue');
      setBattery('5500 mAh');
      setCamera('50MP Sony IMX890');
      setProcessor('Snapdragon 8 Gen 2');
      setStock(22);
      setRating(4.6);
      setImage('https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80');
      setFeatures(['100W SuperVOOC Charge', 'Dual VC Cryo-cooling', 'Alert Slider Knob']);
    }
  };

  const handleEditInit = (phone: Phone) => {
    setEditingId(phone.id);
    setIsCreatingNew(false);
    
    // Set form fields
    setBrand(phone.brand);
    setModel(phone.model);
    setPrice(phone.price);
    setDescription(phone.description);
    setStorage(phone.storage);
    setColor(phone.color);
    setColorName(phone.colorName);
    setBattery(phone.battery);
    setCamera(phone.camera);
    setProcessor(phone.processor);
    setStock(phone.stock);
    setRating(phone.rating);
    setImage(phone.image || '');
    setFeatures(phone.features);
    setFeatureInput('');
  };

  const handleCreateInit = () => {
    setIsCreatingNew(true);
    setEditingId(null);

    // Reset standard form
    setBrand('Apple');
    setModel('');
    setPrice(799);
    setDescription('');
    setStorage('256GB');
    setColor('#475569');
    setColorName('Slate Oxide');
    setBattery('5000 mAh');
    setCamera('50MP Fusion Sensor');
    setProcessor('Ultra-Core');
    setStock(10);
    setRating(4.5);
    setImage('');
    setFeatures([]);
    setFeatureInput('');
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const deletePhone = (id: string) => {
    if (confirm('Are you absolutely sure you want to remove this smartphone listing from your catalog?')) {
      const updated = phones.filter((p) => p.id !== id);
      onSavePhones(updated);
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !description.trim()) return;

    let finalImage = image.trim();
    if (!finalImage) {
      if (brand.toLowerCase() === 'apple') finalImage = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80';
      else if (brand.toLowerCase() === 'samsung') finalImage = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80';
      else if (brand.toLowerCase() === 'google') finalImage = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';
      else finalImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
    }

    const phoneData: Phone = {
      id: isCreatingNew ? `phone-${Date.now()}` : editingId!,
      brand,
      model,
      price: Number(price),
      description,
      image: finalImage,
      storage,
      color,
      colorName,
      battery,
      camera,
      processor,
      stock: Number(stock),
      rating: Number(rating),
      features: features.length > 0 ? features : ['Next-Gen Core', 'Super Retina IPS Screen', 'Ultra-fast Wireless charging']
    };

    let updatedList: Phone[];
    if (isCreatingNew) {
      updatedList = [phoneData, ...phones];
    } else {
      updatedList = phones.map((p) => (p.id === editingId ? phoneData : p));
    }

    onSavePhones(updatedList);
    setEditingId(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="admin-panel-section">
      {/* Intro Banner - Slate Obsidian Deep Panel */}
      <div className="bg-slate-950 text-white rounded-xl p-6 border border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone className="text-slate-400 w-4.5 h-4.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Inventory Management</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight font-display">Flagship Terminal Manager</h2>
          <p className="text-slate-400 text-[11px] leading-relaxed">Adjust retail stock, create mockup models, or alter specifications indicators instantly.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onResetToDefaults}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Listings</span>
          </button>
          {!isCreatingNew && !editingId && (
            <button
              id="admin-add-phone-btn"
              onClick={handleCreateInit}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-950 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add Device</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form Panel (Left) */}
        {(isCreatingNew || editingId) && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/60 p-6 space-y-6" id="admin-editor-form-panel">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  {isCreatingNew ? 'Create New Listing' : 'Edit Flagship Parameters'}
                </h3>
                <p className="text-[11px] text-slate-400">Modify properties below. Click confirm once finished.</p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingId(null);
                }}
                className="text-xs text-slate-550 hover:text-slate-950 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Quick Templates picker for creation mode */}
            {isCreatingNew && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[11px] font-bold text-slate-850">Apply Base Preconfigs:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate('Apple')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 text-xs rounded-md border border-slate-200/80 transition-all font-medium cursor-pointer"
                  >
                    Apple Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('Samsung')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 text-xs rounded-md border border-slate-200/80 transition-all font-medium cursor-pointer"
                  >
                    Samsung Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('Xiaomi/OnePlus')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 text-xs rounded-md border border-slate-200/80 transition-all font-medium cursor-pointer"
                  >
                    OnePlus Preset
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-4" id="admin-spec-form">
              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Manufacturer Brand:</label>
                  <select
                    id="form-brand-select"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none cursor-pointer"
                  >
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Google</option>
                    <option>OnePlus</option>
                    <option>Nothing</option>
                    <option>Xiaomi</option>
                  </select>
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Model Identifier:</label>
                  <input
                    type="text"
                    id="form-model-input"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Galaxy S25 Elite"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Image URL Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Product Image URL:</label>
                <input
                  type="url"
                  id="form-image-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or blank for auto-presets"
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">MSRP MSRP USD ($):</label>
                  <input
                    type="number"
                    id="form-price-input"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                  />
                </div>

                {/* Initial Storage */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Default Storage:</label>
                  <select
                    id="form-storage-select"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none cursor-pointer"
                  >
                    <option>128GB</option>
                    <option>256GB</option>
                    <option>512GB</option>
                    <option>1TB</option>
                  </select>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Available Stock:</label>
                  <input
                    type="number"
                    id="form-stock-input"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Color Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Color Name Indicator:</label>
                  <input
                    type="text"
                    id="form-colorname-input"
                    required
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    placeholder="e.g. Lavender Violet"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                  />
                </div>

                {/* Hex color selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Color Swatch hex:</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="form-color-picker"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-8 p-0 border border-slate-200 rounded cursor-pointer bg-slate-100"
                    />
                    <input
                      type="text"
                      id="form-color-text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-950/25"
                    />
                  </div>
                </div>
              </div>

              {/* Specs array (Processor, Camera, Battery) */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-450 block">CPU Chipset</span>
                  <input
                    type="text"
                    required
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    placeholder="Tensor G4"
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-450 block">Primary Lens</span>
                  <input
                    type="text"
                    required
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    placeholder="48MP Dual Lens"
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-450 block">Battery cell</span>
                  <input
                    type="text"
                    required
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    placeholder="5000 mAh"
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Product Description Editorial:</label>
                <textarea
                  id="form-description-input"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert phone specifications description summary..."
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 focus:outline-none"
                />
              </div>

              {/* Dynamic Feature Badges */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Product Highlights ({features.length}):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="form-feature-input"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Dual SIM, eSIM enabled"
                    className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded-lg cursor-pointer max-h-9 transition-all"
                  >
                    Add Label
                  </button>
                </div>
                {features.length > 0 ? (
                  <div className="flex flex-wrap gap-1 pt-2" id="admin-feature-chips-preview">
                    {features.map((feat, i) => (
                      <span
                        key={i}
                        className="bg-slate-50 text-slate-650 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="text-slate-400 hover:text-slate-950 font-bold ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-slate-400 font-mono italic">No features specified yet.</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingId(null);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close Editor
                </button>
                <button
                  id="admin-save-spec-btn"
                  type="submit"
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-slate-300" />
                  <span>{isCreatingNew ? 'Publish Listing' : 'Process Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Listings Catalogue Tree (Right) */}
        <div className={`${isCreatingNew || editingId ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-xl border border-slate-200/60 p-6 space-y-4 shadow-xs`}>
          <div>
            <h3 className="text-slate-950 text-xs font-bold font-display uppercase tracking-wider leading-none">Catalog Inventory Tree</h3>
            <p className="text-[11px] text-slate-405 mt-1 leading-normal">Direct listing of active sales items currently synced with the digital customer catalog.</p>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1" id="admin-inventory-list">
            {phones.map((phone) => (
              <div
                key={phone.id}
                id={`inventory-row-${phone.id}`}
                className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                  editingId === phone.id
                    ? 'bg-slate-50 border-slate-950/80 shadow-xs'
                    : 'bg-white border-slate-250/20 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Miniature phone thumbnail */}
                  <div className="w-9 h-9 rounded overflow-hidden border border-slate-200 bg-slate-55/30 hover:bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <img
                      src={phone.image}
                      alt={phone.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-400 block">{phone.brand}</span>
                    <h4 className="text-xs font-semibold text-slate-950 truncate leading-none mt-0.5">{phone.model}</h4>
                    <div className="flex gap-1.5 text-[9px] text-slate-405 font-mono mt-1">
                      <span className="text-slate-950 font-bold">${phone.price}</span>
                      <span>•</span>
                      <span>Quantity: {phone.stock} units</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    id={`edit-phone-btn-${phone.id}`}
                    onClick={() => handleEditInit(phone)}
                    className="p-1 px-2 text-slate-650 hover:bg-slate-100/80 hover:text-slate-950 rounded-md transition-colors cursor-pointer"
                    title="Edit specs"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    id={`delete-phone-btn-${phone.id}`}
                    onClick={() => deletePhone(phone.id)}
                    className="p-1 px-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Remove entirely"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
