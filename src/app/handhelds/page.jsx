import Link from 'next/link';
import Image from 'next/image';
import { getHandheldCategories } from '@/lib/api';

export const metadata = {
  title: 'Handhelds - Drone Bangladesh',
  description: 'Explore DJI handheld products and cameras.',
};

export default async function HandheldsPage() {
  const response = await getHandheldCategories();
  const categories = response?.success ? (response.data || []) : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6"><p className="text-xs font-bold uppercase tracking-widest text-[#E11D48]">Explore collection</p><h1 className="text-3xl font-black text-slate-900 mt-1">Handhelds</h1></div>
      {categories.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200/60"><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No handheld categories available.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-5">
          {categories.map((category, index) => (
            <Link key={category.id || category._id || `handheld-category-${index}`} href={`/handhelds/category/${category.slug}`} className="group flex flex-col justify-between bg-white border border-slate-200/80 rounded-xl hover:shadow-md transition-all duration-200 text-center overflow-hidden h-44 lg:h-52">
              <div className="relative w-full h-32 lg:h-36 flex items-center justify-center p-2"><Image src={category.image || '/placeholder.png'} alt={category.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 16vw" /></div>
              <div className="py-2 px-1 border-t border-slate-100 bg-white flex items-center justify-center"><span className="text-xs lg:text-sm font-bold uppercase text-[#0F172A] group-hover:text-[#E11D48] transition-colors line-clamp-1">{category.name}</span></div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
