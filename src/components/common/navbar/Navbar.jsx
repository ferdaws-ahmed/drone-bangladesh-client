'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import NavActions from './NavActions';
import NavLinks from './NavLinks';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Background scroll lock when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* SearchBar - Large Screens Only */}
        <div className="hidden lg:block flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        {/* Action Buttons & Hamburger Wrapper */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Main NavActions Component (Handles Delivery, Cart, More on Mobile) */}
          <NavActions />

          {/* Hamburger Icon for Mobile (4th Item) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1.5 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Mobile SearchBar Row (Below main top bar) */}
      <div className="lg:hidden px-4 pb-3 pt-1 border-t border-gray-100/60">
        <SearchBar />
      </div>

      {/* Desktop Navigation Links Row */}
     <div className="hidden lg:flex max-w-7xl mx-auto px-6 h-12 items-center justify-center border-t border-gray-100/60">
  <NavLinks />
</div>

      {/* ================= MOBILE 80% SIDEBAR DRAWER ================= */}
      
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 80% Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header: Logo & Close Icon Only */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Logo />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <NavLinks onLinkClick={() => setIsSidebarOpen(false)} />
        </div>
      </aside>
    </header>
  );
}