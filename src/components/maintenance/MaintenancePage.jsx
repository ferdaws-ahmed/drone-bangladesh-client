'use client';

/**
 * MaintenancePage.jsx
 *
 * Orchestrator for the public /maintenance page.
 * Receives pre-fetched SSR data from page.jsx (Server Component).
 *
 * "Learn More" on a package card navigates to /maintenance/[slug]
 * where the package detail + booking form live.
 */

import Banner                  from './Banner';
import DroneMaintenanceService from './DroneMaintenanceService';
import MaintenancePackages     from './MaintenancePackages';
import RpasCompliance          from './RpasCompliance';

export default function MaintenancePage({ pageContent, packages }) {
  const content     = pageContent || {};
  const displayPkgs = packages?.length ? packages : [];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-red-500 selection:text-white">

      {/* 1. Banner */}
      <Banner
        imageUrl={content.bannerImageUrl}
        heading={content.heading}
        subheading={content.subheading}
      />

      {/* 2. Contact bar + service intro */}
      <DroneMaintenanceService
        contactPhone={content.contactPhone}
        contactEmail={content.contactEmail}
      />

      {/* 3. Package cards — "Learn More" links to /maintenance/[slug] */}
      <MaintenancePackages packages={displayPkgs} />

      {/* 4. RPAS compliance + peace of mind + footer CTA */}
      <RpasCompliance workshopImageUrl={content.bannerImageUrl} />

    </div>
  );
}
