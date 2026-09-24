'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Heart, ShoppingCart, UserCircle, PackageSearch } from 'lucide-react';

const links = [
  { href: '/dashboard',         label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/orders',  label: 'My Orders', icon: PackageSearch },
  { href: '/dashboard/wishlist',label: 'Wishlist',  icon: Heart },
  { href: '/dashboard/cart',    label: 'Cart',      icon: ShoppingCart },
  { href: '/dashboard/profile', label: 'Profile',   icon: UserCircle },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 lg:flex lg:items-start lg:gap-6">
      <aside className="lg:w-56 shrink-0 mb-6 lg:mb-0">
        <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex lg:block gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
