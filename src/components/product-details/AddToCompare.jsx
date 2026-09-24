'use client';

import { useState } from 'react';

export default function AddToCompare({ product }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compare Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 hover:text-[#E11D48] transition-colors cursor-pointer"
      >
        <span>⇄</span> Add to Compare
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Compare Product
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600">
                Product successfully added to your comparison list!
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800">{product?.title || 'Selected Drone'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  alert('Redirecting to Compare Page...');
                }}
                className="px-4 py-2 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-500/20"
              >
                View Comparison List
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}