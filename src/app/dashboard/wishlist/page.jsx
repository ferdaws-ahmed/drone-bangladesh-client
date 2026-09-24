'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCartWishlist } from '@/context/CartWishlistContext';

const getProduct = (item) => item.product || item;
const getId = (item) => getProduct(item)?._id || getProduct(item)?.id;
const getPrice = (product) => Number(product?.pricing?.offerPrice || product?.offerPrice || product?.price || product?.regularPrice || 0);
const getTitle = (product) => product?.title || product?.name || 'Product';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist, addToCart } = useCartWishlist();
  const router = useRouter();
  const buyNow = (product) => {
    const productId = product?._id || product?.id;
    const productType = product?.productType || (product?.category === 'Handheld' ? 'handhelds' : 'drones');
    router.push(`/checkout?id=${productId}&qty=1&type=cash&productType=${productType}`);
  };

  return <ProtectedRoute><main><div className="mb-7"><p className="text-xs font-bold uppercase tracking-widest text-[#E11D48]">Saved products</p><h1 className="text-3xl font-black text-slate-900 mt-1">Wishlist</h1></div>
    {loading ? <p className="text-sm text-slate-500">Loading wishlist...</p> : wishlist.length === 0 ? <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 px-6 text-center"><Heart className="w-12 h-12 mx-auto text-slate-300" /><h2 className="text-lg font-bold text-slate-900 mt-4">Your wishlist is empty</h2><Link href="/drones" className="inline-flex items-center gap-2 mt-6 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold">Explore products</Link></div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{wishlist.map((item, index) => { const product = getProduct(item); const productId = getId(item); const productPath = product?.productType || (product?.category === 'Drone' ? 'drones' : 'handhelds'); const productUrl = `/${productPath}/product/${productId}`; return <article key={productId || `wishlist-item-${index}`} className="bg-white border border-slate-200 rounded-2xl p-4"><Link href={productUrl} className="block h-48 bg-slate-50 rounded-xl overflow-hidden"><Image src={product?.images?.[0] || product?.image || '/placeholder.png'} alt={getTitle(product)} width={320} height={192} className="w-full h-full object-contain" /></Link><Link href={productUrl} className="block font-bold text-slate-900 hover:text-[#0284C7] mt-4 line-clamp-2">{getTitle(product)}</Link><p className="text-sm font-bold text-[#E11D48] mt-2">BDT {getPrice(product).toLocaleString()}</p><div className="flex gap-2 mt-4"><button onClick={() => buyNow(product)} className="flex-1 bg-[#E11D48] text-white rounded-lg py-2.5 text-xs font-bold">Buy now</button><button onClick={() => addToCart(product, 1)} className="flex-1 bg-slate-900 text-white rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> Add to cart</button><button aria-label={`Remove ${getTitle(product)}`} onClick={() => removeFromWishlist(productId)} className="p-2.5 border border-slate-200 text-slate-500 hover:text-[#E11D48] rounded-lg"><Trash2 className="w-4 h-4" /></button></div></article>; })}</div>}
  </main></ProtectedRoute>;
}
