import React from 'react';

export default function BrandBanner() {
  return (
    <section className="w-full py-3 md:py-4">
      {/* Baki section gular moto max-w-7xl ebong padding use kora hoyeche jate layout er baire na jay */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          
          {/* DJI Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl py-5 px-6 flex flex-col items-center justify-center text-center hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
            <div className="h-10 flex items-center justify-center mb-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                DJI
              </span>
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-slate-600 tracking-wide uppercase">
              DJI
            </span>
          </div>

          {/* DJI Enterprise Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl py-5 px-6 flex flex-col items-center justify-center text-center hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
            <div className="h-10 flex items-center justify-center gap-2 mb-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                DJI
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                ENTERPRISE
              </span>
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-slate-600 tracking-wide uppercase">
              DJI ENTERPRISE
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}