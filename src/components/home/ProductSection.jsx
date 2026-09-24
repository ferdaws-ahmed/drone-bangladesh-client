'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import { getHomepageProducts } from '@/lib/api';

// ─── Skeleton card ────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white border border-slate-200/80 p-3 flex flex-col justify-between w-full h-72">
      <div className="h-32 bg-slate-100 rounded-lg mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/2 mt-3" />
      </div>
      <div className="h-8 bg-slate-100 rounded-lg mt-3" />
    </div>
  );
}

// ─── Product Card matching the exact image design ──────────────────────────────
function ProductCard({ product }) {
  const id = product._id;
  const price = product.pricing?.offerPrice || product.pricing?.regularPrice || 0;
  const regularPrice = product.pricing?.regularPrice || 0;
  const hasDiscount = regularPrice > price && price > 0;
  const discountPct = hasDiscount
    ? Math.round(((regularPrice - price) / regularPrice) * 100)
    : 0;

  const stockOut = product.stockStatus === 'Out of Stock';

  return (
    <div className="group relative flex flex-col bg-white border border-slate-200/80 rounded-xl p-3 hover:border-slate-300 hover:shadow-md transition-all duration-200 w-full min-w-0">
      
      {/* Badges (Discount & Stock status) - Top Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        {discountPct > 0 && (
          <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            -{discountPct}%
          </span>
        )}
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${stockOut ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {stockOut ? 'Stock Out' : 'Stock'}
        </span>
      </div>

      {/* Product Image Link */}
      <Link href={`/drones/product/${id}`} className="relative h-32 sm:h-36 w-full flex items-center justify-center bg-white overflow-hidden my-1">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-slate-300" />
          </div>
        )}

        {/* Small Arrow Icon on Bottom Right of Image Area matching reference */}
        <div className="absolute bottom-1 right-1 w-6 h-6 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </Link>

      {/* Product Title / Details */}
      <div className="flex flex-col flex-1 mt-2">
        <Link href={`/drones/product/${id}`}>
          <h3 className="text-xs font-medium text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors leading-snug min-h-[32px]">
            {product.title}
          </h3>
        </Link>

        {/* Pricing Area */}
        <div className="mt-2 mb-3">
          {hasDiscount && (
            <p className="text-[11px] text-slate-400 line-through leading-none mb-0.5">
              ৳{Number(regularPrice).toLocaleString('en-BD')}
            </p>
          )}
          <p className="text-sm font-extrabold text-red-600 leading-none">
            ৳{Number(price).toLocaleString('en-BD')}
          </p>
        </div>

        {/* Add to Cart Button matching image pill style */}
        <Link
          href={`/drones/product/${id}`}
          className="mt-auto w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </Link>
      </div>

    </div>
  );
}

// ─── ProductSection Component ─────────────────────────────────────────────────
export default function ProductSection({
  flag,
  title,
  viewAllHref = '/drones',
  limit = 10,
  bgColor = 'bg-gray-550', 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!flag) return;
    let cancelled = false;
    setLoading(true);
    getHomepageProducts(flag, limit)
      .then((res) => {
        if (!cancelled && res?.success) setProducts(res.data || []);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [flag, limit]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-gray-50 py-6 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with View All and Navigation Arrows matching image */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          
          <div className="flex items-center gap-3">
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
            </Link>
            
            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid / Row matching image structure */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.length > 0
              ? products.map((p) => <ProductCard key={p._id} product={p} />)
              : <div className="col-span-full py-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200/80">
                  No products available in this collection right now.
                </div>}
        </div>

      </div>
    </section>
  );
}