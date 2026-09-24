'use client';

import React from 'react';
import { Truck, ShieldCheck, CreditCard, Globe, Headphones } from 'lucide-react';

export default function TopBar() {
  const items = [
    { icon: <Truck className="w-3.5 h-3.5 text-amber-400" />, text: "Fast Delivery" },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />, text: "DJI Official Dealer" },
    { icon: <CreditCard className="w-3.5 h-3.5 text-emerald-400" />, text: "EMI Available" },
    { icon: <Globe className="w-3.5 h-3.5 text-red-400" />, text: "Bangladesh Wide Delivery" },
    { icon: <Headphones className="w-3.5 h-3.5 text-purple-400" />, text: "Expert Support" },
  ];

  return (
    <div className="w-full bg-[#0B132B] text-slate-200 text-xs py-2 border-b border-slate-800">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Layout Container to match site width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center">
            {[...items, ...items, ...items].map((item, index) => (
              <div key={index} className="flex items-center gap-2 mx-6 shrink-0">
                {item.icon}
                <span className="font-medium tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}