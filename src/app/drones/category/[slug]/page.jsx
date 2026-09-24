import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Drones in ${slug} - Alif'sVault`,
    description: `Explore high-performance drones under the ${slug} category.`,
  };
}

export default async function CategoryProductsPage({ params }) {
  const { slug } = await params;
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/client/drones/category/${slug}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    products = data?.success ? (data.data || []) : (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Failed to fetch category products:', error);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Breadcrumb Path (Home > Drones > Category Name) */}
      <nav className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 font-medium overflow-hidden whitespace-nowrap">
        <Link href="/" className="hover:text-[#0284C7] transition-colors shrink-0">
          Home
        </Link>
        <span className="text-slate-400 shrink-0">›</span>
        <Link href="/drones" className="hover:text-[#0284C7] transition-colors shrink-0">
          Drones
        </Link>
        <span className="text-slate-400 shrink-0">›</span>
        <span className="text-slate-800 font-semibold capitalize truncate">
          {decodeURIComponent(slug)}
        </span>
      </nav>

      {/* Path-এর ঠিক নিচে হালকা একটি লাইন (Subtle Divider Line) */}
      <hr className="my-4 sm:my-5 border-slate-200/80" />

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              productPath="drones"
            />
          ))}
        </div>
      )}
    </main>
  );
}