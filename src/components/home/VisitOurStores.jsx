import { MapPin } from 'lucide-react';

// Store data — static, update here when locations change
const stores = [
  {
    id: 1,
    name: 'Bashundhara City',
    addressLines: [
      'Level-1, Block-B, Shop-45,',
      'Bashundhara City Shopping Complex,',
      'Dhaka-1215, Bangladesh'
    ],
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 2,
    name: 'Jamuna Future Park',
    addressLines: [
      'Shop - 444, Block - C, Level - 4,',
      'Jamuna Future Park,',
      'Kuril, Dhaka-1229.'
    ],
    mapUrl: 'https://maps.google.com',
  },
];

export default function VisitOurStores() {
  return (
    <section className="w-full bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Section Header matching image */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            Visit Our Stores
          </h2>
        </div>

        {/* Store cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm p-5 transition-all duration-200"
            >
              {/* Big Red Location Pin Icon matching image */}
              <div className="shrink-0 pt-0.5">
                <MapPin className="w-8 h-8 text-red-600 fill-red-100" />
              </div>

              {/* Store address details */}
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed space-y-0.5">
                  {store.addressLines.map((line, index) => (
                    <p key={index} className="group-hover:text-blue-600 transition-colors">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}