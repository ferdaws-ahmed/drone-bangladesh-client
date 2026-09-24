'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function BaseMegaMenu({ isOpen, onClose, title, viewAllHref, jsonUrl, categoryPath = 'drones' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && jsonUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const apiUrl = jsonUrl.startsWith('http') 
        ? jsonUrl 
        : `${baseUrl}${jsonUrl.startsWith('/') ? '' : '/'}${jsonUrl}`;

      // কোনো প্রকার টোকেন বা অথেন্টিকেশন হেডার ছাড়া পাবলিক ফেচ রিকোয়েস্ট পাঠানো হচ্ছে
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((response) => {
          const categoryList = response.data || response;
          setItems(Array.isArray(categoryList) ? categoryList : []);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Backend category fetch failed:', err.message);
          setItems([]); 
          setLoading(false);
        });
    }
  }, [isOpen, jsonUrl]);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-[#F8FAFC] lg:absolute lg:top-full lg:left-0 lg:border-t lg:border-slate-200 lg:shadow-xl z-50 py-2 lg:py-8 px-0 sm:px-6 lg:px-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </h3>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              onClick={onClose}
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-0.5 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 lg:h-52 bg-slate-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs uppercase tracking-wide">
            No categories available right now. Please check backend API.
          </div>
        ) : (
          /* Grid Design */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2.5 lg:gap-5 py-2">
            {items.map((item) => (
              <Link
                key={item.id || item._id}
                href={`/${categoryPath}/category/${item.slug}`}
                onClick={onClose}
                className="group flex flex-col justify-between bg-white border border-slate-200/80 rounded-xl hover:shadow-md transition-all duration-200 text-center overflow-hidden h-36 lg:h-52"
              >
                {/* Image Container */}
                <div className="relative w-full h-24 lg:h-36 flex items-center justify-center p-2">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                </div>

                {/* Title Container */}
                <div className="py-2 px-1 border-t border-slate-100 bg-white flex items-center justify-center">
                  <span className="text-xs lg:text-sm font-bold uppercase text-[#0F172A] group-hover:text-[#E11D48] transition-colors line-clamp-1">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}