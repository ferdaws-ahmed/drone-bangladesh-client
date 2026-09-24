'use client';

/**
 * Banner.jsx — Maintenance page banner.
 *
 * Width: matches the site container (max-w-7xl with horizontal padding),
 * NOT a full-bleed edge-to-edge banner. Consistent with the products banner.
 *
 * Data: imageUrl, heading, subheading come from the parent (fetched server-side
 * from /api/client/banners?section=maintenance in page.jsx).
 *
 * Layout:
 *   - Left side: text content (heading + subheading)
 *   - Right side: empty — the bg image focus falls there naturally (object-right)
 *   - Background image at 60% opacity so left text stays readable
 */

export default function Banner({ imageUrl, heading, subheading }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <section
        className="relative overflow-hidden rounded-2xl bg-[#0d1626] shadow-md"
        style={{ minHeight: '240px' }}
      >
        {/* Background image — focused on the right side */}
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Maintenance banner"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-right"
            style={{ opacity: 0.55 }}
          />
        )}

        {/* Left-to-right gradient — keeps left text legible, right side shows image */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0d1626]/90 via-[#0d1626]/50 to-transparent" />

        {/* Bottom red accent line */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-red-600" />

        {/* Left-side content */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:py-16">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-red-400">
            Professional Service &amp; Repair
          </p>
          <h1 className="max-w-xl text-xl font-black leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
            {heading || 'Professional Care. Maximum Flight Time. Guaranteed Performance.'}
          </h1>
          {subheading && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
              {subheading}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
