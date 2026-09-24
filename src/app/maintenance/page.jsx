/**
 * /maintenance — Public Maintenance & Repair page (Server Component, ISR)
 *
 * Fetches three data sources in parallel:
 *   1. Page content  (heading, subheading, contactPhone, contactEmail)
 *        → GET /api/maintenance/page-content
 *   2. Active banner for this section
 *        → GET /api/client/banners?section=maintenance
 *   3. Active maintenance packages
 *        → GET /api/maintenance/packages?isActive=true
 *
 * The banner imageUrl from the banners collection takes priority over the
 * bannerImageUrl stored in page-content (which is kept for backward compat).
 *
 * Architecture:
 *   page.jsx  (Server Component, revalidate=60)
 *     └─ MaintenancePage.jsx  ('use client')
 *          ├─ Banner.jsx           ← imageUrl, heading, subheading
 *          ├─ DroneMaintenanceService.jsx
 *          ├─ MaintenancePackages.jsx
 *          └─ RpasCompliance.jsx
 */

import MaintenancePage from '@/components/maintenance/MaintenancePage';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

// ISR: rebuild at most once per minute
export const revalidate = 60;

export const metadata = {
  title: 'Drone Maintenance & Repair | Drone Bangladesh',
  description:
    'Professional drone maintenance, calibration, and repair services in Dhaka. Certified technicians, transparent pricing, and fast turnaround times.',
  openGraph: {
    title: 'Drone Maintenance & Repair | Drone Bangladesh',
    description:
      'Expert drone servicing packages from Basic calibration to full Premium overhauls. Book your service appointment online.',
    type: 'website',
  },
};

async function fetchPageContent() {
  try {
    const res = await fetch(`${API_ROOT}/api/maintenance/page-content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? data.data : null;
  } catch {
    return null;
  }
}

async function fetchActiveBanner() {
  try {
    const res = await fetch(`${API_ROOT}/api/client/banners?section=maintenance`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success) return null;
    // Return only the active banner
    return (data.data?.items ?? []).find((b) => b.isActive) ?? null;
  } catch {
    return null;
  }
}

async function fetchPackages() {
  try {
    const res = await fetch(`${API_ROOT}/api/maintenance/packages?isActive=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.success ? (data.data?.items ?? []) : [];
  } catch {
    return [];
  }
}

export default async function MaintenanceRoute() {
  const [pageContent, activeBanner, packages] = await Promise.all([
    fetchPageContent(),
    fetchActiveBanner(),
    fetchPackages(),
  ]);

  // Merge: banner collection image takes priority; fall back to page-content image
  const mergedContent = {
    ...(pageContent || {}),
    bannerImageUrl: activeBanner?.imageUrl || pageContent?.bannerImageUrl || null,
  };

  return <MaintenancePage pageContent={mergedContent} packages={packages} />;
}
