'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCartWishlist } from '@/context/CartWishlistContext'; // কনটেক্সট হুক ইমপোর্ট করা হলো
import { Truck, User, Heart, ShoppingCart, MoreVertical, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';

export default function NavActions() {
  const { user, logout } = useAuth();
  const { totalCartItems, totalWishlistItems } = useCartWishlist(); // কার্ট ও উইশলিস্টের টোটাল কাউন্ট নেওয়া হলো
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="flex items-center gap-3 lg:gap-6 shrink-0 text-[#374151]">
      {/* 1. Track Order */}
      <Link href="/track-order" className="flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors">
        <Truck className="w-5 h-5 stroke-[1.5]" />
        <span className="hidden lg:inline text-[11px] font-medium leading-none">Track Order</span>
      </Link>

      {/* 2. Profile / Sign In */}
      {user ? (
        <Link href="/profile" className="hidden lg:flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#002FA7] text-white flex items-center justify-center text-[10px] font-bold leading-none">
              {getInitial(user.name)}
            </div>
          )}
          <span className="text-[11px] font-medium leading-none max-w-[50px] truncate">
            {user.name ? user.name.split(' ')[0] : 'Profile'}
          </span>
        </Link>
      ) : (
        <Link href="/login" className="hidden lg:flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors">
          <User className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[11px] font-medium leading-none">Sign in</span>
        </Link>
      )}

      {/* 3. Wishlist */}
      <Link href="/dashboard/wishlist" className="hidden lg:flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors relative">
        <div className="relative">
          <Heart className="w-5 h-5 stroke-[1.5]" />
          <span className="absolute -top-1.5 -right-2 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalWishlistItems}
          </span>
        </div>
        <span className="text-[11px] font-medium leading-none">Wishlist</span>
      </Link>

      {/* 4. Cart */}
      <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors relative">
        <div className="relative">
          <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
          <span className="absolute -top-1.5 -right-2 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalCartItems}
          </span>
        </div>
        <span className="hidden lg:inline text-[11px] font-medium leading-none mt-1">Cart</span>
      </Link>

      {/* 5. More Button with Dropdown */}
      <div className="relative z-[100]" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col items-center gap-1 hover:text-[#E11D48] transition-colors cursor-pointer focus:outline-none"
        >
          <MoreVertical className="w-5 h-5 stroke-[1.5]" />
          <span className="hidden lg:inline text-[11px] font-medium leading-none">More</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              {user ? (
                <>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#002FA7] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {getInitial(user.name)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  Welcome! Please <Link href="/login" onClick={() => setIsDropdownOpen(false)} className="text-[#E11D48] font-semibold underline">Sign in</Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-red-50 hover:text-[#E11D48] transition-colors"
            >
              <UserCircle className="w-4 h-4 text-gray-400" />
              <span>Profile</span>
            </Link>

            {/* Dashboard */}
            <Link
              href={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-red-50 hover:text-[#E11D48] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>

            {/* Logout */}
            {user && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}