'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // লোডিং শেষ হওয়ার পর ইউজার না থাকলে লগইন পেজে পাঠাবে
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // পেজ চেক/লোড হওয়া পর্যন্ত কিছু রিঅ্যাক্ট হবে না বা লোডার দেখাবে
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Loading...</p>
      </div>
    );
  }

  return children;
}