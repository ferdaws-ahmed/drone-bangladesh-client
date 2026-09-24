'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { 
  MapPin, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  CreditCard, 
  Smartphone,
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  Tag 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCartWishlist } from '@/context/CartWishlistContext';
import api from '@/lib/api';

const getProduct = (item) => item.product || item;
const getId = (item) => getProduct(item)?._id || getProduct(item)?.id;
const getPrice = (product, paymentType = 'cash') => {
  const offerPrice = Number(product?.pricing?.offerPrice || product?.offerPrice || product?.price || product?.regularPrice || 0);
  if (paymentType !== 'emi') return offerPrice;
  const emiPercentage = Number(product?.pricing?.emiPercentage || 0);
  return offerPrice + (offerPrice * emiPercentage) / 100;
};
const getTitle = (product) => product?.title || product?.name || 'Product';
const getImage = (product) => product?.images?.[0] || product?.image || '';
const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;

const paymentMethods = [
  { id: 'bkash', label: 'bKash', image: '/images/payment/bkash.png' },
  { id: 'nagad', label: 'Nagad', image: '/images/payment/nagad.png' },
  { id: 'rocket', label: 'Rocket', image: '/images/payment/rocket.png' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, loading, clearCart } = useCartWishlist();
  const [localCart, setLocalCart] = useState(null);
  const [singleItem, setSingleItem] = useState(null);
  const [singleRequested, setSingleRequested] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentMobile, setPaymentMobile] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [storeSettings, setStoreSettings] = useState(null);

  useEffect(() => {
    api.get('/settings', { auth: false }).then((response) => {
      if (response.success) setStoreSettings(getResponseData(response));
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) return;

    const quantity = Math.max(1, Number(params.get('qty')) || 1);
    const paymentType = params.get('type') === 'emi' ? 'emi' : 'cash';
    const productType = params.get('productType') === 'handhelds' ? 'handhelds' : 'drones';

    const fetchSingleProduct = async () => {
      setSingleRequested(true);
      setSingleLoading(true);
      let response = await api.get(`/client/${productType}/product/${productId}`, { auth: false });
      let product = getResponseData(response);

      if (!response?.success || !product || Array.isArray(product)) {
        const fallbackType = productType === 'drones' ? 'handhelds' : 'drones';
        response = await api.get(`/client/${fallbackType}/product/${productId}`, { auth: false });
        product = getResponseData(response);
      }

      if (response?.success && product && !Array.isArray(product)) {
        setSingleItem({ product, quantity, paymentType });
      }
      setSingleLoading(false);
    };

    fetchSingleProduct();
  }, []);

  // Splitting user's name if available into first and last name
  const nameParts = (user?.name || '').trim().split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [form, setForm] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    address: '',
    upazila: '',
    district: 'Dhaka',
    phone: '',
    email: user?.email || '',
    orderNote: ''
  });

  const currentCart = singleRequested ? (singleItem ? [singleItem] : []) : (localCart ?? cart);
  const subtotal = currentCart.reduce((sum, item) => sum + getPrice(getProduct(item), item.paymentType) * (item.quantity || 1), 0);
  const shippingCharge = subtotal > 0 ? 150 : 0;
  const discount = Math.min(Number(appliedCoupon?.discountAmount) || 0, subtotal + shippingCharge);
  const total = subtotal + shippingCharge - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMessage('Enter a coupon code.');
      return;
    }
    setCouponLoading(true);
    setCouponMessage('');
    const response = await api.post('/coupons/validate', { code: coupon, subtotal });
    const data = getResponseData(response);
    if (response.success && data) {
      setAppliedCoupon(data);
      setCoupon(data.code);
      setCouponMessage(`Coupon applied: ${Number(data.discountAmount).toLocaleString()}৳ off`);
    } else {
      setAppliedCoupon(null);
      setCouponMessage(response.message || 'This coupon is not valid.');
    }
    setCouponLoading(false);
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    if (singleItem) {
      setSingleItem((prev) => ({ ...prev, quantity: newQty }));
      setAppliedCoupon(null);
      setCouponMessage('');
      return;
    }
    const updated = currentCart.map(item => {
      if (getId(item) === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setLocalCart(updated);
    setAppliedCoupon(null);
    setCouponMessage('');
    try {
      await api.put('/cart', { productId, quantity: newQty });
    } catch (e) {
      // Fallback local update if API endpoint differs
    }
  };

  const removeFromCart = async (productId) => {
    if (singleItem) {
      setSingleItem(null);
      setAppliedCoupon(null);
      setCouponMessage('');
      return;
    }
    const updated = currentCart.filter(item => getId(item) !== productId);
    setLocalCart(updated);
    setAppliedCoupon(null);
    setCouponMessage('');
    try {
      await api.delete(`/cart/${productId}`);
    } catch (e) {
      // Fallback local update if API endpoint differs
    }
  };

  const submitOrder = (event) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  const confirmOrder = async () => {
    if (paymentMethod !== 'Cash on Delivery' && (!paymentMobile.trim() || !transactionId.trim())) {
      setPaymentError('Mobile number and transaction ID are required for online payment.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    setPaymentError('');

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const orderItems = currentCart;

    const response = await api.post('/orders', {
      items: orderItems.map((item) => {
        const product = getProduct(item);
        return {
          productId: getId(item),
          name: getTitle(product),
          image: getImage(product),
          price: getPrice(product, item.paymentType),
          regularPrice: Number(product?.pricing?.regularPrice || product?.regularPrice || 0),
          sku: product?.sku || null,
          category: product?.category || null,
          productType: product?.productType || null,
          paymentType: item.paymentType || 'cash',
          quantity: item.quantity || 1,
          productSnapshot: product,
        };
      }),
      customerInfo: {
        name: fullName,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone
      },
      shippingAddress: {
        address: form.address,
        upazila: form.upazila,
        district: form.district
      },
      notes: form.orderNote,
      checkoutType: singleItem ? 'single-product' : 'cart',
      couponCode: appliedCoupon?.code || null,
      discount,
      subtotal,
      shipping: shippingCharge,
      tax: 0,
      total,
      paymentMethod,
      paymentDetails: paymentMethod === 'Cash on Delivery' ? null : {
        method: paymentMethod,
        mobileNumber: paymentMobile.trim(),
        transactionId: transactionId.trim(),
      },
    });

    if (response.success) {
      if (!singleItem) {
        try {
          await clearCart();
        } catch (error) {
          console.error('Order placed, but cart cleanup failed:', error);
        }
      }
      setInvoice(getResponseData(response)?.order || getResponseData(response));
      setConfirmOpen(false);
    } else {
      setMessage(response.message || 'Could not place the order.');
    }
    setSubmitting(false);
  };

  const downloadInvoice = () => {
    if (!invoice) return;
    const document = new jsPDF();
    const contact = storeSettings?.contact || {};
    const lines = [
      'ORDER INVOICE',
      storeSettings?.storeName || 'Store Invoice',
      contact.address || '',
      [contact.phone, contact.email].filter(Boolean).join(' | '),
      '',
      `Order: ${invoice.orderId || invoice._id}`,
      `Date: ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : new Date().toLocaleString()}`,
      `Customer: ${invoice.customerInfo?.name || ''}`,
      `Phone: ${invoice.customerInfo?.phone || ''}`,
      `Email: ${invoice.customerInfo?.email || ''}`,
      `Payment: ${invoice.paymentMethod || 'Cash on Delivery'} (${invoice.paymentStatus || 'Pending'})`,
      invoice.paymentDetails ? `Transaction: ${invoice.paymentDetails.transactionId || ''}` : '',
      '',
      ...(invoice.items || []).map((item) => `${item.name} x ${item.quantity}: ${Number(item.price * item.quantity).toLocaleString()} BDT`),
      '',
      `Subtotal: ${Number(invoice.pricing?.subtotal || 0).toLocaleString()} BDT`,
      `Delivery: ${Number(invoice.pricing?.shipping || 0).toLocaleString()} BDT`,
      `Discount: ${Number(invoice.pricing?.discount || 0).toLocaleString()} BDT`,
      `Total: ${Number(invoice.pricing?.total || 0).toLocaleString()} BDT`,
    ];
    document.setFontSize(11);
    document.text(lines, 20, 25, { lineHeightFactor: 1.6 });
    document.save(`${invoice.orderId || 'order'}-invoice.pdf`);
  };

  if ((loading && !singleRequested && localCart === null) || singleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500 font-medium">
        Loading checkout...
      </div>
    );
  }

  const displayCart = currentCart;

  if (!displayCart.length && !message) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Your cart is empty</h1>
        <p className="text-slate-500 text-sm mt-2">Add some items to your cart to proceed with checkout.</p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center mt-6 px-6 py-3 bg-[#002FA7] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-800 transition-colors"
        >
          Back to shopping
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Checkout</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">Checkout</h1>

        {message ? (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{message}</h2>
            <p className="text-sm text-slate-500">We have received your order and are processing it.</p>
            <button 
              onClick={() => router.push('/')} 
              className="w-full py-3 bg-[#002FA7] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <form onSubmit={submitOrder} className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            
            {/* Left Column: Shipping & Delivery Info */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">Shipping Information</h2>
              </div>

              {/* First Name & Last Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    First Name <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Last Name <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Address <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="House / Road / Flat / Building"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                />
              </div>

              {/* Upazila & District */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Upazila / Thana <span className="text-[#E11D48]">*</span>
                  </label>
                  <select
                    name="upazila"
                    required
                    value={form.upazila}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  >
                    <option value="">Select Upazila / Thana</option>
                    <option value="Dhanmondi">Dhanmondi</option>
                    <option value="Gulshan">Gulshan</option>
                    <option value="Banani">Banani</option>
                    <option value="Uttara">Uttara</option>
                    <option value="Mirpur">Mirpur</option>
                    <option value="Tejgaon">Tejgaon</option>
                    <option value="Mohakhali">Mohakhali</option>
                    <option value="Motijheel">Motijheel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    District <span className="text-[#E11D48]">*</span>
                  </label>
                  <select
                    name="district"
                    required
                    value={form.district}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                   
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                  </select>
                </div>
              </div>

              {/* Mobile Number & Email Address */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Number <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all"
                  />
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Delivery Method
                </label>
                <div className="border-2 border-[#E11D48] bg-rose-50/30 rounded-2xl p-4 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      defaultChecked 
                      className="w-4 h-4 text-[#E11D48] accent-[#E11D48]" 
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Courier Delivery</p>
                      <p className="text-xs text-slate-500 mt-0.5">We will deliver your order to your address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#E11D48] font-black text-sm bg-white px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">
                    <Truck className="w-4 h-4" />
                    <span>150৳</span>
                  </div>
                </div>
              </div>

              {/* Order Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Order Note (Optional)
                </label>
                <textarea
                  name="orderNote"
                  rows={3}
                  placeholder="Any special instruction for delivery..."
                  value={form.orderNote}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#002FA7] bg-slate-50/30 transition-all resize-none"
                />
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-slate-900">Order Summary</h2>
                </div>

                {/* Dynamic Cart Items List */}
                <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-1">
                  {displayCart.map((item) => {
                    const product = getProduct(item);
                    const prodId = getId(item);
                    const title = getTitle(product);
                    const price = getPrice(product, item.paymentType);
                    const image = getImage(product);
                    const qty = item.quantity || 1;

                    return (
                      <div key={prodId} className="py-3.5 flex items-center gap-3 text-sm relative group">
                        {image ? (
                          <img 
                            src={image} 
                            alt={title} 
                            className="w-12 h-12 object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-50" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                            No img
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-xs line-clamp-1">{title}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button
                                type="button"
                                onClick={() => updateQuantity(prodId, qty - 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-900">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(prodId, qty + 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                              {price.toLocaleString()}৳/unit
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-black text-[#E11D48] text-xs">
                            {(price * qty).toLocaleString()}৳
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(prodId)}
                            className="text-slate-400 hover:text-rose-600 transition-colors mt-1 inline-block"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculations Breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Sub-Total</span>
                    <span className="font-bold text-slate-900">{subtotal.toLocaleString()}৳</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-slate-900">{shippingCharge.toLocaleString()}৳</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Coupon Discount</span>
                      <span className="font-bold">-{discount.toLocaleString()}৳</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-[#E11D48]">
                    <span>Total Amount</span>
                    <span>{total.toLocaleString()}৳</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Tag className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>Have a Coupon?</span>
                  </div>
                  <p className="text-xs text-slate-500">Apply coupon code for discount</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setCouponMessage('');
                        if (appliedCoupon && e.target.value.trim().toUpperCase() !== appliedCoupon.code) setAppliedCoupon(null);
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#002FA7]"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponMessage && <p className={`text-xs font-semibold ${appliedCoupon ? 'text-emerald-600' : 'text-rose-600'}`}>{couponMessage}</p>}
                </div>

                {/* Security Trust Notice */}
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Your personal data is secured and encrypted.</span>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#E11D48] hover:bg-rose-700 disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {submitting ? 'Placing order...' : 'Confirm Order'}
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  You will be able to review your order in the next step
                </p>
              </div>
            </div>

          </form>
        )}

        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-black text-slate-900">Confirm your order?</h2>
              <p className="mt-2 text-sm text-slate-500">Please confirm the order details before placing it.</p>
              <div className="mt-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Choose payment method</p>
                <button type="button" onClick={() => { setPaymentMethod('Cash on Delivery'); setPaymentError(''); }} className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${paymentMethod === 'Cash on Delivery' ? 'border-[#E11D48] bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><CreditCard className="h-5 w-5" /></span>
                  <span><span className="block text-sm font-bold text-slate-900">Cash on Delivery</span><span className="block text-xs text-slate-500">Pay when your order arrives</span></span>
                </button>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button key={method.id} type="button" onClick={() => { setPaymentMethod(method.label); setPaymentError(''); }} className={`rounded-xl border-2 p-2 transition ${paymentMethod === method.label ? 'border-[#E11D48] bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <img src={method.image} alt={method.label} className="mx-auto h-8 w-16 object-contain" />
                      <span className="mt-1 block text-xs font-bold text-slate-700">{method.label}</span>
                    </button>
                  ))}
                </div>
                {paymentMethod !== 'Cash on Delivery' && (
                  <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                    <label className="text-xs font-bold text-slate-700">Mobile number<input required type="tel" value={paymentMobile} onChange={(event) => setPaymentMobile(event.target.value)} placeholder="01XXXXXXXXX" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#002FA7]" /></label>
                    <label className="text-xs font-bold text-slate-700">Transaction ID<input required type="text" value={transactionId} onChange={(event) => setTransactionId(event.target.value)} placeholder="Enter transaction ID" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#002FA7]" /></label>
                    <p className="flex items-center gap-1 text-[11px] text-slate-500 sm:col-span-2"><Smartphone className="h-3.5 w-3.5" />Payment will remain pending until admin verification.</p>
                  </div>
                )}
                {paymentError && <p className="text-xs font-semibold text-rose-600">{paymentError}</p>}
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setConfirmOpen(false)} disabled={submitting} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="button" onClick={confirmOrder} disabled={submitting} className="flex-1 rounded-xl bg-[#E11D48] py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60">
                  {submitting ? 'Confirming...' : 'Yes, confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {invoice && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 px-4 py-8">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="bg-slate-950 px-6 py-7 text-white sm:px-8">
                <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Payment submitted for verification</p>
                  <h2 className="mt-1 text-3xl font-black">{storeSettings?.storeName || 'Order Invoice'}</h2>
                  <p className="mt-2 max-w-md text-xs text-slate-300">{storeSettings?.contact?.address || ''}</p>
                  <p className="text-xs text-slate-300">{[storeSettings?.contact?.phone, storeSettings?.contact?.email].filter(Boolean).join(' · ')}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Pending review</span>
                </div>
                <div className="mt-6 grid gap-2 border-t border-white/10 pt-4 text-xs text-slate-300 sm:grid-cols-3"><p><span className="block text-slate-500">Invoice number</span>{invoice.orderId || invoice._id}</p><p><span className="block text-slate-500">Issued</span>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : new Date().toLocaleString()}</p><p><span className="block text-slate-500">Payment status</span>{invoice.paymentStatus || 'Pending'}</p></div>
              </div>
              <div className="p-6 sm:p-8">
              <div className="grid gap-5 border-b border-slate-100 pb-6 text-sm sm:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Billed to</p><p className="mt-2 font-bold text-slate-900">{invoice.customerInfo?.name}</p><p className="text-slate-500">{invoice.customerInfo?.email}</p><p className="text-slate-500">{invoice.customerInfo?.phone}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery address</p><p className="mt-2 text-slate-700">{invoice.shippingAddress?.address}</p><p className="text-slate-500">{invoice.shippingAddress?.upazila}, {invoice.shippingAddress?.district}</p></div>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"><span>Item</span><span>Qty</span><span>Amount</span></div>
                {invoice.items?.map((item) => <div key={`${item.productId}-${item.quantity}`} className="grid grid-cols-[1fr_auto_auto] gap-4 border-t border-slate-100 px-4 py-3 text-sm"><span className="font-medium text-slate-700">{item.name}</span><span className="text-slate-500">{item.quantity}</span><span className="font-bold text-slate-900">{(Number(item.price) * Number(item.quantity)).toLocaleString()}৳</span></div>)}
              </div>
              <div className="mt-4 space-y-2 text-sm"><div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{Number(invoice.pricing?.subtotal || 0).toLocaleString()}৳</span></div><div className="flex justify-between text-slate-500"><span>Delivery</span><span>{Number(invoice.pricing?.shipping || 0).toLocaleString()}৳</span></div><div className="flex justify-between text-emerald-600"><span>Coupon discount</span><span>-{Number(invoice.pricing?.discount || 0).toLocaleString()}৳</span></div><div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-[#E11D48]"><span>Total</span><span>{Number(invoice.pricing?.total || 0).toLocaleString()}৳</span></div></div>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">Payment information</p><p className="mt-1 text-slate-600">Method: {invoice.paymentMethod || 'Cash on Delivery'}</p>{invoice.paymentDetails && <><p className="text-slate-600">Mobile: {invoice.paymentDetails.mobileNumber}</p><p className="text-slate-600">Transaction ID: {invoice.paymentDetails.transactionId}</p></>}</div>
              {invoice.notes && <div className="mt-4 text-xs text-slate-500"><span className="font-bold text-slate-700">Order note:</span> {invoice.notes}</div>}
              <div className="mt-6 flex gap-3"><button type="button" onClick={downloadInvoice} className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800">Download PDF</button><button type="button" onClick={() => router.push('/')} className="flex-1 rounded-xl bg-[#E11D48] py-3 text-sm font-bold text-white hover:bg-rose-700">Continue shopping</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Features / Trust Indicators Bar */}
        <div className="mt-16 border-t border-slate-200/80 pt-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">100% Original Products</p>
            <p className="text-[11px] text-slate-500">Authentic & Official</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">1 Year Official Warranty</p>
            <p className="text-[11px] text-slate-500">Peace of Mind</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <CreditCard className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
            <p className="text-[11px] text-slate-500">Pay When You Receive</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <RotateCcw className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">7 Days Replacement</p>
            <p className="text-[11px] text-slate-500">Hassle Free Returns</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 col-span-2 md:col-span-1">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Headphones className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">Expert Support</p>
            <p className="text-[11px] text-slate-500">We&apos;re Here to Help</p>
          </div>
        </div>

      </main>
    </div>
  );
}