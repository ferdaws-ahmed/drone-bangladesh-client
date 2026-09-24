'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getFeaturedCategories } from '@/lib/api';

// Skeleton loader card
function CategorySkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 flex flex-col items-center">
      <div className="h-28 md:h-32 w-full bg-slate-200 rounded-lg mb-3" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFeaturedCategories()
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res) ? res : (res?.data || res?.categories || []);
          setCategories(list);
        }
      })
      .catch((err) => {
        console.error("Error fetching featured categories:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Don't render if no data and not loading
  if (!loading && categories.length === 0) return null;

  const toSlug = (name) =>
    String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  return (
    <section className="w-full bg-gray-50 py-6 md:py-8">
      {/* max-w-7xl ebong px-4 md:px-8 diye baki section-gular sathe layout width fix kora holo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            Featured Categories
          </h2>
        </div>

        {/* Grid Container (Image er sathe match kore column count fix kora holo) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.slice(0, 4).map((cat) => {
                const slug = toSlug(cat.name);
                return (
                  <Link
                    key={cat._id || cat.id}
                    href={`/drones/category/${slug}`}
                    className="group relative bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Image Area */}
                    <div className="relative h-28 md:h-36 w-full flex items-center justify-center overflow-hidden my-2">
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs font-medium">
                          No Image
                        </div>
                      )}

                      {/* Arrow Button Badge on Bottom Right */}
                      <div className="absolute bottom-1 right-1 w-7 h-7 rounded-md border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 group-hover:border-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-all duration-200 shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="w-full text-center mt-2">
                      <h3 className="text-xs md:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
        </div>

      </div>
    </section>
  );
}