'use client';

/**
 * AboutPage.jsx — Static About Us page matching the provided design exactly.
 * No backend data required. All content is hardcoded and fully responsive.
 */

import React from 'react';
import {
  RotateCcw,
  Package,
  Compass,
  AlertTriangle,
  HelpCircle,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      
      {/* ── 1. HERO BANNER SECTION ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-purple-50/25 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Subtitle */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                DRONE BANGLADESH
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Your Trusted <span className="text-slate-900">Drone Solutions Partner in</span> <span className="text-orange-500">Bangladesh</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Drone Bangladesh has a team of experts ready to help you.
              </p>
            </div>

            {/* Right Column: Drone Graphic/Illustration */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 to-purple-200/30 rounded-3xl blur-2xl -z-10"></div>
                <img
                  src="/images/about-image1.png"
                  alt="Professional DJI Drone"
                  className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=DJI+Drone';
                  }}
                />
              </div>
            </div>

          </div>

          {/* 5 Quick Action Cards Below Hero */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { title: 'ORDER OR RETURN STATUS', icon: RotateCcw, link: '#' },
              { title: 'RETURNS & REFUND REQUEST', icon: Package, link: '#' },
              { title: 'REPORT A MAP ERROR', icon: Compass, link: '#' },
              { title: 'REPORT A MISSING MAP/ORDER', icon: AlertTriangle, link: '#' },
              { title: 'GET HELP WITH OTHER TOPICS', icon: HelpCircle, link: '#' },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <a
                  key={idx}
                  href={action.link}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wide leading-tight">
                    {action.title}
                  </span>
                </a>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 2. ABOUT US SECTION ───────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight">
          About Us
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          <p>
            Founded on December 15, 2015, Drone Bangladesh has built a strong reputation as one of the most trusted drone solution providers in the country, with over 10 years of industry excellence.
          </p>
          <p>
            Since becoming an official DJI Authorized Dealer in 2020, we have been delivering authentic products, expert consultation, and reliable after-sales support to customers nationwide. We supply drones across Bangladesh for various sectors, wholesale buyers, and professional and industrial use.
          </p>
        </div>
      </section>

      {/* ── 3. MISSION, VISION & VALUES CARDS ──────────────────────────────── */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Mission',
              desc: 'To be every Bangladesh leading drone solutions provider by delivering authentic products, advanced technology and exceptional service.',
              icon: Target,
            },
            {
              title: 'Vision',
              desc: 'We will be the trusted partner for every drone user in Bangladesh — from agriculture to enterprise, educational to inspectors.',
              icon: Compass,
            },
            {
              title: 'Values',
              desc: 'GDC — Commitment, Quality, Innovation, and Customer Focus supporting industry providers and all systems that make every flight safer and smarter.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-8 border-2 border-orange-200/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5 text-orange-600 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. ADVANCED DRONE PORTFOLIO ───────────────────────────────────── */}
      <section className="py-16 bg-slate-50/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Advanced Drone Portfolio
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We specialize in both consumer and high-performance industrial drones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Agriculture Drones',
                icon: '🌾',
                models: ['• DJI Agras T30', '• DJI Agras T25'],
                usedFor: ['• Crop spraying', '• Seed scattering', '• Large-scale agricultural operations'],
              },
              {
                title: 'Enterprise & Industrial Drones',
                icon: '🏭',
                models: ['• DJI Matrice 350 RTK', '• DJI Mavic 3M'],
                usedFor: ['• Surveying & mapping', '• Inspection', '• Security & monitoring', '• Government operations'],
              },
              {
                title: 'Fixed-Wing Drone Solutions',
                icon: '✈️',
                models: ['• JOUAV', '• VTOL'],
                usedFor: ['• Long-range mapping', '• Large area surveying', '• Industrial and research applications'],
              },
            ].map((portfolio, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="text-4xl mb-4">{portfolio.icon}</div>
                <h3 className="text-base font-black text-slate-900 mb-4">{portfolio.title}</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Models:</h4>
                    <ul className="space-y-1 text-xs font-semibold text-slate-700">
                      {portfolio.models.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Used for:</h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {portfolio.usedFor.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PROVEN TRACK RECORD ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-12 tracking-tight">
          Proven Track Record
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 pb-12 border-b border-slate-100">
          {[
            { value: '50+', label: 'Countries Served' },
            { value: '100+', label: 'Non-Drone Projects' },
            { value: '10+', label: 'Years of Industry Excellence' },
            { value: '150+', label: 'Happy Clients & Partners' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-orange-600">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
          Industries we've successfully served:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {[
            'Agriculture',
            'Surveying & Mapping',
            'Media & Production',
            'Infrastructure & Inspection',
          ].map((tag, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-bold shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              {tag}
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. OUR STORY SECTION (Dark Navy Card with Sunset Field Image) ───── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-orange-400">OUR STORY</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                Leading the drone revolution since 2015.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our approach to drone solutions is simple: we focus on authentic products and expert support. Through constant innovation, Drone Bangladesh offers a more reliable and long-lasting approach to aerial technology.
              </p>
              <p className="text-xs font-bold text-orange-400 pt-2">
                — Drone Bangladesh Team
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-700 aspect-[16/10]">
                <img
                  src="/images/about-image2.png"
                  alt="Operator flying drone in a lush green field at sunset"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/800x500/1e293b/94a3b8?text=Sunset+Drone+Operation';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. OUR COMMUNITY SECTION ──────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          Our community
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-10">
          Loved & trusted by an ever-expanding community.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop',
              caption: 'Operator in nature',
            },
            {
              url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop',
              caption: 'Compact drone handling',
            },
            {
              url: 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=600&auto=format&fit=crop',
              caption: 'Sunset aerial shoot',
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
              caption: 'Enthusiast flying outdoors',
            },
          ].map((photo, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-sm bg-slate-100"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x500/e2e8f0/64748b?text=Community+${idx + 1}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="text-white text-xs font-semibold">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}