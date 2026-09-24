'use client';

/**
 * RpasCompliance.jsx
 * 
 * 100% Exact Replica matching the screenshot:
 * - Proper font weights, exact text bolding, tight line-spacing, and correct layout alignment.
 */

import { Headphones } from 'lucide-react';

export default function RpasCompliance({ workshopImageUrl }) {
  const imageSrc =
    workshopImageUrl ||
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* ── 1. RPAS Flight Log Compliance Section ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center text-lg font-bold tracking-tight text-[#0d1626] sm:text-xl">
          RPAS Flight Log Compliance
        </h2>

        {/* Bullets */}
        <ul className="mx-auto mb-6 max-w-3xl space-y-2 text-left text-xs leading-relaxed text-slate-600 sm:text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800" />
            <span>
              Operating without <strong className="font-semibold text-slate-900">up-to-date RPA flight records</strong> or maintenance programs strictly according to manufacturers operating manuals and the specific flight logs frequently distate by the many drivers.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800" />
            <span>
              <strong className="font-semibold text-slate-900">Maintaining recorded logging (CAR 901.08):</strong> Every service carries your CARs Part IX drone maintenance records are a comprehensive and audit-ready. We provide you with the exact documentation of maintenance actions, technical details, and modification dates required for drone maintenance in Canada.
            </span>
          </li>
        </ul>

        {/* Workshop Image */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt="Drone maintenance workshop bench"
            className="h-44 w-full object-cover sm:h-56 lg:h-64"
          />
        </div>
      </section>

      {/* ── 2. Peace of Mind Section ───────────────────────────────────── */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl border-t border-slate-100 pt-8 text-center">
            <h2 className="mb-3 text-base font-bold text-[#0d1626] sm:text-lg">
              Peace of Mind for Recreational Flyers &amp; Content Creators
            </h2>
            <div className="space-y-3 text-left text-xs leading-relaxed text-slate-600 sm:text-center sm:text-sm">
              <p>
                If you fly primarily for fun, landscape photography, or freelance content creation, you might wonder how Transport Canada&apos;s maintenance regulations apply to you. It is very common question, and the answer comes down to the size of your aircraft rather than how you use it.
              </p>
              <p>
                Under CAR Part IX, the go-limiting focus on drones that <strong className="font-semibold text-slate-900">weigh less than 250 g (0.550 lb)</strong>. This means that whether you are flying a weekend cinematic mission or making your small creation short and can still trust that essential care is always. This maintenance records increase above 250 g usually only how mission if your drone also commercial use under <strong className="font-semibold text-slate-900">CAR 901.14</strong> or involves specialized operations or exposes unique safety angles <strong className="font-semibold text-slate-900">CAR 901.41</strong>.
              </p>
              <p className="pt-1 font-medium text-slate-800">
                <strong className="font-bold text-slate-900">Ready at your net, we&apos;re with the confidence:</strong> Keep your drone in top condition, enjoy every flight worry-free, and stay aligned with <strong className="font-semibold text-slate-900">Transport Canada rules</strong>. Maintenance is set in they cost-effective service for individual drone owners. We handle the complex cleaning, critical calibration, and firmware updates, and provide you with the exact dir maintenance records you omomommedafety regulations with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Footer CTA Section ──────────────────────────────────────── */}
      <section className="bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl border-t border-slate-200 pt-8 text-center">
            <h2 className="mb-2 text-base font-bold text-[#0d1626] sm:text-lg">
              Ready to Secure Your Fleet&apos;s Future?
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Don&apos;t wait for a critical hardware failure to remind you your service interval. Experience the Droner difference today. Protect your fleet, Support Transport Canada compliance. Keep your fleet flying with confidence.
            </p>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-5 sm:flex-row">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 shrink-0 text-slate-700" />
                <span className="text-[11px] font-medium text-slate-500">
                  Looking for something standard?
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                >
                  Explore All Maintenance Packages
                </button>
                <a
                  href="/contact"
                  className="text-xs font-bold text-red-600 transition hover:underline"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}