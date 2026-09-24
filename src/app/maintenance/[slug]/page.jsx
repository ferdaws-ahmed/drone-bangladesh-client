/**
 * /maintenance/[slug] — Package detail page (Server Component)
 *
 * Finds the package by slug or _id.
 * Strategy:
 *   1. Fetch active packages from the API.
 *   2. If found → render.
 *   3. If not found in DB (e.g. fallback packages have _id = 'basic' etc.)
 *      → look in FALLBACK_PACKAGES.
 *   4. Still not found → notFound().
 *
 * This means "Learn More" always works, even when the DB has no packages yet.
 */

import { notFound } from 'next/navigation';
import PackageDetailPage from '@/components/maintenance/PackageDetailPage';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

export const revalidate = 60;

// ── Fallback packages (same as MaintenancePackages.jsx) ───────────────────────
// Kept in sync manually — if you update one, update the other.
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
    inclusions: [],
    exclusions: [],
    description:
      'Our Basic Maintenance package covers all essential service checks to keep your drone airworthy and compliant. Ideal for operators who need reliable, cost-effective annual servicing.',
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
    inclusions: [],
    exclusions: [],
    description:
      'Designed for high-frequency operators requiring rigorous intermediate overhauls. Includes everything in Basic plus component-level repairs and motor health assessments.',
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
    inclusions: [],
    exclusions: [],
    description:
      'Maximum tier protection for mission-critical enterprise fleets. Complete deep overhaul covering every system, component, seal, and sensor on the aircraft.',
    duration: '7-10 business days',
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────
async function findPackage(slug) {
  // 1. Try DB first
  try {
    const res = await fetch(`${API_ROOT}/api/maintenance/packages?isActive=true`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        const items = data.data?.items ?? [];
        const found = items.find(
          (p) => p.slug === slug || String(p._id) === slug
        );
        if (found) return found;
      }
    }
  } catch {
    // API unreachable — fall through to fallback
  }

  // 2. Fall back to static data (covers 'basic', 'standard', 'premium' slugs)
  return FALLBACK_PACKAGES.find(
    (p) => p.slug === slug || p._id === slug
  ) ?? null;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  if (!pkg) return { title: 'Package Not Found | Drone Bangladesh' };
  return {
    title: `${pkg.name} | Drone Maintenance | Drone Bangladesh`,
    description:
      pkg.shortDescription ||
      `Book the ${pkg.name} maintenance service for your drone.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function MaintenancePackagePage({ params }) {
  const { slug } = await params;
  const pkg = await findPackage(slug);

  if (!pkg) notFound();

  return <PackageDetailPage pkg={pkg} />;
}
