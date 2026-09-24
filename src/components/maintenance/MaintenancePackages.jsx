'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

// ── Fallback data ──────────────────────────────────────────────────────────────
const FALLBACK_PACKAGES = [
  {
    _id: 'basic',
    slug: 'basic',
    name: 'Basic Maintenance',
    price: 7500,
    originalPrice: 0,
    category: 'basic',
    shortDescription:
      'Ideal for fleet drones — standard service & checkups to keep equipment reliable and secure.',
    features: [
      'Thorough deep-cleaning of the aircraft and sterilize payload',
      'Comprehensive flight inspection & environment check',
      'Critical firmware update and specialized sensor calibration',
      'Delivery of detailed, audit-ready maintenance reports',
    ],
    duration: '3-5 business days',
  },
  {
    _id: 'standard',
    slug: 'standard',
    name: 'Standard Maintenance',
    price: 14500,
    originalPrice: 0,
    category: 'standard',
    shortDescription:
      'Ideal for active fleets flying with frequent missions, or harsh environments with moderate flight issues.',
    features: [
      'Includes all Basic Tier services (Deep Clean, Inspection & Calibration)',
      'Comprehensive motor/flight-controller component replacement',
      'Motor health & test-stand scaling/alignment',
      'Endorse for airworthiness stability and high-performance',
    ],
    duration: '5-7 business days',
  },
  {
    _id: 'premium',
    slug: 'premium',
    name: 'Premium Maintenance',
    price: 24500,
    originalPrice: 0,
    category: 'premium',
    shortDescription:
      'Ideal for high-demand enterprise operations flying in extreme environments or utilizing mission-critical payloads.',
    features: [
      'Includes all Standard Tier services (Deep Clean, Calibration, Motor Part Assessment)',
      'Complete deep-component overhaul, chassis & electronic panel sensors',
      'Battery cell-analyticity certification & full-texture sealant audit',
      'Full overhaul of water-proof seals, gaskets and weather-sealing systems',
    ],
    duration: '7-10 business days',
  },
];

const fmtPrice = (n) => '৳' + Number(n).toLocaleString('en-BD');

// ── Package Card ───────────────────────────────────────────────────────────────
function PackageCard({ pkg }) {
  const [expanded, setExpanded] = useState(false);
  const features = (pkg.features ?? []).filter(Boolean);
  const VISIBLE  = 3;
  const hasMore  = features.length > VISIBLE;
  const slug     = pkg.slug || pkg._id;

  const topBorder =
    pkg.category === 'premium' ? 'border-t-red-600' : 'border-t-blue-600';

  return (
    <div className={`relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md border-t-4 ${topBorder}`}>
      {/* Name & description */}
      <h3 className="mb-2 text-base font-black text-slate-900">{pkg.name}</h3>
      <p className="mb-4 min-h-11 text-xs leading-relaxed text-slate-500">
        {pkg.shortDescription}
      </p>

      <hr className="mb-4 border-slate-100" />

      {/* Feature list */}
      <ul className="mb-2 flex-1 space-y-2.5 text-xs text-slate-700">
        {features.slice(0, expanded ? features.length : VISIBLE).map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span className="leading-tight">{f}</span>
          </li>
        ))}
      </ul>

      {/* Expand toggle */}
      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mb-4 flex items-center gap-1 text-xs font-bold text-red-600 transition hover:text-red-700"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> +{features.length - VISIBLE} more features</>
          )}
        </button>
      )}

      {/* Price + CTA */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pricing
          </span>
          <span className="text-lg font-black text-red-600">
            From {fmtPrice(pkg.price)}
          </span>
        </div>
        {/* Navigate to the package detail page */}
        <Link
          href={`/maintenance/${slug}`}
          className="rounded-xl bg-[#0d1626] px-5 py-2.5 text-xs font-black text-white transition hover:bg-slate-700 shadow-sm"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function MaintenancePackages({ packages }) {
  const displayPkgs = packages?.length ? packages : FALLBACK_PACKAGES;

  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-t border-slate-200 py-10">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Maintenance Packages
          </h2>
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            Every drone operation is unique, and so is the care it demands. From
            operational checks to deep overhauls, our specialized maintenance programs
            ensure your UAV&apos;s airworthiness and peak performance.
          </p>

          <p className="mb-3 mt-6 text-xs font-bold text-slate-700">
            Our services are compatible with the latest and previous DJI items
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Inspection', 'Deep Clean', 'Avionics', 'Calibration', 'Test Flight', 'Replace Worn Parts'].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-300 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayPkgs.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
