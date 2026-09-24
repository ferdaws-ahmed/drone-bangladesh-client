'use client';

/**
 * DroneMaintenanceService.jsx
 */

import { Phone, Mail, ShieldCheck } from 'lucide-react';

const SERVICE_TAGS = [
  'Inspection',
  'Deep Clean',
  'Avionics',
  'Calibration',
  'Test Flight',
  'Replace Worn Parts',
];

export default function DroneMaintenanceService({ contactPhone, contactEmail }) {
  const phone = contactPhone || '1-844-373-7663';
  const email = contactEmail || 'info@droner.ca';

  return (
    <div className="bg-white text-slate-800">
      {/* ── Top Header Section (Heading & Contact bar) ────────────────── */}
      <div className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Border contained inside max-w-7xl */}
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Drone Maintenance Services
            </h2>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-700">
              <span>
                Call toll free:{' '}
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="font-bold text-red-600 hover:underline"
                >
                  {phone}
                </a>
              </span>
              <span className="text-slate-400">|</span>
              <span>
                Email:{' '}
                <a
                  href={`mailto:${email}`}
                  className="font-bold text-slate-700 hover:underline"
                >
                  {email}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Section (Shield + Protect Your Fleet) ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Shield Icon Box */}
          <div className="mx-auto flex shrink-0 items-center justify-center p-4">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <ShieldCheck className="h-24 w-24 text-slate-900 stroke-[1.5]" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-4 text-left">
            <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
              Protect Your Fleet, Maximize Uptime, and Guarantee Compliance
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Your drone fleet is a high-value asset, and keeping it reliable performs critical to your mission. From routine UAV/RSO preventive maintenance to the most effective way to protect your investment, our expert technicians ensure service the lifecycle of your unmanned aerial vehicle effectively with precision and attention.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Under Transport Canada&apos;s Canadian Aviation Regulations (CARs) 901.09, operators are mandated to make in their system according to manufacturer&apos;s manuals, specific UMI and related details, as well as documented flight logs to maintain exception standards CAR 921.14. By something but nobody to prove to be standardized, public review must be by limiting regular maintenance, you protect your performing flawlessly while avoiding your CAR 901 role drone maintenance records are 100% compliant and ready for your next mission.
            </p>
          </div>
        </div>

        
      </section>
    </div>
  );
}