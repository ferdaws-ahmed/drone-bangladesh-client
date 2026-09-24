'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Truck, Clock3, CheckCircle2, ArrowRight,
  PackageSearch, UserCircle, RefreshCw, Package,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/lib/api';

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `৳${Number(n || 0).toLocaleString('en-BD')}`;
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusStyle = (s = '') => {
  const v = s.toLowerCase();
  if (v === 'delivered')                         return 'bg-emerald-100 text-emerald-700';
  if (v === 'cancelled')                         return 'bg-rose-100 text-rose-700';
  if (v === 'shipped' || v === 'out for delivery') return 'bg-blue-100 text-blue-700';
  return                                                'bg-amber-100 text-amber-700';
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, label, value, loading }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {loading
          ? <div className="h-5 w-10 bg-slate-100 rounded animate-pulse mt-1" />
          : <h3 className="text-xl font-bold text-slate-900">{value}</h3>
        }
      </div>
    </div>
  );
}

// ─── Overview page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getMyOrders();
    if (res?.success) {
      const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      setOrders(list);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derived stats
  const total     = orders.length;
  const inTransit = orders.filter((o) => {
    const s = (o.deliveryStatus || '').toLowerCase();
    return s === 'shipped' || s === 'out for delivery';
  }).length;
  const processing = orders.filter((o) => {
    const s = (o.deliveryStatus || o.orderStatus || '').toLowerCase();
    return s === 'processing' || s === 'confirmed' || s === 'pending';
  }).length;
  const delivered = orders.filter(
    (o) => (o.deliveryStatus || '').toLowerCase() === 'delivered'
  ).length;

  const recent = orders.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#002FA7] to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Here's a quick overview of your orders and account.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <UserCircle className="w-4 h-4" />
            Manage Profile
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShoppingBag}  iconBg="bg-blue-50 text-[#002FA7]"   label="Total Orders"  value={total}      loading={loading} />
          <StatCard icon={Clock3}       iconBg="bg-amber-50 text-amber-600"  label="Processing"    value={processing} loading={loading} />
          <StatCard icon={Truck}        iconBg="bg-blue-50 text-blue-600"    label="In Transit"    value={inTransit}  loading={loading} />
          <StatCard icon={CheckCircle2} iconBg="bg-emerald-50 text-emerald-600" label="Delivered"  value={delivered}  loading={loading} />
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-1 text-xs font-semibold text-[#002FA7] hover:underline"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-40 bg-slate-100 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center py-14 text-center">
              <Package className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No orders yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Your orders will appear here once you shop.
              </p>
              <Link
                href="/drones"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold px-4 py-2 hover:bg-slate-800 transition-colors"
              >
                Browse Drones <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((order) => {
                const status = order.deliveryStatus || order.orderStatus || 'Processing';
                const displayId = order.orderId || `#${String(order._id).slice(-8).toUpperCase()}`;
                const firstItem = order.items?.[0];
                return (
                  <div key={order._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {firstItem?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                          className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {firstItem?.name || displayId}
                          {order.items?.length > 1 && (
                            <span className="text-slate-400 font-normal ml-1">
                              +{order.items.length - 1} more
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {displayId} · {fmtDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-xs font-bold text-slate-700 hidden sm:block">
                        {fmt(order.pricing?.total)}
                      </p>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyle(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer CTA */}
          {!loading && recent.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#002FA7] hover:underline"
              >
                <PackageSearch className="w-3.5 h-3.5" />
                View all orders & track shipments
              </Link>
            </div>
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}
