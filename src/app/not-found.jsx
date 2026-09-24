'use client'; // <--- Eta must add korte hobe

import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6 py-24 text-center">
      {/* Large Icon */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 bg-red-50 rounded-full opacity-50"></div>
        <FileQuestion className="w-24 h-24 md:w-32 md:h-32 text-[#E11D48] stroke-1 relative" />
      </div>

      {/* Error Code & Message */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-[#0B132B] tracking-tighter mb-4">
        4<span className="text-[#E11D48]">0</span>4
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-5">
        Oops! Page Not Found
      </h2>
      <p className="text-base text-gray-600 max-w-md mb-10 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link 
          href="/"
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold px-8 py-3.5 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-200 text-sm"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/products"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm"
        >
          <Search className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    </main>
  );
}