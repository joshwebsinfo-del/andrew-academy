/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrackedOrder, DeliveryStatus } from '../types';
import { Search, MapPin, Truck, Box, CheckCircle2, RotateCw, RefreshCw, Calendar, ArrowUpRight, HelpCircle, User, ShieldAlert } from 'lucide-react';

interface DeliveryTrackerProps {
  orders: TrackedOrder[];
  onAdvanceOrderStatus: (trackingId: string) => void;
  onAddSampleOrder: () => void;
}

export default function DeliveryTracker({ orders, onAdvanceOrderStatus, onAddSampleOrder }: DeliveryTrackerProps) {
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [searchError, setSearchError] = useState('');

  const currentOrder = orders.find((o) => o.id === selectedOrderId || o.trackingId === searchTrackingId.trim().toUpperCase()) || orders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toUpperCase();
    if (!query) return;

    const matched = orders.find((o) => o.trackingId === query);
    if (matched) {
      setSelectedOrderId(matched.id);
      setSearchError('');
    } else {
      setSearchError('Specified tracking reference not found in our fulfillment logs.');
    }
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'ordered': return 'text-slate-500 bg-slate-50 border-slate-200';
      case 'processing': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'picked_up': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_transit': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'out_for_delivery': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  // Helper to determine active step indexing
  const getStepStatusIndex = (status: DeliveryStatus): number => {
    const statuses: DeliveryStatus[] = ['ordered', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    return statuses.indexOf(status);
  };

  const currentStepIndex = currentOrder ? getStepStatusIndex(currentOrder.status) : 0;

  return (
    <div className="space-y-8 animate-fade-in" id="tracker-section">
      {/* Tracker Top Control Hub - Slate Minimal Frame */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
          
          {/* Tracking ID search input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">Query Direct Tracking ID:</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 pointer-events-none" />
                <input
                  type="text"
                  id="tracker-search-input"
                  value={searchTrackingId}
                  onChange={(e) => {
                    setSearchTrackingId(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  placeholder="e.g. TRK-89240-X..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950/25 focus:border-slate-950 text-xs font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-5 bg-slate-950 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              >
                Track Package
              </button>
            </div>
            {searchError && (
              <p className="text-[10px] text-red-500 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {searchError}
              </p>
            )}
          </form>

          {/* Quick Click Quick-Select tracker shortcuts */}
          <div className="md:w-96 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Live Delivery Registry:</span>
            <div className="flex flex-wrap gap-1.5 mt-2" id="order-quick-shortcuts">
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  id={`tracker-shortcut-${ord.trackingId}`}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setSearchTrackingId(ord.trackingId);
                    setSearchError('');
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    currentOrder?.id === ord.id
                      ? 'bg-slate-50 text-slate-950 border-slate-950 font-bold shadow-xs'
                      : 'bg-white text-slate-650 border-slate-200/70 hover:border-slate-450'
                  }`}
                >
                  {ord.trackingId}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Timeline & Steps Progression (Left) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/60 p-6 space-y-6 shadow-xs">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${getStatusColor(currentOrder.status)}`}>
                    {currentOrder.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Reference: {currentOrder.trackingId}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight font-display mt-1">
                  Fulfillment Milestones
                </h3>
              </div>

              {/* SIMULATION TRIGGER: Advance Delivery state to play */}
              <div className="flex flex-col items-end">
                <button
                  id={`advance-status-btn-${currentOrder.trackingId}`}
                  onClick={() => onAdvanceOrderStatus(currentOrder.trackingId)}
                  disabled={currentOrder.status === 'delivered'}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    currentOrder.status === 'delivered'
                      ? 'bg-slate-50 text-slate-404 border-slate-200 cursor-not-allowed'
                      : 'bg-slate-950 hover:bg-slate-800 text-white border-slate-950 shadow-xs'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Bump Location Step</span>
                </button>
                <span className="text-[9px] text-slate-400 font-mono mt-1">Simulate courier transit</span>
              </div>
            </div>

            {/* Vertical Segmented Progress Tracker Timeline */}
            <div className="relative pl-6 space-y-6" id="timeline-flow">
              {/* Connector string line */}
              <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-slate-100 pointer-events-none" />

              {/* Highlight completed connector line */}
              <div 
                className="absolute left-[33px] top-4 w-0.5 bg-slate-950 transition-all duration-700 pointer-events-none"
                style={{ height: `${(currentStepIndex / 5) * 88}%` }}
              />

              {currentOrder.steps.map((step, idx) => {
                const isStepCompleted = idx <= currentStepIndex;
                const isStepActive = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex gap-4 relative group" id={`timeline-step-${idx}`}>
                    {/* Circle bulb indicator */}
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full z-10 transition-all duration-300">
                      {isStepCompleted ? (
                        isStepActive ? (
                          <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-white ring-4 ring-slate-100">
                            <Truck className="w-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded bg-slate-101 text-slate-800 flex items-center justify-center font-bold text-[9px] border border-slate-205">
                            ✓
                          </div>
                        )
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1 pt-0.5">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs font-bold ${isStepCompleted ? 'text-slate-950' : 'text-slate-400'} ${isStepActive ? 'text-slate-950 font-extrabold font-display' : ''}`}>
                          {step.label}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded leading-none border border-slate-200/50">
                          {isStepCompleted && step.time !== 'Pending' ? step.time : 'Scheduled'}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-sans ${isStepCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>          {/* Delivery Coordinates & Route Blueprint (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Courier dispatch information card */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4 shadow-xs">
              <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Shipment Blueprint</h4>
              
              <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-700 font-medium font-sans">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Consignee</span>
                  <span className="text-slate-950 font-bold block font-display">{currentOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Target Delivery</span>
                  <span className="text-slate-950 font-bold block">{currentOrder.deliveryEstimate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Purchased Model</span>
                  <span className="text-slate-950 font-semibold block">{currentOrder.phoneModel}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Logistics Courier</span>
                  <span className="text-slate-950 font-extrabold block">{currentOrder.courier}</span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="leading-tight">Drop Address: <strong className="text-slate-950">123 Summit Avenue, New York, NY 10003</strong></span>
              </div>
            </div>

            {/* Courier driver route path schematic visual */}
            <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-900 h-64 relative overflow-hidden flex flex-col justify-between shadow-xs">
              
              {/* Graphic background dots */}
              <div className="absolute inset-0 bg-radial from-transparent to-slate-950 pointer-events-none" />

              <div className="z-10 flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-300 font-semibold">Consignment GPS Trajectory</span>
                <span className="text-[8px] font-mono text-slate-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded bg-emerald-500 animate-pulse" /> TELEMETRY ACTIVE
                </span>
              </div>

              {/* Animated courier progress tracker diagram */}
              <div className="z-10 bg-white/5 p-4 rounded-lg border border-white/10 my-auto flex items-center justify-between gap-4 relative">
                {/* Visual trail link */}
                <div className="absolute left-8 right-8 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {/* Active fill trail link */}
                <div 
                  className="absolute left-8 h-0.5 bg-white top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700" 
                  style={{ width: `${(currentStepIndex / 5) * 80}%` }}
                />

                {/* Sender node */}
                <div className="flex flex-col items-center justify-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border font-mono text-[9px] ${
                    currentStepIndex >= 1 ? 'bg-white text-slate-950 border-white shadow-xs font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    Hub
                  </div>
                  <span className="text-[7px] font-mono text-slate-405 uppercase font-semibold mt-0.5">Warehouse</span>
                </div>

                {/* Moving Carrier Box Icon */}
                <div 
                  className="absolute z-20 transition-all duration-700 transform -translate-y-1/2 -translate-x-1/2 top-1/2 flex flex-col items-center"
                  style={{ left: `${16 + ((currentStepIndex / 5) * 68)}%` }}
                >
                  <div className="w-7 h-7 rounded bg-white border border-slate-200 text-slate-950 flex items-center justify-center shadow-xs">
                    <Truck className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                  <span className="text-[6px] font-mono text-white uppercase font-bold tracking-widest mt-1 bg-slate-950 px-1 py-[0.5px] rounded border border-white/5 whitespace-nowrap">CARRIER</span>
                </div>

                {/* Customer delivery Node */}
                <div className="flex flex-col items-center justify-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border font-mono text-[9px] ${
                    currentStepIndex === 5 ? 'bg-white text-slate-950 border-white shadow-xs font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    Drop
                  </div>
                  <span className="text-[7px] font-mono text-slate-405 uppercase font-semibold mt-0.5">Buyer</span>
                </div>
              </div>

              {/* Status bar node details */}
              <div className="z-10 bg-slate-900/80 p-2 rounded border border-white/5 text-[9px] font-mono text-slate-400 flex justify-between items-center">
                <span>Current Trajectory Status:</span>
                <span className="text-white font-bold uppercase tracking-wider">{currentOrder.currentLocationName}</span>
              </div>

            </div>

          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-12 rounded-xl border border-dashed border-slate-200 text-center max-w-md mx-auto space-y-3">
          <Box className="w-8 h-8 text-slate-350 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No Orders Registered</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Please authorize a mockup transaction in the catalog specs checkout form to inspect logistics trajectory elements.
          </p>
        </div>
      )}
    </div>
  );
}
