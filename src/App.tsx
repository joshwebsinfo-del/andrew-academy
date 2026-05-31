/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, MapLocation, TrackedOrder, ChatMessage, DeliveryStatus, TrackingStep } from './types';
import { INITIAL_PHONES, INITIAL_LOCATIONS, INITIAL_ORDERS } from './mockData';
import Catalog from './components/Catalog';
import AdminPanel from './components/AdminPanel';
import LocationDetails from './components/LocationDetails';
import DeliveryTracker from './components/DeliveryTracker';
import ChatArea from './components/ChatArea';
import { Smartphone, MapPin, Truck, MessageSquare, ShoppingBag } from 'lucide-react';

export default function App() {
  // State handles with safety wrappers for persistent localStorage
  const [phones, setPhones] = useState<Phone[]>(() => {
    const cached = localStorage.getItem('nexus_phones');
    return cached ? JSON.parse(cached) : INITIAL_PHONES;
  });

  const [orders, setOrders] = useState<TrackedOrder[]>(() => {
    const cached = localStorage.getItem('nexus_orders');
    return cached ? JSON.parse(cached) : INITIAL_ORDERS;
  });

  const [activeTab, setActiveTab ] = useState<string>('catalogue');

  // Interactive chat message logs state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const cached = localStorage.getItem('nexus_chat');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'welcome-msg',
        sender: 'seller',
        text: 'Welcome to Nexus Mobile Shop! 📱 I am your interactive AI-powered seller assistant.\n\nI can directly assist you with locating flagships, comparing tech specs (e.g. "iPhone titanium vs Samsung S24 Ultra"), or routing tracking ID parameters (Ask "where is order TRK-89240-X?").\n\nHow can I help support your purchasing decisions today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Sync state mutations directly to local storage for bulletproof persistence
  useEffect(() => {
    localStorage.setItem('nexus_phones', JSON.stringify(phones));
  }, [phones]);

  useEffect(() => {
    localStorage.setItem('nexus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexus_chat', JSON.stringify(messages));
  }, [messages]);

  // Handle Specs detail "Inquire" click: triggers automatic message inside Chat area and redirects
  const handleOpenChatWithPhone = (phone: Phone) => {
    const textQuery = `Hi, I am interested in ordering the brand-new ${phone.brand} ${phone.model}. Can you tell me what makes this processor (${phone.processor}) stand out and if we have stock?`;
    
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: textQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setActiveTab('chat');

    // Simulate smart support response
    setTimeout(() => {
      const replyText = `Excellent choice! The **${phone.brand} ${phone.model}** is an absolute masterpiece. It features the elite **${phone.processor}** constructed on high performance CPU shaders.\n\nCurrently, we have **${phone.stock} units available** in our central dispatch layout, ready for packaging.\n\nIts key highlights are: ${phone.features.slice(0, 3).join(', ')}.\n\nWould you like to initiate checkout right here or from the Catalog screen?`;
      
      const botMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        sender: 'seller',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'view_phone',
          payload: phone.id
        }
      };
      setMessages([...updatedMsgs, botMsg]);
    }, 1200);
  };

  // Callback to authorize a brand new order from Catalog Quick Checkout Form
  const handlePlaceOrder = (
    phone: Phone,
    storage: string,
    color: string,
    customerName: string,
    deliveryAddress: string,
    courier: string
  ) => {
    // Generate high quality track code
    const uniqueId = `TRK-${Math.floor(10000 + Math.random() * 90000)}-${phone.brand.charAt(0).toUpperCase()}`;

    // Timeline steps initializer
    const steps: TrackingStep[] = [
      {
        status: 'ordered',
        label: 'Order Confirmed',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: 'Payment authorized successfully. Awaiting warehouse clearance.',
        completed: true
      },
      {
        status: 'processing',
        label: 'Quality Check Clearance',
        time: 'Pending',
        description: 'Physical inspection of sensors, screen bezel, and battery charging profile.',
        completed: false
      },
      {
        status: 'picked_up',
        label: 'Dispatched to Courier',
        time: 'Pending',
        description: `Cargo successfully packed and dispatched into ${courier} vehicle.`,
        completed: false
      },
      {
        status: 'in_transit',
        label: 'Sorting & Regional routing',
        time: 'Pending',
        description: 'En-route through regional sorting logistics hubs.',
        completed: false
      },
      {
        status: 'out_for_delivery',
        label: 'Courier Out for Delivery',
        time: 'Pending',
        description: 'Assigned to neighborhood courier driver. Delivery signature is required.',
        completed: false
      },
      {
        status: 'delivered',
        label: 'Parcel Delivered',
        time: 'Pending',
        description: 'Fulfillment report generated with recipient signature confirmation.',
        completed: false
      }
    ];

    const newOrder: TrackedOrder = {
      id: `ord-${Date.now()}`,
      customerName,
      phoneModel: `${phone.model} (${storage})`,
      brand: phone.brand,
      price: phone.price + (storage === '256GB' ? 100 : storage === '512GB' ? 220 : 0),
      date: new Date().toISOString().split('T')[0],
      trackingId: uniqueId,
      status: 'ordered',
      steps,
      courier,
      currentLocationName: 'Central Brooklyn Storehouse',
      deliveryEstimate: 'Arriving in 2-3 Business Days'
    };

    // Update listings stock in catalogue (decrement and save)
    const updatedPhones = phones.map((p) => {
      if (p.id === phone.id) {
        return { ...p, stock: Math.max(0, p.stock - 1) };
      }
      return p;
    });

    setPhones(updatedPhones);
    setOrders([newOrder, ...orders]);
    
    // Switch to tracker tab with automatic visual highlighting!
    setActiveTab('tracker');
    
    // Also append cute congrats confirmation to chat logs!
    const confirmAlertMsg: ChatMessage = {
      id: `chat-alert-${Date.now()}`,
      sender: 'seller',
      text: `🎉 Congratulations on your brand new purchase, **${customerName}**!\n\nYour order containing the **${phone.brand} ${phone.model} (${storage})** has been logged in our databases.\n\nTracking ID: \`${uniqueId}\`.\n\nUse our Logistics Tracker tab to trigger real-time route simulations for this package.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, confirmAlertMsg]);
  };

  // State accelerator diagnostic for tracking steps
  const handleAdvanceOrderStatus = (trackingId: string) => {
    const statuses: DeliveryStatus[] = ['ordered', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const waypointCoordinates = [
      'Brooklyn Storehouse',
      'Quality Testing Station',
      'DHL regional Courier vehicle',
      'Lexington Expressway Transit Hub',
      'Local neighborhood parcel station',
      'Signed by customer, Order completed!'
    ];

    const updatedOrders = orders.map((ord) => {
      if (ord.trackingId === trackingId) {
        const nextIdx = statuses.indexOf(ord.status) + 1;
        if (nextIdx < statuses.length) {
          const nextStatus = statuses[nextIdx];
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const updatedSteps = ord.steps.map((step, idx) => {
            if (idx === nextIdx) {
              return { ...step, completed: true, time: timeString };
            }
            return step;
          });

          return {
            ...ord,
            status: nextStatus,
            steps: updatedSteps,
            currentLocationName: waypointCoordinates[nextIdx],
            deliveryEstimate: nextStatus === 'delivered' ? `Delivered today at ${timeString}` : `Scheduled arrival (Update: ${nextStatus.replace('_', ' ').toUpperCase()})`
          };
        }
      }
      return ord;
    });

    setOrders(updatedOrders);
  };

  const handleSavePhones = (updatedPhones: Phone[]) => {
    setPhones(updatedPhones);
  };

  const handleResetToDefaults = () => {
    if (confirm('Verify: Reset list and clear custom local records?')) {
      localStorage.clear();
      setPhones(INITIAL_PHONES);
      setOrders(INITIAL_ORDERS);
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'seller',
          text: 'Welcome back to Nexus Mobile Shop! 📱 All databases reset to pristine default flagships.\n\nYou can ask me to compare flagships, retrieve information, locate our 3 branches, or track active shipments using your order tracking parameters.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveTab('catalogue');
    }
  };

  const handleNavigateToTab = (tab: string, payload?: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-950">
      
      {/* Top Brand Banner Header Layer - Sleek, blur-filtered, delicate borders */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center text-white shadow-sm">
            <Smartphone className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-950 leading-none font-display">NEXUS MOBILE</h1>
            <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase leading-none block mt-1">FLAGSHIP STUDIO & LOGISTICS</span>
          </div>
        </div>

        {/* Active View Select tabs */}
        <nav className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium gap-0.5 border border-slate-200/50" id="nav-tabs">
          <button
            id="tab-catalogue"
            onClick={() => setActiveTab('catalogue')}
            className={`py-1.5 px-3 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'catalogue' ? 'bg-white text-slate-950 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
            <span>Browse Catalog</span>
          </button>
          
          <button
            id="tab-locator"
            onClick={() => setActiveTab('locator')}
            className={`py-1.5 px-3 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'locator' ? 'bg-white text-slate-950 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Store Locator</span>
          </button>
          
          <button
            id="tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`py-1.5 px-3 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'tracker' ? 'bg-white text-slate-950 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            <span>Trace Order</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`py-1.5 px-3 rounded-md cursor-pointer transition-all flex items-center gap-1.5 relative ${
              activeTab === 'chat' ? 'bg-white text-slate-950 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Specialist Chat</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-950 rounded-full ring-2 ring-white" />
          </button>
        </nav>
      </header>

      {/* Main viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'catalogue' && (
          <Catalog
            phones={phones}
            onOpenChatWithPhone={handleOpenChatWithPhone}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            phones={phones}
            onSavePhones={handleSavePhones}
            onResetToDefaults={handleResetToDefaults}
          />
        )}

        {activeTab === 'locator' && (
          <LocationDetails
            locations={INITIAL_LOCATIONS}
          />
        )}

        {activeTab === 'tracker' && (
          <DeliveryTracker
            orders={orders}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onAddSampleOrder={() => {}}
          />
        )}

        {activeTab === 'chat' && (
          <ChatArea
            phones={phones}
            orders={orders}
            messages={messages}
            onAddMessage={(msg) => setMessages((prev) => [...prev, msg])}
            onClearChat={() => setMessages([])}
            onNavigateToTab={handleNavigateToTab}
          />
        )}
      </main>

      {/* Structured Minimal Sleek signature footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-10 px-6 text-center select-none mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4.5 h-4.5 text-slate-300" />
          <h2 className="text-white font-semibold text-xs tracking-wider scale-100 font-display uppercase">NEXUS MULTIVERSE</h2>
        </div>
        <p className="max-w-md text-[11px] leading-relaxed text-slate-400 font-sans font-light">
          Authorized flagship distribution network. Dynamic fulfillment logistics system, warranty management matrix, and live support channels.
        </p>
        <span className="text-[9px] font-mono text-slate-650 tracking-widest uppercase">
          © 2026 NEXUS SHIELDING CORP • FULFILLMENT LABS
        </span>
      </footer>

    </div>
  );
}
