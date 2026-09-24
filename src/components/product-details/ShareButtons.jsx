'use client';

import { useState } from 'react';

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2.5 font-semibold text-slate-700 shrink-0">
      <span className="text-xs">Share:</span>
      <div className="flex items-center gap-1.5">
        {/* Facebook */}
        <button 
          onClick={() => handleShare('facebook')}
          title="Share on Facebook"
          className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs shadow-2xs hover:scale-105 transition-transform cursor-pointer"
        >
          <i className="fa-brands fa-facebook-f">f</i>
        </button>

        {/* Twitter / X */}
        <button 
          onClick={() => handleShare('twitter')}
          title="Share on Twitter"
          className="w-7 h-7 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center text-xs shadow-2xs hover:scale-105 transition-transform cursor-pointer"
        >
          𝕏
        </button>

        {/* WhatsApp */}
        <button 
          onClick={() => handleShare('whatsapp')}
          title="Share on WhatsApp"
          className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs shadow-2xs hover:scale-105 transition-transform cursor-pointer"
        >
          💬
        </button>

        {/* Copy Link */}
        <button 
          onClick={handleCopyLink}
          title="Copy Link"
          className="relative w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs shadow-2xs transition-all cursor-pointer"
        >
          🔗
          {copied && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-md">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}