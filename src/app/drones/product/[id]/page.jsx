import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSingleDroneProduct, getRelatedProducts } from '@/lib/api';
import ProductPurchaseBox from '@/components/product-details/ProductPurchaseBox';
import ProductGallery from '@/components/product-details/ProductGallery';
import SimilarProductsSidebar from '@/components/product-details/SimilarProductsSidebar';
import ShareButtons from '@/components/product-details/ShareButtons';
import ProductActionsBar from '@/components/product-details/ProductActionsBar';
import ViewMoreButton from '@/components/product-details/ViewMoreButton';

// একটি ক্লায়েন্ট কম্পোনেন্ট যা শুধু ট্যাব এবং নিচকার সেকশনগুলোর টঘ্লিং ম্যানেজ করবে
import ProductInteractiveSections from '@/components/product-details/ProductInteractiveSections';

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  
  const response = await getSingleDroneProduct(id);
  const product = response?.success ? response.data : (response?._id ? response : null);

  if (!product) {
    notFound();
  }

  const title = product.title || 'Drone Product';
  const brand = product.brand || 'DJI';
  const productCode = product.productCode || 'N/A';
  const stockStatus = product.stockStatus || 'In Stock';
  const categorySlug = product.subCategory || product.category || 'drones';
  
  const regularPrice = product.pricing?.regularPrice || 0;
  const offerPrice = product.pricing?.offerPrice || regularPrice;
  const discountPercent = product.pricing?.discountPercent || 0;
  const saveAmount = regularPrice > offerPrice ? regularPrice - offerPrice : 0;

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.png'];
  const keyFeatures = product.keyFeatures || [];

  let similarProducts = [];
  try {
    const relRes = await getRelatedProducts('drones', id);
    const relData = relRes?.success ? (relRes.data || []) : (Array.isArray(relRes) ? relRes : []);
    similarProducts = relData.filter(p => (p._id || p.id) !== id).slice(0, 4);
  } catch (err) {
    console.error('Failed to fetch similar products:', err);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-white text-slate-800 font-sans">
      
      {/* Top Header Row: Breadcrumb & Professional Share Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 text-xs">
        <nav className="text-slate-500 flex items-center gap-1.5 font-medium overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">Home</Link>
          <span className="text-slate-300">›</span>
          <Link href="/drones" className="hover:text-[#0284C7] transition-colors">Drones</Link>
          <span className="text-slate-300">›</span>
          <Link href={`/drones/category/${categorySlug}`} className="hover:text-[#0284C7] transition-colors capitalize">
            {decodeURIComponent(categorySlug)}
          </Link>
          <span className="text-slate-300">›</span>
          <span className="text-slate-800 font-semibold truncate max-w-[250px]">{title}</span>
        </nav>

        <ShareButtons title={title} />
      </div>

      <ProductActionsBar product={product} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
        
        <div className="order-3 lg:order-none lg:col-span-3">
          <SimilarProductsSidebar similarProducts={similarProducts} currentProductId={id} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <ProductGallery images={images} title={title} />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <span className="bg-slate-100 px-2.5 py-1 rounded font-semibold text-slate-700">
              Brand: <strong className="text-slate-900">{brand}</strong>
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded font-semibold text-slate-700">
              Product Code: <strong className="text-slate-900">{productCode}</strong>
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded font-semibold">
              Status: <strong>{stockStatus}</strong>
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-2xl font-black text-[#E11D48]">
              ৳ {offerPrice.toLocaleString()}
            </span>
            {regularPrice > offerPrice && (
              <>
                <span className="text-sm text-slate-400 line-through font-semibold">
                  ৳ {regularPrice.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold bg-rose-50 text-[#E11D48] px-2 py-0.5 rounded border border-rose-100">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
          {saveAmount > 0 && (
            <p className="text-xs text-slate-500 mb-3 font-medium">(You save ৳ {saveAmount.toLocaleString()})</p>
          )}

          {keyFeatures.length > 0 && (
            <div className="mb-4 space-y-1.5 border-t border-b border-slate-100 py-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Features</h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#E11D48] font-bold">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <ViewMoreButton targetId="description-specs-section" />
            </div>
          )}

          <ProductPurchaseBox product={product} regularPrice={regularPrice} offerPrice={offerPrice} />

        </div>

      </div>

      {/* নিচের অংশটুকু ট্যাবলজিক কন্ট্রোল করার জন্য ক্লায়েন্ট কম্পোনেন্টে পাস করা হলো */}
      <ProductInteractiveSections product={product} productType="drones" />

    </main>
  );
}