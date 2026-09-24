"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Award, 
  ChevronRight, 
  ArrowRight 
} from 'lucide-react';

const heroSlides = [
  {
    tagline: "EXPLORE. CAPTURE. INSPIRE.",
    title: "Premium Drones.\nLimitless Possibilities.",
    description: "Official DJI Distributor | Best prices, official warranty, genuine products.",
    dealerText: "BN Authorized Dealer",
    supportText: "Nationwide delivery & Support",
    image: "/images/hero-product-banner.png",
  },
  {
    tagline: "ADVANCED AERIAL IMAGERY.",
    title: "Next-Gen Cinematic\nMasterpieces Await.",
    description: "Professional filmmaking tools built for creators and enterprises.",
    dealerText: "Authorized DJI Partner",
    supportText: "24/7 Expert Technical Support",
    image: "/images/hero-product-banner-2.png",
  },
  {
    tagline: "POWER & PERFORMANCE.",
    title: "Fly Further.\nCapture Every Detail.",
    description: "Unmatched flight time, intelligent tracking, and crystal clear transmission.",
    dealerText: "Certified Distributor",
    supportText: "Express Nationwide Shipping",
    image: "/images/hero-product-banner-3.png",
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="w-full bg-slate-50 font-sans py-4 md:py-6 lg:py-8">
      
      {/* Navbar er shathe exact width alignment container */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Banner Box */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white min-h-[500px] md:min-h-[480px] lg:min-h-[500px] flex items-center">
          
          {/* Dynamic Background Image based on current slide */}
          <div 
            className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-right md:bg-center lg:bg-right pointer-events-none transition-all duration-500 lg:[background-size:100%_100%]"
            style={{ 
              backgroundImage: `url('${slide.image}')`,
            }}
          >
            {/* Overlay for readable text on mobile and tablet screens */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/85 to-transparent lg:hidden z-0" />
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 w-full p-5 md:p-8 lg:p-12 flex flex-col justify-between h-full">
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Side: Text Slider & Details */}
              <div className="md:col-span-8 lg:col-span-7 flex flex-col justify-center space-y-3 md:space-y-4">
                
                {/* Tagline */}
                <span className="text-xs md:text-xs lg:text-sm font-bold tracking-widest text-blue-700 uppercase transition-all duration-300">
                  {slide.tagline}
                </span>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line leading-tight transition-all duration-300">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-xs md:text-sm lg:text-base text-slate-700 font-medium transition-all duration-300 max-w-lg lg:max-w-none">
                  {slide.description}
                </p>

                {/* Sub-badges row */}
                <div className="flex flex-wrap items-center gap-2.5 md:gap-4 text-xs md:text-sm text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-sm border border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold">{slide.dealerText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Truck className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{slide.supportText}</span>
                  </div>
                </div>

                {/* Features Row Icons */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 my-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">100% Authentic</p>
                      <p className="text-[10px] text-slate-600">Official Products</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">1 Year Warranty</p>
                      <p className="text-[10px] text-slate-600">All Authorized</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">EMI Available</p>
                      <p className="text-[10px] text-slate-600">Easy Installments</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Bangladesh Delivery</p>
                      <p className="text-[10px] text-slate-600">Fast & Reliable</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button className="inline-flex items-center gap-2 bg-[#002FA7] hover:bg-blue-800 text-white font-medium text-sm px-6 py-3 rounded-lg shadow-lg transition-all duration-200 cursor-pointer">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Side Empty Space */}
              <div className="md:col-span-4 lg:col-span-5 hidden md:block"></div>

            </div>

            {/* Bottom Slider Dots Indicators */}
            <div className="flex items-center justify-center mt-6 md:mt-8 space-x-3 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === index ? 'w-8 bg-blue-900' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Right Side Navigation Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md border border-slate-200 transition-all cursor-pointer hidden md:flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
}