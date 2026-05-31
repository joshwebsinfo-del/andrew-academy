/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapLocation } from '../types';
import { MapPin, Phone, Clock, Navigation, Compass, Globe, HelpCircle, Car, Footprints, Train } from 'lucide-react';

interface LocationDetailsProps {
  locations: MapLocation[];
}

type TravelMode = 'drive' | 'walk' | 'transit';

export default function LocationDetails({ locations }: LocationDetailsProps) {
  const [activeLocationId, setActiveLocationId] = useState<string>(locations[0]?.id || '');
  const [travelMode, setTravelMode] = useState<TravelMode>('drive');
  const [showDirections, setShowDirections] = useState(true);

  const activeStore = locations.find((l) => l.id === activeLocationId) || locations[0];

  // Dummy step-by-step visual routing directions mock based on mode and location
  const getSimulatedDirections = (loc: MapLocation, mode: TravelMode) => {
    if (mode === 'drive') {
      return [
        { instruction: 'Depart from your current location, heading North on Park Avenue.', distance: '0.4 mi' },
        { instruction: `Merge onto Regional Expressway East via ramp towards ${loc.name.split(' ')[0]}.`, distance: '2.1 mi' },
        { instruction: 'Take Exit 14B for Lexington Boulevard toward Midtown.', distance: '0.3 mi' },
        { instruction: `Turn right onto Broadway (signs for ${loc.name}). Store will be on the right, secure basement parking validated inside.`, distance: '0.1 mi' }
      ];
    } else if (mode === 'walk') {
      return [
        { instruction: 'Walk East down 23rd St toward the park entry point.', distance: '200 ft' },
        { instruction: 'Cross the intersection plaza. Turn left onto Madison Avenue.', distance: '0.2 mi' },
        { instruction: `Continue straight. Pivot right onto ${loc.address.split(',')[0]} (Near crosswalk).`, distance: '350 ft' },
        { instruction: `Destination is situated immediately on the right side next to adjacent visual galleries.`, distance: '50 ft' }
      ];
    } else {
      return [
        { instruction: 'Walk 3 mins to the nearest Substation Terminal A entrance.', distance: '0.1 mi' },
        { instruction: 'Board the Local (N) Uptown Express Train toward Manhattan Center.', distance: '4 stops (12 mins)' },
        { instruction: `Disembark at central ${loc.name.includes('Mall') ? 'Galleria Square' : 'Broadway Central'} platform. Take Exit Stairs left.`, distance: '2 mins' },
        { instruction: `Walk straight onto the main arcade walk to storefront.`, distance: '150 ft' }
      ];
    }
  };

  const steps = getSimulatedDirections(activeStore, travelMode);

  return (
    <div className="space-y-8 animate-fade-in" id="locations-section">
      {/* Title block - Minimal Slate Frame */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-1.5 text-slate-950">
          <Navigation className="w-4.5 h-4.5" />
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">Store Network & Locator</span>
        </div>
        <h2 className="text-lg font-bold text-slate-950 mt-1 font-display">Simulated Location Navigation</h2>
        <p className="text-[11px] text-slate-500 mt-1">Select an active outlet to preview physical mapping coordinates and step-by-step directions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stores Sidebar & Route Details Sheet (Left) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-none">Registered Shop Outlets</h3>

            <div className="space-y-2" id="store-cards-list">
              {locations.map((loc) => {
                const isActive = loc.id === activeLocationId;
                return (
                  <button
                    key={loc.id}
                    id={`store-card-${loc.id}`}
                    onClick={() => {
                      setActiveLocationId(loc.id);
                      setShowDirections(true);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                      isActive
                        ? 'bg-slate-950 border-slate-950 text-white shadow-xs'
                        : 'bg-white border-slate-200/60 hover:border-slate-350 hover:bg-slate-50/55 text-slate-800'
                    }`}
                  >
                    <MapPin className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-slate-450'}`} />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs leading-none font-display">{loc.name}</h4>
                      <p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{loc.address}</p>
                      <div className="flex items-center gap-2 font-mono text-[8px] mt-2">
                        <span className={`px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-white/10 text-white border border-white/10' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>OPEN NOW</span>
                        <span className="text-slate-400">9 AM - 8 PM</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick store info panel */}
          {activeStore && (
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200/60 space-y-3">
              <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Outlet Details</h4>
              <p className="text-xs text-slate-550 leading-relaxed font-sans">{activeStore.description}</p>
              
              <div className="space-y-1.5 pt-2 border-t border-slate-200/50 font-mono text-[10px] text-slate-500">
                <div className="flex gap-2 items-center">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-800 font-semibold">{activeStore.phone}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-650 text-[9px] leading-tight">{activeStore.hours}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vector SVG Mapper Viewport & Routing Steps (Right) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/50 rounded-xl border border-slate-200/60 p-6 shadow-xs">
          
          {/* Interactive SVG City Blueprint Map (Left of grid) */}
          <div className="md:col-span-7 bg-slate-950 rounded-lg h-80 md:h-[420px] relative flex flex-col justify-between overflow-hidden text-white group border border-slate-900">
            {/* Top Bar Map Metadata */}
            <div className="p-4 z-10 flex justify-between items-center bg-slate-900/40 backdrop-blur-xs border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-slate-300">Live GIS Routing Grid</span>
              </div>
              <span className="bg-white/10 text-white font-mono text-[8px] px-2 py-0.5 rounded-sm border border-white/10">GPS VERIFIED</span>
            </div>

            {/* SVG MAP CANVAS BOARD */}
            <div className="absolute inset-x-0 top-14 bottom-0 p-4">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {/* Simulated Street Grid Patterns */}
                <line x1="10" y1="0" x2="10" y2="100" stroke="#111827" strokeWidth="0.5" strokeDasharray="1,2" />
                <line x1="30" y1="0" x2="30" y2="100" stroke="#111827" strokeWidth="0.8" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#111827" strokeWidth="0.5" strokeDasharray="1,2" />
                <line x1="70" y1="0" x2="70" y2="100" stroke="#111827" strokeWidth="0.8" />
                <line x1="90" y1="0" x2="90" y2="100" stroke="#111827" strokeWidth="0.5" strokeDasharray="1,2" />

                <line x1="0" y1="20" x2="100" y2="20" stroke="#111827" strokeWidth="0.5" strokeDasharray="1,2" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#111827" strokeWidth="0.8" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="#111827" strokeWidth="0.5" strokeDasharray="1,2" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#111827" strokeWidth="0.8" />

                {/* Simulated Park/Greenspace blocks */}
                <rect x="5" y="45" width="20" height="25" rx="1.5" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.2" />
                <rect x="75" y="10" width="18" height="20" rx="1.5" fill="#1e293b" opacity="0.3" stroke="#334155" strokeWidth="0.2" />

                {/* Central River / Waterway element */}
                <path d="M -10,95 Q 40,85 110,98" fill="none" stroke="#1e293b" strokeWidth="4" opacity="0.5" />

                {/* "MY CURRENT LOCATION" Point (Centrally simulated dot) */}
                <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
                <circle cx="50" cy="50" r="6" fill="none" stroke="#ffffff" strokeWidth="0.35" className="animate-ping" style={{ transformOrigin: '50px 50px' }} />
                
                {/* Text identifier for Current User spot */}
                <text x="50" y="45" fill="#ffffff" fontSize="2.8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">My Location</text>

                {/* Dynamic path routing line to active outlet */}
                {activeStore && (
                  <>
                    {/* Animated Route Path */}
                    <path
                      d={`M 50,50 L 50,${activeStore.coordinates.y} L ${activeStore.coordinates.x},${activeStore.coordinates.y}`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                      className="animate-dash"
                      style={{
                        strokeDasharray: '3',
                        animation: 'dash 15s linear infinite'
                      }}
                    />
                    
                    {/* Glowing highlight anchor ring over active store */}
                    <circle 
                      cx={activeStore.coordinates.x} 
                      cy={activeStore.coordinates.y} 
                      r="4" 
                      fill="none" 
                      stroke="#ffffff" 
                      strokeWidth="0.3" 
                      className="animate-ping" 
                      style={{ transformOrigin: `${activeStore.coordinates.x}px ${activeStore.coordinates.y}px`, animationDuration: '3s' }} 
                    />
                  </>
                )}

                {/* Render Interactive GPS pins for each outlet */}
                {locations.map((loc) => {
                  const isActive = loc.id === activeLocationId;
                  return (
                    <g 
                      key={loc.id} 
                      className="cursor-pointer group/pin"
                      onClick={() => setActiveLocationId(loc.id)}
                    >
                      {/* Active pin has bigger highlight bubble */}
                      <circle 
                        cx={loc.coordinates.x} 
                        cy={loc.coordinates.y} 
                        r={isActive ? 3.5 : 2} 
                        fill={isActive ? '#ffffff' : '#475569'} 
                        className="transition-all duration-300 hover:fill-slate-300"
                      />
                      <circle 
                        cx={loc.coordinates.x} 
                        cy={loc.coordinates.y} 
                        r={isActive ? 1.5 : 0.8} 
                        fill="#000000" 
                      />
                      
                      {/* Tiny text code matching node */}
                      <text 
                        x={loc.coordinates.x} 
                        y={loc.coordinates.y - (isActive ? 5 : 3.5)} 
                        fill={isActive ? '#ffffff' : '#94a3b8'} 
                        fontSize={isActive ? '3' : '2.2'} 
                        fontWeight={isActive ? 'bold' : 'normal'}
                        fontFamily="sans-serif" 
                        textAnchor="middle"
                        className="transition-colors uppercase pointer-events-none"
                      >
                        {loc.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Overlay Coordinates HUD info */}
            <div className="z-10 bg-slate-900/80 backdrop-blur border-t border-white/5 p-3 font-mono text-[8px] text-slate-400 flex justify-between select-none">
              <div>
                <span>Lat/Long: </span>
                <span className="text-slate-200 font-medium">40.7128° N, 74.0060° W</span>
              </div>
              <div>
                <span>Anchor Node: </span>
                <span className="text-white font-bold">{activeStore?.coordinates.x}x, {activeStore?.coordinates.y}y</span>
              </div>
            </div>
          </div>

          {/* Turn-by-Step Directions Guide Panel (Right of Grid) */}
          <div className="md:col-span-5 flex flex-col justify-between h-[420px]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-450">Direction Planner</span>
                
                {/* Choose Travel Mode Tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-md text-xs" id="travel-mode-tabs">
                  <button
                    onClick={() => setTravelMode('drive')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      travelMode === 'drive' ? 'bg-slate-950 font-bold text-white shadow-xs' : 'text-slate-450 hover:text-slate-950'
                    }`}
                    title="Driving Mode"
                  >
                    <Car className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTravelMode('walk')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      travelMode === 'walk' ? 'bg-slate-950 font-bold text-white shadow-xs' : 'text-slate-450 hover:text-slate-950'
                    }`}
                    title="Walking Route"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTravelMode('transit')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      travelMode === 'transit' ? 'bg-slate-950 font-bold text-white shadow-xs' : 'text-slate-450 hover:text-slate-950'
                    }`}
                    title="Public Transit"
                  >
                    <Train className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Steps Area scrollable */}
              <div className="space-y-4 pt-4 overflow-y-auto max-h-[300px] pr-1" id="directions-steps-list">
                <div className="flex gap-2.5 text-xs pb-1">
                  <div className="w-4.5 h-4.5 rounded bg-slate-950 border border-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    A
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-950 font-display">Origin Point</h5>
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">Simulated location anchor</p>
                  </div>
                </div>

                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2.5 text-[11px] items-start">
                    <span className="w-4.5 py-0.5 bg-slate-100 text-slate-600 font-mono text-[8px] text-center rounded flex-shrink-0 border border-slate-200/40">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-slate-700 font-medium leading-relaxed font-sans">{step.instruction}</p>
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">{step.distance}</span>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2.5 text-xs pt-1">
                  <div className="w-4.5 h-4.5 rounded bg-slate-950 border border-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    B
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-950 font-display">{activeStore?.name}</h5>
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">Storefront Arrival</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration metrics footer */}
            <div className="border-t border-slate-150 pt-3 flex justify-between items-center font-mono text-[9px]">
              <div>
                <span className="text-slate-400">EST. TIME: </span>
                <span className="font-bold text-slate-950">
                  {travelMode === 'drive' ? '14 MINS' : travelMode === 'walk' ? '42 MINS' : '22 MINS'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">DISTANCE: </span>
                <span className="font-bold text-slate-950">
                  {travelMode === 'drive' ? '2.6 MILES' : travelMode === 'walk' ? '1.8 MILES' : '2.2 MILES'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Dynamic inline stylesheet to handle the animated dash in SVG path */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 16s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
