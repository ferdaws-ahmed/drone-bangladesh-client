'use client';

import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-2xl mx-8">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          placeholder="Search drones, cameras & accessories..."
          className="w-full h-11 pl-4 pr-12 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-l-md focus:outline-none focus:bg-white focus:border-gray-300 transition-colors text-gray-800 placeholder-gray-400"
        />
        <button 
          type="submit"
          className="h-11 px-6 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-r-md flex items-center justify-center transition-colors shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}