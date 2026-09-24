'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SimilarProductsSidebar({ similarProducts, currentProductId, productPath = 'drones' }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
      <h3 className="text-xs font-extrabold text-slate-900 mb-3 uppercase tracking-wider">
        Similar Product
      </h3>
      <div className="space-y-3">
        {similarProducts.map((sim) => {
          const simId = sim._id || sim.id;
          const isCurrentActive = simId === currentProductId;
          const simPath = sim.productType || productPath;
          const simPrice = sim.pricing?.offerPrice || 0;
          const simRegPrice = sim.pricing?.regularPrice || 0;

          return (
            <div 
              key={simId} 
              className={`p-2.5 rounded-xl border transition-all ${isCurrentActive ? 'border-rose-200 bg-rose-50/40' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <Link href={`/${simPath}/product/${simId}`} className="flex items-center gap-2.5">
                <div className="relative w-12 h-12 bg-slate-50 rounded-lg shrink-0 overflow-hidden border border-slate-100">
                  <Image src={sim.images?.[0] || '/placeholder.png'} alt={sim.title} fill className="object-contain p-1" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[11px] font-bold text-slate-800 hover:text-[#E11D48] transition-colors line-clamp-2">{sim.title}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-extrabold text-[#E11D48]">৳ {simPrice.toLocaleString()}</span>
                    {simRegPrice > simPrice && (
                      <span className="text-[10px] text-slate-400 line-through">৳ {simRegPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
              <button className="mt-2 w-full text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 py-1 rounded transition-colors cursor-pointer flex items-center justify-center gap-1">
                <span>+</span> Add to Compare
              </button>
            </div>
          );
        })}
      </div>

      <Link href={`/${productPath}`} className="block w-full mt-3 border border-[#E11D48] text-[#E11D48] hover:bg-rose-50 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center">
        View More Products
      </Link>
    </div>
  );
}