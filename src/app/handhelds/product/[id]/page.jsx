import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSingleHandheldProduct, getRelatedProducts } from '@/lib/api';
import ProductPurchaseBox from '@/components/product-details/ProductPurchaseBox';
import ProductGallery from '@/components/product-details/ProductGallery';
import SimilarProductsSidebar from '@/components/product-details/SimilarProductsSidebar';
import ShareButtons from '@/components/product-details/ShareButtons';
import ProductActionsBar from '@/components/product-details/ProductActionsBar';
import ViewMoreButton from '@/components/product-details/ViewMoreButton';
import ProductInteractiveSections from '@/components/product-details/ProductInteractiveSections';

export default async function HandheldProductPage({ params }) {
  const { id } = await params;
  const response = await getSingleHandheldProduct(id);
  const product = response?.success ? response.data : null;
  if (!product) notFound();

  const title = product.title || 'Handheld Product';
  const categorySlug = product.subCategory || product.category || 'handhelds';
  const regularPrice = product.pricing?.regularPrice || 0;
  const offerPrice = product.pricing?.offerPrice || regularPrice;
  const discountPercent = product.pricing?.discountPercent || 0;
  const saveAmount = regularPrice > offerPrice ? regularPrice - offerPrice : 0;
  const images = product.images?.length ? product.images : ['/placeholder.png'];
  const keyFeatures = product.keyFeatures || [];
  let similarProducts = [];
  try {
    const related = await getRelatedProducts('handhelds', id);
    const relatedProducts = related?.success ? (related.data || []) : [];
    similarProducts = relatedProducts.filter((item) => (item._id || item.id) !== id).slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch similar handheld products:', error);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-white text-slate-800 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 text-xs">
        <nav className="text-slate-500 flex items-center gap-1.5 font-medium overflow-hidden whitespace-nowrap"><Link href="/" className="hover:text-[#0284C7]">Home</Link><span className="text-slate-300">›</span><Link href="/handhelds" className="hover:text-[#0284C7]">Handhelds</Link><span className="text-slate-300">›</span><Link href={`/handhelds/category/${categorySlug}`} className="hover:text-[#0284C7] capitalize">{categorySlug}</Link><span className="text-slate-300">›</span><span className="text-slate-800 font-semibold truncate max-w-[250px]">{title}</span></nav>
        <ShareButtons title={title} />
      </div>
      <ProductActionsBar product={product} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
        <div className="order-3 lg:order-none lg:col-span-3"><SimilarProductsSidebar similarProducts={similarProducts} currentProductId={id} productPath="handhelds" /></div>
        <div className="lg:col-span-4 flex flex-col"><ProductGallery images={images} title={title} /></div>
        <div className="lg:col-span-5 flex flex-col">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs"><span className="bg-slate-100 px-2.5 py-1 rounded font-semibold text-slate-700">Brand: <strong className="text-slate-900">{product.brand || 'DJI'}</strong></span><span className="bg-slate-100 px-2.5 py-1 rounded font-semibold text-slate-700">Product Code: <strong className="text-slate-900">{product.productCode || 'N/A'}</strong></span><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded font-semibold">Status: <strong>{product.stockStatus || 'In Stock'}</strong></span></div>
          <div className="flex items-baseline gap-3 mb-1"><span className="text-2xl font-black text-[#E11D48]">৳ {offerPrice.toLocaleString()}</span>{regularPrice > offerPrice && <><span className="text-sm text-slate-400 line-through font-semibold">৳ {regularPrice.toLocaleString()}</span><span className="text-[11px] font-bold bg-rose-50 text-[#E11D48] px-2 py-0.5 rounded border border-rose-100">-{discountPercent}%</span></>}</div>
          {saveAmount > 0 && <p className="text-xs text-slate-500 mb-3 font-medium">(You save ৳ {saveAmount.toLocaleString()})</p>}
          {keyFeatures.length > 0 && <div className="mb-4 space-y-1.5 border-t border-b border-slate-100 py-2.5"><h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Features</h4><ul className="space-y-1 text-xs text-slate-700">{keyFeatures.map((feature, index) => <li key={index} className="flex items-start gap-2"><span className="text-[#E11D48] font-bold">✓</span>{feature}</li>)}</ul><ViewMoreButton targetId="description-specs-section" /></div>}
          <ProductPurchaseBox product={product} regularPrice={regularPrice} offerPrice={offerPrice} />
        </div>
      </div>
      <ProductInteractiveSections product={product} productType="handhelds" />
    </main>
  );
}