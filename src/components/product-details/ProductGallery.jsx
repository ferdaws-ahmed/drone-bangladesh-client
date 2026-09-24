'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.png');

  return (
    <div className="flex flex-col gap-3">
      {/* Main Big Image Box (Original look, No Zoom) */}
      <div className="relative w-full h-[350px] sm:h-[420px] bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-3">
        <Image
          src={selectedImage}
          alt={title || 'Product Image'}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all bg-white cursor-pointer ${
                selectedImage === img ? 'border-[#0284C7] shadow-sm' : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <Image 
                src={img} 
                alt={`${title} thumbnail ${index + 1}`} 
                fill 
                sizes="64px"
                className="object-contain p-1" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}