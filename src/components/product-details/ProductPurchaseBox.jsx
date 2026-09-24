'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function ProductPurchaseBox({ product, regularPrice, offerPrice }) {
  const [paymentType, setPaymentType] = useState('cash');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToCart } = useCartWishlist();

  // Dynamic EMI Calculation based on database emiPercentage & offerPrice
  const emiPercentage = product?.pricing?.emiPercentage || 0;
  const totalEmiPrice = offerPrice + (offerPrice * emiPercentage) / 100;
  const emiPerMonth = Math.round(totalEmiPrice / 12);

  // Add to Cart with Navbar Cart Count synchronization
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product, quantity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buy Now Handler
  const handleBuyNow = () => {
    const productType = product.productType || (product.category === 'Handheld' ? 'handhelds' : 'drones');
    router.push(`/checkout?id=${product._id}&qty=${quantity}&type=${paymentType}&productType=${productType}`);
  };

  return (
    <div className="mt-auto space-y-4">
      
      {/* Payment Options Box */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">Payment Options</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Cash Option */}
          <div 
            onClick={() => setPaymentType('cash')}
            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${paymentType === 'cash' ? 'border-[#0284C7] bg-sky-50/20 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-[#E11D48]">৳ {offerPrice.toLocaleString()}</span>
              <input type="radio" checked={paymentType === 'cash'} readOnly className="accent-[#0284C7] cursor-pointer" />
            </div>
            <p className="text-[11px] font-bold text-slate-800">Cash Discount Price</p>
            <p className="text-[10px] text-slate-400">Online / Cash Payment</p>
          </div>

          {/* EMI Option (Dynamic Calculation & Dynamic Percentage) */}
          <div 
            onClick={() => setPaymentType('emi')}
            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${paymentType === 'emi' ? 'border-[#0284C7] bg-sky-50/20 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900">৳ {emiPerMonth.toLocaleString()}<span className="text-[10px] font-normal text-slate-500">/month</span></span>
              <input type="radio" checked={paymentType === 'emi'} readOnly className="accent-[#0284C7] cursor-pointer" />
            </div>
            <p className="text-[11px] font-bold text-slate-800">Total EMI: ৳ {Math.round(totalEmiPrice).toLocaleString()}</p>
            <p className="text-[10px] text-slate-400">{emiPercentage}% EMI for up to 12 Months***</p>
          </div>

        </div>
      </div>

      {/* Quantity & Actions Bar */}
      <div className="flex items-center gap-2.5">
        {/* Quantity Counter */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-all cursor-pointer"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-slate-900 text-xs">{quantity}</span>
          <button 
            onClick={() => setQuantity(q => q + 1)}
            className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-all cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-3 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer text-center shadow-2xs"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>

        {/* Buy Now */}
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#E11D48] hover:bg-rose-700 text-white font-bold py-3 px-3 rounded-xl shadow-md shadow-rose-500/20 transition-all text-xs uppercase tracking-wider cursor-pointer text-center"
        >
          Buy Now
        </button>
      </div>

      {/* Trust Badges with Icons */}
      <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-100 text-center">
        <div className="p-1.5 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="text-sm">🛡️</span>
          <p className="text-[9px] font-bold text-slate-700 leading-tight">100% Original Products</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="text-sm">📜</span>
          <p className="text-[9px] font-bold text-slate-700 leading-tight">1 Year Official Warranty</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="text-sm">🔄</span>
          <p className="text-[9px] font-bold text-slate-700 leading-tight">7 Days Replacement</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="text-sm">🚚</span>
          <p className="text-[9px] font-bold text-slate-700 leading-tight">Fast Delivery All Over BD</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="text-sm">🔒</span>
          <p className="text-[9px] font-bold text-slate-700 leading-tight">Secure Payment Protected</p>
        </div>
      </div>

    </div>
  );
}