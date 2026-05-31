/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Phone, TrackedOrder } from '../types';
import { Send, Sparkles, MessageSquare, RefreshCw, Cpu, User, HelpCircle, PhoneCall, Zap, ShoppingBag } from 'lucide-react';

interface ChatAreaProps {
  phones: Phone[];
  orders: TrackedOrder[];
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearChat: () => void;
  onNavigateToTab: (tab: string, arg?: string) => void;
}

export default function ChatArea({ phones, orders, messages, onAddMessage, onClearChat, onNavigateToTab }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle support trigger suggestion chips
  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    // Simulate smart support seller response after typing latency
    setTimeout(() => {
      const query = text.toLowerCase();
      let replyText = '';
      let action: ChatMessage['suggestedAction'] = undefined;

      // 1. Process Order and Tracking Lookups (e.g. TRK-89240-X)
      const trkMatch = query.match(/trk-\d+-\w/i);
      const possibleTrk = trkMatch ? trkMatch[0].toUpperCase() : null;
      const matchedOrder = possibleTrk ? orders.find((o) => o.trackingId === possibleTrk) : null;

      if (matchedOrder) {
        const statusMap: { [key: string]: string } = {
          ordered: 'received and currently processing invoice details',
          processing: 'undergoing device hardware checks in our warehouse',
          picked_up: 'handed off to the express courier vehicle',
          in_transit: 'sorted at regional transit routing hubs',
          out_for_delivery: 'out dispatching on active local neighborhood routes',
          delivered: 'delivered and signed successfully!'
        };
        replyText = `Hello! I have matched your tracking reference #**${matchedOrder.trackingId}**.\n\nYour order containing the **${matchedOrder.brand} ${matchedOrder.phoneModel}** is currently in the **${matchedOrder.status.replace('_', ' ').toUpperCase()}** stage. Specifically, the cargo is ${statusMap[matchedOrder.status]}.\n\nEstimated Dropoff: **${matchedOrder.deliveryEstimate}**.`;
        action = {
          type: 'track_order',
          payload: matchedOrder.trackingId
        };
      } else if (query.includes('track') || query.includes('where is my') || query.includes('delivery')) {
        // Find if user has any orders active
        if (orders.length > 0) {
          const firstOrd = orders[0];
          replyText = `I can definitely examine your shipment logs. I found a registered order for **${firstOrd.customerName}** containing the **${firstOrd.phoneModel}** (Tracking ID: **${firstOrd.trackingId}**).\n\nIts active stage is: **${firstOrd.status.toUpperCase()}**.\n\nWould you like to examine this order in our Delivery Tracking portal?`;
          action = {
            type: 'track_order',
            payload: firstOrd.trackingId
          };
        } else {
          replyText = `I can help you audit any shipped packages! Currently, there are no live verified orders under your browser session. You can easily construct a mock transaction by clicking "Buy & Specs" on any model in our Catalogue Area and filling out the quick checkout form.`;
        }
      } 
      // 2. Process specific catalog lookup requests (iPhone, Samsung, Google)
      else if (query.includes('apple') || query.includes('iphone')) {
        const applePhone = phones.find((p) => p.brand.toLowerCase() === 'apple');
        if (applePhone) {
          replyText = `Yes! We carry premium Apple iPhone models, including the incredible **${applePhone.model}** (${applePhone.storage}) priced at **$${applePhone.price} USD**.\n\nIt features the ${applePhone.processor} processor and ${applePhone.camera}.\n\nWould you like directly to navigate to its specifications worksheet to configure checkout forms?`;
          action = {
            type: 'view_phone',
            payload: applePhone.id
          };
        } else {
          replyText = `Apple devices are temporarily out of stock in our active warehouse matrix. Check back in 24 hours, or examine our Samsung Galaxy S24 Ultra listings!`;
        }
      } else if (query.includes('samsung') || query.includes('galaxy')) {
        const samsungPhone = phones.find((p) => p.brand.toLowerCase() === 'samsung');
        if (samsungPhone) {
          replyText = `Absolutely! Our leading Samsung flagship is the powerful **${samsungPhone.model}** containing **${samsungPhone.storage}** storage. Available at **$${samsungPhone.price} USD**.\n\nHighlight attributes include: ${samsungPhone.features.slice(0, 3).join(', ')}.\n\nWould you like to analyze its specifications details?`;
          action = {
            type: 'view_phone',
            payload: samsungPhone.id
          };
        } else {
          replyText = `We currently do not have Samsung devices listed, but you can add new smartphones via our Admin area!`;
        }
      } else if (query.includes('google') || query.includes('pixel')) {
        const pixelPhone = phones.find((p) => p.brand.toLowerCase() === 'google');
        if (pixelPhone) {
          replyText = `Indeed! We stock the **${pixelPhone.model}** featuring Google Tensor AI hardware inside.\n\nPrice point: **$${pixelPhone.price} USD**.\n\nI can trigger its specification modal if you would like to initiate custom ordering.`;
          action = {
            type: 'view_phone',
            payload: pixelPhone.id
          };
        } else {
          replyText = `Google listings are currently offline. You can use our top Admin Input panel to create a new one!`;
        }
      } else if (query.includes('nothing') || query.includes('glyph')) {
        const nothingPhone = phones.find((p) => p.brand.toLowerCase() === 'nothing');
        if (nothingPhone) {
          replyText = `Oh, the **${nothingPhone.model}**! A beautiful design carrying custom notification LED lights on the back. Price is only **$${nothingPhone.price} USD**.\n\nFeatures include: ${nothingPhone.features.slice(0, 3).join(', ')}.`;
          action = {
            type: 'view_phone',
            payload: nothingPhone.id
          };
        } else {
          replyText = `Nothing phones can easily be provisioned using our Admin spec generator. Just input a custom template!`;
        }
      } 
      // 3. Process comparison queries
      else if (query.includes('compare') || query.includes('versus') || query.includes('vs')) {
        replyText = `Let me help you compare our leading premium devices:\n\n1. **Apple iPhone 15 Pro Max**: Powered by the A17 Pro (3nm), features full Titanium frame, best suited for supreme videography.\n\n2. **Samsung Galaxy S24 Ultra**: High-density 200MP camera, Snapdragon 8 Gen 3 speed, and includes S-Pen for creative notations.\n\nBoth flagships are active inside our Catalog. I recommend Samsung for raw zoom and productivity, and iPhone for continuous system performance!`;
      } 
      // 4. Hours and locations
      else if (query.includes('store') || query.includes('hours') || query.includes('location') || query.includes('open')) {
        replyText = `We operate 3 premier physical branches:\n\n1. **Downtown Flagship Store** (Broadway Avenue) - Open Mon-Sat 9 AM - 8 PM.\n2. **Metro Galleria Mall Outlet** - Open Daily 10 AM - 9:30 PM.\n3. **Westside Hub & Repair Facility** - Expedited screen replacement services on 9th Ave.\n\nWould you like me to open our Store Locator navigation board for GPS maps and directions?`;
        action = {
          type: 'view_store',
          payload: 'loc-1'
        };
      } 
      // 5. Cheap / budget recommendations
      else if (query.includes('cheap') || query.includes('budget') || query.includes('best price') || query.includes('lowest')) {
        const sortedPhones = [...phones].sort((a,b) => a.price - b.price);
        const cheapest = sortedPhones[0];
        if (cheapest) {
          replyText = `Our most budget-friendly flagship is currently the gorgeous **${cheapest.model}** by **${cheapest.brand}** priced at **$${cheapest.price} USD**.\n\nDespite the competitive price, it carries a ${cheapest.battery} battery and a high-fidelity ${cheapest.camera}.\n\nWould you like to examine its full configurations?`;
          action = {
            type: 'view_phone',
            payload: cheapest.id
          };
        } else {
          replyText = `Our active listings are currently empty. Click on the Admin tab on your header to register a phone listing first!`;
        }
      }
      // Default help responses
      else {
        replyText = `Hello! I am your phone specialist support agent.\n\nI can directly assist you with:\n\n- **Inventory lookups** (Ask "Do you have the iPhone 15 or Pixel?")\n- **Detailed specs & prices** (Ask "What are Samsung Ultra features?")\n- **Dynamic tracking lookups** (Type "where is my delivery?" or input your active Tracking ID like \`TRK-89240-X\`)\n- **Physical branch coordinate checks** (Ask "what hours are stores open?")\n\nHow can I help support your purchase today?`;
      }

      const botMsg: ChatMessage = {
        id: `chat-${Date.now()}`,
        sender: 'seller',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      onAddMessage(botMsg);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden h-[540px] flex flex-col animate-fade-in" id="chat-section">
      {/* Seller Header panel */}
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-900 flex-shrink-0 text-white">
        <div className="flex items-center gap-3">
          {/* Avatar sphere */}
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-slate-905 border border-slate-800 flex items-center justify-center font-bold text-white shadow-xs">
              <MessageSquare className="w-5 h-5 text-slate-200" />
            </div>
            {/* Active white ping indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold leading-none">Support Specialist</h3>
            <h4 className="text-sm font-bold tracking-tight mt-1 leading-none text-white font-display">Dynamic Assistant</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-100 transition-all font-mono text-[10px] cursor-pointer border border-transparent hover:border-slate-800"
            title="Reset Chat Stream"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Message List area scrollable */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50" id="chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`chat-bubble-${msg.id}`}
            className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Geometric icon border */}
            <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono flex-shrink-0 border ${
              msg.sender === 'user' ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-950 text-white border-slate-900'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-slate-300" />}
            </div>

            <div className="space-y-1">
              <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed border shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-950 border-slate-950 text-white rounded-tr-none font-medium'
                  : 'bg-white border-slate-200 text-slate-905 rounded-tl-none font-medium'
              }`}>
                {/* Clean inline bullet spacing & line breaks render compatibility */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    // Quick bolding replacement check
                    let safeText = paragraph;
                    const matches = paragraph.match(/\*\*([^*]+)\*\*/g);
                    if (matches) {
                      matches.forEach((m) => {
                        const word = m.replace(/\*\*/g, '');
                        safeText = safeText.replace(m, word.toUpperCase());
                      });
                    }
                    return <p key={pIdx}>{safeText}</p>;
                  })}
                </div>

                {/* Suggested Action Links inside details card */}
                {msg.suggestedAction && (
                  <div className="mt-3.5 pt-3 border-t border-slate-150 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[9px] font-mono text-slate-400">Trigger shortcut:</span>
                    <button
                      id={`chat-action-btn-${msg.id}`}
                      onClick={() => {
                        if (msg.suggestedAction?.type === 'view_phone') {
                          onNavigateToTab('catalogue', msg.suggestedAction.payload);
                        } else if (msg.suggestedAction?.type === 'track_order') {
                          onNavigateToTab('tracker', msg.suggestedAction.payload);
                        } else if (msg.suggestedAction?.type === 'view_store') {
                          onNavigateToTab('locator', msg.suggestedAction.payload);
                        }
                      }}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-950 text-[10px] font-extrabold rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Check Details Stream</span>
                      <Zap className="w-3 h-3 text-slate-900 fill-slate-400" />
                    </button>
                  </div>
                )}
              </div>
              
              <span className={`text-[9px] font-mono text-slate-400 block ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Floating Typing Indicator bubble */}
        {isTyping && (
          <div className="flex gap-3 mr-auto" id="chat-typing-indicator">
            <div className="w-8 h-8 rounded bg-slate-950 text-slate-100 flex items-center justify-center border border-slate-900">
              <Sparkles className="w-4 h-4 text-slate-400 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Input Quick Option Chips list (Horizontal) */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none flex-shrink-0" id="chat-suggestion-chips">
        {[
          'Do you have iPhones?',
          'Where is order TRK-89240-X?',
          'What are your store hours?',
          'Recommend cheap phones'
        ].map((text, i) => (
          <button
            key={i}
            id={`suggest-chip-${i}`}
            onClick={() => handleSuggestionClick(text)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-650 hover:text-slate-950 hover:border-slate-950 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Input controller footer bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputText);
        }}
        className="p-4 bg-white border-t border-slate-200 flex gap-2 flex-shrink-0"
        id="chat-send-form"
      >
        <input
          type="text"
          id="chat-message-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask our phone expert (e.g. Compare Samsung and Apple, list cheap, tracker)..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-950/20 focus:border-slate-950 text-slate-900"
        />
        <button
          type="submit"
          className="p-2.5 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition-all shadow-xs cursor-pointer flex-shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
