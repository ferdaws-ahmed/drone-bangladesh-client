'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRelatedProducts } from '@/lib/api';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function ProductAccessories({ product, productType = 'drones' }) {
  const { addToCart } = useCartWishlist();
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecificAccessories() {
      try {
        setLoading(true);
        const response = await getRelatedProducts(productType, product._id, 'accessories');
        setAccessoriesProducts(response?.success ? response.data || [] : []);
      } catch (err) {
        console.error('Failed to load specific accessories', err);
        setAccessoriesProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecificAccessories();
  }, [product, productType]);

  return (
    <div id="accessories-section" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mt-6 font-sans scroll-mt-6">
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Products Accessories
        </h3>
        <button 
          onClick={() => { window.location.href = '/handhelds?category=Accessories'; }}
          className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
        >
          View all &gt;
        </button>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 flex items-center gap-2">
        <span>Shop every accessory configured for this product.</span>
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2].map((item) => (
            <div key={item} className="border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between animate-pulse bg-slate-50 h-[280px]">
              <div className="w-full h-36 bg-slate-200 rounded-xl mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : accessoriesProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {accessoriesProducts.map((item) => {
            const price = item?.pricing?.offerPrice || item?.pricing?.regularPrice || item?.price || 0;
            const image = item?.images?.[0] || item?.image || '/placeholder.png';
            const itemId = item?._id || item?.id;

            return (
              <div key={itemId} className="border border-slate-200/90 rounded-2xl p-3 flex flex-col justify-between hover:shadow-md transition-all bg-white">
                <div>
                  <div className="w-full h-28 bg-slate-50/80 rounded-xl mb-3 relative flex items-center justify-center overflow-hidden border border-slate-100">
                    <Image 
                      src={image} 
                      alt={item?.title || 'Accessory Item'} 
                      fill 
                      sizes="200px"
                      className="object-contain p-3" 
                    />
                  </div>
                  <Link href={`/${item.productType || productType}/product/${itemId}`}>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 hover:text-[#E11D48] transition-colors leading-relaxed">
                      {item?.title || item?.name}
                    </h4>
                  </Link>
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#E11D48] mb-3">
                    ৳ {Number(price).toLocaleString()}
                  </p>
                  <button 
                    onClick={() => addToCart(item, 1)}
                    className="w-full border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>🛒</span>
                    <span>Add to cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          No accessories configured or available for this product.
        </div>
      )}

    </div>
  );
}