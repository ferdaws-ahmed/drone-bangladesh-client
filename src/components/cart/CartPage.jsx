'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartWishlist } from '@/context/CartWishlistContext';

const getProduct = (item) => item.product || item;
const getId = (item) => getProduct(item)?._id || getProduct(item)?.id;
const getPrice = (product) => Number(product?.pricing?.offerPrice || product?.offerPrice || product?.price || product?.regularPrice || 0);
const getImage = (product) => product?.images?.[0] || product?.image || '/placeholder.png';
const getTitle = (product) => product?.title || product?.name || 'Product';

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, removeFromCart, updateCartQuantity } = useCartWishlist();
  const subtotal = cart.reduce((sum, item) => sum + getPrice(getProduct(item)) * (item.quantity || 1), 0);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">Loading cart...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#E11D48]">Your selection</p><h1 className="text-3xl font-black text-slate-900 mt-1">Shopping Cart</h1></div>
        <span className="text-sm text-slate-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
      </div>
      {cart.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 px-6 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" /><h2 className="text-lg font-bold text-slate-900 mt-4">Your cart is empty</h2><p className="text-sm text-slate-500 mt-2">Add a product to see it here.</p>
          <Link href="/drones" className="inline-flex items-center gap-2 mt-6 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold">Continue shopping <ArrowRight className="w-4 h-4" /></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_350px] gap-6 items-start">
          <section className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {cart.map((item, index) => {
              const product = getProduct(item); const productId = getId(item); const quantity = item.quantity || 1;
              const productPath = product?.productType || (product?.category === 'Handheld' ? 'handhelds' : 'drones');
              return <article key={productId || `cart-item-${index}`} className="p-4 sm:p-5 flex gap-4 sm:gap-5 items-center">
                <Link href={`/${productPath}/product/${productId}`} className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center"><Image src={getImage(product)} alt={getTitle(product)} width={112} height={112} className="w-full h-full object-contain" /></Link>
                <div className="min-w-0 flex-1"><Link href={`/${productPath}/product/${productId}`} className="font-bold text-slate-900 hover:text-[#0284C7] line-clamp-2">{getTitle(product)}</Link><p className="text-sm font-bold text-[#E11D48] mt-2">BDT {getPrice(product).toLocaleString()}</p>
                  <div className="flex items-center justify-between gap-3 mt-3"><div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden"><button aria-label="Decrease quantity" onClick={() => updateCartQuantity(productId, quantity - 1)} className="p-2 hover:bg-slate-50"><Minus className="w-3.5 h-3.5" /></button><span className="w-8 text-center text-sm font-bold">{quantity}</span><button aria-label="Increase quantity" onClick={() => updateCartQuantity(productId, quantity + 1)} className="p-2 hover:bg-slate-50"><Plus className="w-3.5 h-3.5" /></button></div><button aria-label={`Remove ${getTitle(product)}`} onClick={() => removeFromCart(productId)} className="text-slate-400 hover:text-[#E11D48] p-2"><Trash2 className="w-4 h-4" /></button></div>
                </div><p className="hidden sm:block font-black text-slate-900">BDT {(getPrice(product) * quantity).toLocaleString()}</p>
              </article>;
            })}
          </section>
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24"><h2 className="text-lg font-black text-slate-900">Order Summary</h2><div className="space-y-3 text-sm mt-6"><div className="flex justify-between text-slate-500"><span>Subtotal</span><span>BDT {subtotal.toLocaleString()}</span></div><div className="flex justify-between text-slate-500"><span>Shipping</span><span className="text-emerald-600 font-semibold">Free</span></div><div className="border-t border-slate-100 pt-4 flex justify-between text-base font-black text-slate-900"><span>Total</span><span>BDT {subtotal.toLocaleString()}</span></div></div><button onClick={() => router.push('/checkout')} className="w-full mt-6 bg-[#E11D48] hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">Proceed to checkout <ArrowRight className="w-4 h-4" /></button><Link href="/drones" className="block text-center text-sm font-semibold text-slate-500 hover:text-slate-900 mt-4">Continue shopping</Link></aside>
        </div>
      )}
    </main>
  );
}
