'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Quote, Search, Users } from 'lucide-react';
import { getHonorableCustomers } from '@/lib/api';

// ─── Avatar fallback (same logic as HonorableCustomers slider) ──────────────
function AvatarFallback({ name }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  const colours = [
    'from-blue-500 to-blue-700',
    'from-emerald-500 to-emerald-700',
    'from-violet-500 to-violet-700',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-700',
  ];
  const idx = name ? name.charCodeAt(0) % colours.length : 0;
  return (
    <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${colours[idx]} flex items-center justify-center`}>
      <span className="text-2xl font-black text-white/90">{initials}</span>
    </div>
  );
}

// ─── Full customer card ───────────────────────────────────────────────────────
function CustomerDetailCard({ customer }) {
  const formattedDate = customer.date
    ? new Date(customer.date).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top section: avatar + identity */}
      <div className="p-5 pb-0 flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-slate-100">
          {customer.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={customer.image}
              alt={customer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarFallback name={customer.name} />
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-base text-slate-900 truncate">{customer.name}</h3>
          {formattedDate && (
            <p className="text-xs text-slate-400 mt-0.5">Purchased on {formattedDate}</p>
          )}
          <div className="flex gap-0.5 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-amber-400 text-xs">★</span>
            ))}
          </div>
        </div>
        {/* Quote icon decoration */}
        <Quote className="w-8 h-8 text-slate-100 shrink-0 group-hover:text-blue-100 transition-colors" />
      </div>

      {/* Description */}
      <div className="px-5 py-4 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed">{customer.description}</p>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          Verified Purchase
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Drone Bangladesh</span>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white border border-slate-100 p-5 space-y-3">
      <div className="flex gap-3 items-start">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-100 rounded w-3/5" />
          <div className="h-3 bg-slate-100 rounded w-2/5" />
          <div className="h-3 bg-slate-100 rounded w-1/4 mt-1" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
        <div className="h-3 bg-slate-100 rounded w-3/6" />
      </div>
    </div>
  );
}

// ─── Page component ──────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    let cancelled = false;
    getHonorableCustomers()
      .then((res) => {
        if (!cancelled && res?.success) setCustomers(res.data || []);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                Our Honorable Customers
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {loading ? 'Loading…' : `${customers.length} verified customer stories`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">

        {/* Search bar */}
        {!loading && customers.length > 3 && (
          <div className="mb-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or product…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-500">
              {search ? 'No customers match your search.' : 'No customer stories yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((customer) => (
              <CustomerDetailCard key={customer._id} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
