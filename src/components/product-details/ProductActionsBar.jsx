'use client';

import AddToCompare from './AddToCompare';
import { Heart } from 'lucide-react';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function ProductActionsBar({ product }) {
  const { wishlist, toggleWishlist } = useCartWishlist();
  const productId = product?._id || product?.id;
  const isSaved = wishlist.some((item) => (item.product?._id || item.product?.id || item._id) === productId);

  return (
    <div className="flex items-center gap-4 mb-3 text-xs font-semibold text-slate-700">
      <button className="flex items-center gap-1.5 hover:text-[#E11D48] transition-colors cursor-pointer">
        <span>♡</span> Save
      </button>
      <AddToCompare product={product} />
      <button onClick={() => toggleWishlist(product)} className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isSaved ? 'text-[#E11D48]' : 'hover:text-[#E11D48]'}`}>
        <Heart className="h-3.5 w-3.5" fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'In Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
}