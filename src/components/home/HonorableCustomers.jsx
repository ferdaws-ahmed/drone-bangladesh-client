'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHonorableCustomers } from '@/lib/api';

export default function HonorableCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const scrollRef                 = useRef(null);
  const autoScrollRef             = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getHonorableCustomers()
      .then((res) => {
        if (!cancelled && res?.success) {
          setCustomers(res.data || []);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Auto-scroll effect for the image slider
  const startAutoScroll = useCallback(() => {
    if (!scrollRef.current) return;
    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If reached the end, loop back to start, otherwise scroll forward by 220px
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }
    }, 3500);
  }, []);

  useEffect(() => {
    if (customers.length > 5) {
      startAutoScroll();
    }
    return () => clearInterval(autoScrollRef.current);
  }, [customers.length, startAutoScroll]);

  const handleManualScroll = (direction) => {
    clearInterval(autoScrollRef.current);
    if (scrollRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
    startAutoScroll();
  };

  return (
    <section className="w-full bg-gray-50 py-6 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header matching layout */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
            Our Honorable Customers
          </h2>
          
          <div className="flex items-center gap-3">
            <Link
              href="/customers"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
            </Link>
            
            {/* Carousel Arrow Controls */}
            {customers.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleManualScroll('left')}
                  className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleManualScroll('right')}
                  className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sliding Image Container */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse shrink-0 w-40 sm:w-48 h-36 md:h-40 bg-slate-200 rounded-xl" />
            ))
          ) : customers.length > 0 ? (
            customers.map((customer, i) => (
              <div 
                key={customer._id || i}
                className="shrink-0 w-44 sm:w-52 md:w-60 h-36 sm:h-40 md:h-44 rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {customer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={customer.image}
                    alt={customer.name || 'Honorable Customer'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    No Image
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full py-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200/80">
              No customer images available right now.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}