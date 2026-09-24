'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductTabsSection({ product, currentUser, onTabSwitch }) {
  const [activeTopTab, setActiveTopTab] = useState('accessories'); // বাই ডিফল্ট অ্যাক্সেসরিজ সিলেক্টেড রাখলাম
  const [activeSubTab, setActiveSubTab] = useState('specification');
  
  const techSpecs = product?.techSpecs || {};
  const description = product?.description || 'No description available for this product.';
  const images = product?.images || ['/placeholder.png'];
  const mainImage = images[0] || '/placeholder.png';
  const descriptionImage = product?.descriptionImage;
  const faqs = product?.faqs || [];
  
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (product?.isPurchased || currentUser?.purchasedItems?.includes(product?._id)) {
      setHasPurchased(true);
    }
  }, [product, currentUser]);

  const handleTopTabClick = (tabName) => {
    setActiveTopTab(tabName);
    
    // প্যারেন্ট কম্পোনেন্টকে জানিয়ে দেওয়া যে কোন ট্যাবটি ক্লিক করা হলো
    if (onTabSwitch) {
      onTabSwitch(tabName);
    }

    // নির্দিষ্ট সেকশনে বা ট্যাবে স্ক্রোল করার লজিক
    if (tabName === 'tech-space') {
      document.getElementById('tabs-container')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabName === 'buy-combo') {
      const comboElement = document.getElementById('buy-combo-section');
      if (comboElement) {
        comboElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tabName === 'accessories') {
      const accessoriesElement = document.getElementById('accessories-section');
      if (accessoriesElement) {
        accessoriesElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tabName === 'faq') {
      setActiveSubTab('faq');
      document.getElementById('tabs-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, userName: currentUser?.name || 'Customer' })
      });
      
      const data = await response.json();
      if (response.ok) {
        setReviews([data.review, ...reviews]);
        setComment('');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      const newRev = {
        user: currentUser?.name || 'Valued Customer',
        rating,
        date: new Date().toLocaleDateString(),
        comment,
        verified: true
      };
      setReviews([newRev, ...reviews]);
      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="tabs-container" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden mt-6 font-sans">
      
      {/* Top Main Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-300 bg-slate-200/75 text-xs font-bold text-center">
        {[
          { id: 'tech-space', label: 'Tech Space', icon: '▣' },
          { id: 'buy-combo', label: 'Buy Combo', icon: '♠' },
          { id: 'accessories', label: 'Accessories', icon: '▦' },
          { id: 'faq', label: 'FAQ', icon: '○' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => handleTopTabClick(tab.id)}
            className={`py-3.5 px-2 flex items-center justify-center gap-2 transition-all cursor-pointer border-r border-slate-300 last:border-r-0 ${
              activeTopTab === tab.id 
                ? 'bg-[#9F1239] text-white shadow-inner font-extrabold' 
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
            }`}
          >
            <span className="text-sm">{tab.icon}</span> 
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex border-b border-slate-200 px-6 gap-8 bg-white overflow-x-auto">
        {[
          { id: 'specification', label: 'Specification' },
          { id: 'description', label: 'Description' },
          { id: 'faq', label: 'Question FAQ' },
          { id: 'review', label: `Review (${reviews.length})` }
        ].map((subTab) => (
          <button 
            key={subTab.id}
            onClick={() => {
              setActiveTopTab('tech-space');
              setActiveSubTab(subTab.id);
              if (onTabSwitch) onTabSwitch('tech-space');
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === subTab.id 
                ? 'border-[#E11D48] text-[#E11D48] bg-rose-50/30 px-3 rounded-t-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {subTab.label}
          </button>
        ))}
      </div>

      {/* Main Content View */}
      <div className="p-6">
        
        {activeSubTab === 'specification' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Specification</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.keys(techSpecs).length > 0 ? (
                  Object.entries(techSpecs).map(([key, val], index) => (
                    <div key={index} className="py-2.5 flex justify-between gap-4">
                      <span className="font-semibold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-slate-900 text-right">{val}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4">No specifications available.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 border-r border-slate-100 pr-4 flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify max-h-[160px] overflow-y-auto pr-1">
                  {description}
                </p>
              </div>

              <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image 
                  src={descriptionImage} 
                  alt={product?.title || 'Product Image'} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Question FAQ</h3>
                {faqs.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {faqs.slice(0, 5).map((faq, index) => (
                      <div key={index} className="text-xs">
                        <button 
                          onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                          className="w-full flex items-center justify-between p-2.5 text-left font-semibold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
                        >
                          <span className="truncate pr-2">{faq.question}</span>
                          <span className="text-sm font-bold text-slate-500">{openFaqIndex === index ? '−' : '+'}</span>
                        </button>
                        {openFaqIndex === index && (
                          <div className="p-2.5 pt-0 text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No FAQ available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'description' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-3">Product Description</h3>
              <div className="max-h-[350px] overflow-y-auto pr-2 text-xs text-slate-600 leading-relaxed space-y-3">
                <p className="text-justify whitespace-pre-line">{description}</p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                <Image 
                  src={descriptionImage} 
                  alt={product?.title || 'Banner'} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-4 border-b pb-2">Frequently Asked Questions</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
              {faqs.map((faq, index) => (
                <div key={index} className="text-xs">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-slate-800 hover:bg-slate-100/70 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="text-sm font-bold text-slate-500">{openFaqIndex === index ? '−' : '+'}</span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-3.5 pt-0 text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'review' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Customer Reviews & Ratings</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                <span>★</span>
                <span className="text-slate-800 font-black">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </span>
                <span className="text-slate-400 font-normal">({reviews.length} Reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {reviews.length > 0 ? (
                  reviews.map((rev, index) => (
                    <div key={index} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                            {rev.user ? rev.user.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{rev.user || 'Customer'}</span>
                            <span className="text-[10px] text-emerald-600 font-medium">Verified Buyer</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date || 'Recently'}</span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center bg-slate-50/40">
                    <p className="text-xs text-slate-500 font-medium">No reviews yet for this product.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                {hasPurchased ? (
                  <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Write a Review</h4>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                    <textarea 
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                      required
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full py-2 bg-[#E11D48] text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">Want to review this product?</p>
                    <p className="text-[11px] text-slate-500">Only verified customers who purchased this product can leave a review.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}