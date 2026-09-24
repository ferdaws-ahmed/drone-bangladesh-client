'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package, RefreshCw, MapPin, Clock3, Truck,
  CheckCircle2, XCircle, AlertCircle, ArrowRight,
  ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getMyOrders } from '@/lib/api';

// ─── helpers ──────────────────────────────────────────────────────────────────
const formatMoney = (n) => `৳${Number(n || 0).toLocaleString('en-BD')}`;

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-BD', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

// Map delivery/order status → colour token
const statusStyle = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'delivered')        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'cancelled')        return 'bg-rose-50 text-rose-700 border-rose-200';
  if (s === 'shipped' || s === 'out for delivery')
                                return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'processing')       return 'bg-amber-50 text-amber-700 border-amber-200';
  return                               'bg-slate-50 text-slate-600 border-slate-200';
};

const statusIcon = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'delivered')                        return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (s === 'cancelled')                        return <XCircle className="w-3.5 h-3.5" />;
  if (s === 'shipped' || s === 'out for delivery') return <Truck className="w-3.5 h-3.5" />;
  if (s === 'processing')                       return <Clock3 className="w-3.5 h-3.5" />;
  return                                               <AlertCircle className="w-3.5 h-3.5" />;
};

// ─── Single order card ────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const displayId   = order.orderId || `#${String(order._id).slice(-8).toUpperCase()}`;
  const status      = order.deliveryStatus || order.orderStatus || 'Processing';
  const items       = order.items || [];
  const pricing     = order.pricing || {};
  const shippingAddr = order.shippingAddress || {};

  const handleTrack = () => {
    // Navigate to track-order page pre-filled with this order's ID
    router.push(`/track-order?orderId=${encodeURIComponent(order.orderId || '')}`);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Card header ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{displayId}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle(status)}`}>
            {statusIcon(status)}
            {status}
          </span>

          {/* Track Order button */}
          <button
            type="button"
            onClick={handleTrack}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 transition-colors shadow-sm"
          >
            <Truck className="w-3.5 h-3.5" />
            Track Order
          </button>
        </div>
      </div>

      {/* ── Items preview ─────────────────────────────────────────── */}
      <div className="px-5 py-3 space-y-2.5">
        {(expanded ? items : items.slice(0, 2)).map((item, idx) => (
          <div key={`${item.productId}-${idx}`} className="flex items-center gap-3">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-slate-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-400">Qty: {item.quantity} × {formatMoney(item.price)}</p>
            </div>
            <p className="text-xs font-bold text-slate-700 shrink-0">
              {formatMoney(Number(item.price) * Number(item.quantity))}
            </p>
          </div>
        ))}

        {items.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-1"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> +{items.length - 2} more item{items.length - 2 !== 1 ? 's' : ''}</>
            )}
          </button>
        )}
      </div>

      {/* ── Card footer ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-50/60 border-t border-slate-100">
        {/* Shipping address snippet */}
        {shippingAddr.district && (
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate max-w-[50%]">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            {[shippingAddr.upazila, shippingAddr.district].filter(Boolean).join(', ')}
          </p>
        )}

        {/* Total */}
        <p className="ml-auto text-sm font-extrabold text-slate-900">
          Total: {formatMoney(pricing.total)}
        </p>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function OrderSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-8 w-28 bg-slate-100 rounded-xl" />
      </div>
      <div className="px-5 py-4 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-100 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const res = await getMyOrders();
    if (res?.success) {
      // getMyOrders returns array directly in res.data
      const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      setOrders(list);
    } else {
      setError(res?.message || 'Failed to load orders.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ProtectedRoute>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id || order.orderId} order={order} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Package className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-base font-bold text-slate-700">No orders yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-6">
              Browse our drone collection and place your first order.
            </p>
            <Link
              href="/drones"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
