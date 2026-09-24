'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import BaseMegaMenu from './mega-menus/BaseMegaMenu';

export default function NavLinks({ onLinkClick }) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);

  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'Drones',
      key: 'drones',
      isMega: true,
      jsonUrl: '/client/drones/categories', // 👈 এখানে ব্যাকএন্ডের API রাউট বসানো হয়েছে
      categoryPath: 'drones',
      title: 'EXPLORE DRONES',
      viewAllHref: '/drones',
    },
    {
      name: 'Handhelds',
      key: 'handhelds',
      isMega: true,
      jsonUrl: '/client/handhelds/categories', // 👈 হ্যান্ডহেল্ডসের জন্যও পরবর্তীতে ব্যাকএন্ড রাউট দিতে পারেন
      categoryPath: 'handhelds',
      title: 'EXPLORE HANDHELDS',
      viewAllHref: '/handhelds',
    },
    { name: 'All Products', href: '/products', hasArrow: true },
    { name: 'Article', href: '/articles' },
    { name: 'Maintenance', href: '/maintenance' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact', hasArrow: true },
  ];

  const handleToggle = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const handleLinkClick = () => {
    setActiveMenu(null);
    if (onLinkClick) onLinkClick();
  };

  return (
    <nav className="relative w-full">
      {/* Main Navigation Links Container */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-2 lg:gap-8 w-full">
        {navItems.map((item) => {
          const isMenuOpen = activeMenu === item.key;
          const isActive =
            pathname === item.href ||
            (item.href && item.href !== '/' && pathname.startsWith(item.href)) ||
            isMenuOpen;

          return (
            <div key={item.name} className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              {item.isMega ? (
                <div className="w-full">
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`w-full flex items-center justify-between lg:justify-start gap-1.5 text-base lg:text-sm font-bold tracking-wide py-3 lg:py-2 transition-colors cursor-pointer ${
                      isActive ? 'text-[#E11D48]' : 'text-[#1E293B] hover:text-[#E11D48]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[2.5] opacity-70 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Mobile Dropdown View (Inside Accordion) */}
                  <div className="block lg:hidden">
                    <BaseMegaMenu
                      isOpen={isMenuOpen}
                      onClose={handleLinkClick}
                      title={item.title}
                      viewAllHref={item.viewAllHref}
                      jsonUrl={item.jsonUrl}
                      categoryPath={item.categoryPath}
                    />
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between lg:justify-start gap-1.5 text-base lg:text-sm font-bold tracking-wide py-3 lg:py-2 transition-colors ${
                    isActive ? 'text-[#E11D48]' : 'text-[#1E293B] hover:text-[#E11D48]'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasArrow && (
                    <ChevronDown className="w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[2.5] opacity-70" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Mega Menu View */}
      <div className="hidden lg:block">
        {navItems.map(
          (item) =>
            item.isMega && (
              <BaseMegaMenu
                key={item.key}
                isOpen={activeMenu === item.key}
                onClose={() => setActiveMenu(null)}
                title={item.title}
                viewAllHref={item.viewAllHref}
                jsonUrl={item.jsonUrl}
                categoryPath={item.categoryPath}
              />
            )
        )}
      </div>
    </nav>
  );
}