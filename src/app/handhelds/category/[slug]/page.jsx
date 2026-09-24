import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { getProductsByHandheldCategory } from '@/lib/api';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Handhelds in ${slug} - Drone Bangladesh`, description: `Explore handheld products under the ${slug} category.` };
}

export default async function HandheldCategoryPage({ params }) {
  const { slug } = await params;
  const response = await getProductsByHandheldCategory(slug);
  const products = response?.success ? (response.data || []) : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <nav className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 font-medium overflow-hidden whitespace-nowrap">
        <Link href="/" className="hover:text-[#0284C7] transition-colors shrink-0">Home</Link>
        <span className="text-slate-400 shrink-0">›</span>
        <Link href="/handhelds" className="hover:text-[#0284C7] transition-colors shrink-0">Handhelds</Link>
        <span className="text-slate-400 shrink-0">›</span>
        <span className="text-slate-800 font-semibold capitalize truncate">{decodeURIComponent(slug)}</span>
      </nav>
      <hr className="my-4 sm:my-5 border-slate-200/80" />
      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200/60"><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No products found in this category.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => <ProductCard key={product._id || product.id || `handheld-${index}`} product={product} productPath="handhelds" />)}
        </div>
      )}
    </main>
  );
}