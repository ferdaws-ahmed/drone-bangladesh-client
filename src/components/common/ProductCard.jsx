'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function ProductCard({ product, productPath = 'drones' }) {
  const { addToCart } = useCartWishlist();

  if (!product) return null;

  const productId = product._id || product.id;
  const title = product.title || product.name || 'Product';
  
  // ডেটাবেজ থেকে প্রথম keyFeature নেওয়া (যদি না থাকে সাবটাইটেল বা ক্যাটাগরি ফলব্যাক)
  const firstKeyFeature = (product.keyFeatures && product.keyFeatures.length > 0) 
    ? product.keyFeatures[0] 
    : (product.subTitle || product.category || '');

  // Images
  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : (product.image || '/placeholder.png');

  // Pricing
  const regularPrice = product.pricing?.regularPrice || product.regularPrice || 0;
  const offerPrice = product.pricing?.offerPrice || product.price || regularPrice;

  // Admin panel badge check
  const adminBadge = product.badge; 
  const isBestSeller = product.isBestSeller || adminBadge === 'BEST SELLER';
  const isPopular = product.isPopular || adminBadge === 'POPULAR';
  const isHot = product.isHot || adminBadge === 'HOT';

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      
      {/* 1. Image & Badge Section */}
      <div className="relative w-full">
        {/* Dynamic Badge from Database */}
        {(isBestSeller || isPopular || isHot || adminBadge) && (
          <div className="absolute top-1 left-1 z-10">
            {isBestSeller ? (
              <span className="bg-[#581C87] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide shadow-sm">
                Best Seller
              </span>
            ) : isPopular ? (
              <span className="bg-[#6B21A8] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide shadow-sm">
                Popular
              </span>
            ) : isHot ? (
              <span className="bg-[#DC2626] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide shadow-sm">
                Hot
              </span>
            ) : adminBadge ? (
              <span className="bg-slate-900 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide shadow-sm">
                {adminBadge}
              </span>
            ) : null}
          </div>
        )}

        {/* ইমেজের বাইরের বর্ডার, ব্যাকগ্রাউন্ড ও মার্জিন রিমুভ করে একদম ক্লিন করা হলো */}
        <Link href={`/${productPath}/product/${productId}`} className="block">
          <div className="relative w-full h-44 overflow-hidden mb-3 flex items-center justify-center">
            <Image
              src={productImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
      </div>

      {/* Product Content Flow */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* 2. Product Name */}
          <Link href={`/${productPath}/product/${productId}`}>
            <h2 className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors line-clamp-2 text-lg leading-snug mb-2.5">
              {title}
            </h2>
          </Link>

          {/* 3. Database First Key Feature */}
          {firstKeyFeature && (
            <p className="text-xs text-slate-500 font-normal line-clamp-1 mb-3">
              {firstKeyFeature}
            </p>
          )}
        </div>

        <div>
          {/* 4. Price Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-[#E11D48]">
              ৳{offerPrice.toLocaleString()}
            </span>
            {regularPrice > offerPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* 5. Add to Cart Button (Connected with Context) */}
          <button 
            onClick={() => addToCart(product, 1)}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-150 text-center cursor-pointer text-xs tracking-wide shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}