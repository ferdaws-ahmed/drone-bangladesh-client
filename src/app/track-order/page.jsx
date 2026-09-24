'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, Clock3, MapPin, Package, Search, Truck, 
  Phone, Mail, MessageCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;
const formatMoney = (amount) => `৳${Number(amount || 0).toLocaleString('en-BD')}`;

const STEPS = [
  { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'Processing', label: 'Processing', icon: Clock3 },
  { key: 'Packed', label: 'Packed', icon: Package },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

function TrackingOrderCard({ order, onTrack }) {
  const [showAllItems, setShowAllItems] = useState(false);
  
  // Dynamic status handling from database fields
  const currentStatus = order.deliveryStatus || order.orderStatus || 'Processing';
  
  const activeStepIndex = STEPS.findIndex(step => 
    step.key.toLowerCase() === currentStatus.toLowerCase()
  ) !== -1 ? STEPS.findIndex(step => step.key.toLowerCase() === currentStatus.toLowerCase()) : 1;

  const items = order.items || [];
  const displayedItems = showAllItems ? items : items.slice(0, 3);
  
  const shippingAddress = order.shippingAddress || {};
  const pricing = order.pricing || {};
  const courier = order.courier || {};

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Top Search & Filter Input Bar */}
      <div className="grid gap-4 md:grid-cols-3 pb-6 border-b border-slate-100 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Order ID</label>
          <div className="flex items-center h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm">
            <Package className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
            <span className="truncate font-medium">{order.orderId || String(order._id).slice(-8).toUpperCase()}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
          <div className="flex items-center h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm">
            <Phone className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
            <span className="font-medium">{shippingAddress.phone || order.customerInfo?.phone || 'N/A'}</span>
          </div>
        </div>

        <div>
          <button 
            type="button" 
            onClick={() => onTrack(order.orderId)}
            className="h-11 w-full rounded-lg bg-[#E11D48] text-white font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm"
          >
            Track Order
          </button>
        </div>
      </div>

      {/* Main Content Grid: Left Section & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 pt-6">
        
        {/* Left Section */}
        <div className="space-y-6">
          
          {/* Order Status Timeline */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Order Status</h3>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[620px] flex items-center justify-between relative px-4">
                <div className="absolute left-8 right-8 top-4 h-[2px] bg-slate-200 -z-0" />
                
                {STEPS.map((step, idx) => {
                  const isPassed = idx <= activeStepIndex;
                  const isCurrent = idx === activeStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all ${
                        isPassed ? 'bg-[#1E293B] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`mt-2 text-xs font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {idx === 0 && order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : isPassed ? 'Completed' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1"><Package className="h-3.5 w-3.5" /> Order No:</span>
              <span className="font-bold text-slate-800">{order.orderId || String(order._id).slice(-8).toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1"><Clock3 className="h-3.5 w-3.5" /> Date:</span>
              <span className="font-bold text-slate-800">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">💳 Payment:</span>
              <span className="font-bold text-slate-800">{order.paymentMethod || 'Cash on Delivery'}</span>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">📦 Tracking ID:</span>
              <span className="font-bold text-slate-800">{courier.providerOrderId || 'Pending'}</span>
            </div>
          </div>

          {/* Shipping Address and Ordered Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-[#E11D48]" /> Shipping Address
              </h3>
              <p className="font-bold text-sm text-slate-900">{shippingAddress.fullName || order.customerInfo?.name || 'Valued Customer'}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{shippingAddress.address || 'Address not provided'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{[shippingAddress.upazila, shippingAddress.district].filter(Boolean).join(', ')}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{shippingAddress.phone || order.customerInfo?.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Ordered Products Table */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 pb-2 border-b border-slate-100">
                  <span>Product</span>
                  <div className="flex gap-8">
                    <span>Qty</span>
                    <span>Price</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {displayedItems.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.image && <img src={item.image} alt={item.name} className="h-9 w-9 rounded object-cover border shrink-0" />}
                        <span className="truncate text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-8 shrink-0 text-right">
                        <span className="text-slate-600 font-medium">{item.quantity}</span>
                        <span className="font-bold text-slate-900 w-16 text-right">{formatMoney(Number(item.price) * Number(item.quantity))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {items.length > 3 && (
                <button 
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="mt-3 text-xs font-bold text-[#E11D48] flex items-center gap-1 hover:underline pt-2 border-t border-slate-100"
                >
                  {showAllItems ? <>Show Less <ChevronUp className="h-3.5 w-3.5" /></> : <>View More Items ({items.length - 3}) <ChevronDown className="h-3.5 w-3.5" /></>}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <aside className="space-y-5">
          {/* Current Status Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Current Status</span>
              <span className="rounded-full bg-blue-50 text-blue-600 border border-blue-200 px-3 py-0.5 text-xs font-bold">
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your order is {currentStatus.toLowerCase()}. <br />Our rider is on the way to deliver your package.
            </p>
            {courier.provider && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Courier Partner</span>
                <span className="font-black text-rose-600 tracking-wider uppercase">{courier.provider}</span>
              </div>
            )}
          </div>

          {/* Need Help Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <Phone className="h-4 w-4 text-slate-700" /> Need Help?
            </h4>
            <p className="text-xs text-slate-500 mb-3">Our support team is ready to assist you.</p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" /><span className="font-bold">09613-500600</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400" /><span>support@dronebangladesh.com</span></div>
            </div>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" /> Chat with Us
            </a>
          </div>

          {/* Delivery Timeline Vertical List */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Delivery Timeline</h4>
            <div className="space-y-3 relative before:absolute before:bottom-2 before:top-2 before:left-2.5 before:w-0.5 before:bg-slate-200">
              {VerticalTimelineSimulation(order)}
            </div>
          </div>

          {/* Order Total Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5 text-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Order Total</h4>
            <div className="flex justify-between text-slate-500">
              <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span className="font-semibold text-slate-800">{formatMoney(pricing.subtotal || pricing.total)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Charge</span>
              <span className="font-semibold text-slate-800">{formatMoney(pricing.shipping || 0)}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between text-sm font-black text-[#E11D48]">
              <span>Total</span>
              <span>{formatMoney(pricing.total)}</span>
            </div>
          </div>
        </aside>

      </div>
    </article>
  );
}

function VerticalTimelineSimulation(order) {
  const currentStatus = order.deliveryStatus || order.orderStatus || 'Processing';
  const activeIdx = STEPS.findIndex(s => s.key.toLowerCase() === currentStatus.toLowerCase());

  return STEPS.map((step, idx) => {
    const isDone = idx <= (activeIdx !== -1 ? activeIdx : 1);
    return (
      <div key={step.key} className="flex gap-3 relative z-10 items-start">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
          isDone ? 'bg-[#1E293B] text-white' : 'bg-slate-200 text-slate-400'
        }`}>
          ✓
        </div>
        <div>
          <p className={`font-bold text-xs ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
          <p className="text-[10px] text-slate-400">
            {idx === 0 && order.createdAt ? new Date(order.createdAt).toLocaleString() : isDone ? 'Completed' : 'Pending'}
          </p>
        </div>
      </div>
    );
  });
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill orderId from ?orderId= query param (coming from dashboard orders page)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId');
    if (id) {
      setOrderId(id);
      // auto-track immediately
      const doTrack = async () => {
        setLoading(true);
        setError('');
        const response = await api.get(`/orders/mine/${encodeURIComponent(id.trim())}`);
        if (response.success) {
          setOrder(getResponseData(response));
        } else {
          setError(response.message || 'Order not found in your account.');
        }
        setLoading(false);
      };
      doTrack();
    }
  }, []);

  const trackOrder = async (value = orderId) => {
    const normalizedOrderId = value.trim();
    if (!normalizedOrderId) {
      setError('Enter your order ID to track an order.');
      setOrder(null);
      return;
    }

    setLoading(true);
    setError('');
    const response = await api.get(`/orders/mine/${encodeURIComponent(normalizedOrderId)}`);
    if (response.success) {
      setOrder(getResponseData(response));
      setOrderId(normalizedOrderId);
    } else {
      setOrder(null);
      setError(response.message || 'That order was not found in your account.');
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-500 mb-1">Home / Track Order</p>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Track Your Order</h1>
          </div>

          <div className="space-y-6">
            <form onSubmit={(event) => { event.preventDefault(); trackOrder(); }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
                <label className="block text-xs font-semibold text-slate-700">
                  Order ID
                  <div className="mt-1.5 flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3.5">
                    <Package className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
                    <input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="#ORD-63457-9368" className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none" />
                  </div>
                </label>
                <button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-[#E11D48] text-sm font-bold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Checking...' : 'Track Order'}
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            </form>

            {order ? (
              <TrackingOrderCard order={order} onTrack={trackOrder} />
            ) : !loading && !error ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 text-lg font-bold text-slate-900">Enter an order ID</h2>
              <p className="mt-2 text-sm text-slate-500">Only orders belonging to your account can be tracked.</p>
              <Link href="/drones" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
                Continue shopping
              </Link>
            </div>
            ) : null}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}