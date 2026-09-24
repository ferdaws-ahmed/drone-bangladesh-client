import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa6';

// --- Constants & Data ---
const FOOTER_LINKS = {
  quickLinks: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund & Return', href: '/refund-policy' },
  ],
  customerService: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Warranty Policy', href: '/warranty-policy' },
    { name: 'Blog', href: '/blog-duplicate' },
  ],
  myAccount: [
    { name: 'My Account', href: '/account' },
    { name: 'Order History', href: '/account/orders' },
    { name: 'Wishlist', href: '/account/wishlist' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Loyalty Program', href: '/loyalty' },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: '#', label: 'Facebook', color: 'bg-[#1877F2]' },
  { icon: FaYoutube, href: '#', label: 'Youtube', color: 'bg-[#FF0000]' },
  { icon: FaInstagram, href: '#', label: 'Instagram', color: 'bg-[#E4405F]' },
  { icon: FaWhatsapp, href: '#', label: 'WhatsApp', color: 'bg-[#25D366]' },
];

const PAYMENT_METHODS = [
  { name: 'Visa', src: '/images/payment/visa.png' },
  { name: 'Mastercard', src: '/images/payment/mastercard.png' },
  { name: 'Bkash', src: '/images/payment/bkash.png' },
  { name: 'Nagad', src: '/images/payment/nagad.png' },
  { name: 'Rocket', src: '/images/payment/rocket.png' },
  { name: 'City Bank', src: '/images/payment/citybank.png' },
];

// --- Sub-Component for Columns ---
const FooterColumn = ({ title, links }) => (
  <div className="space-y-2">
    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{title}</h3>
    <ul className="space-y-1.5 text-[12px] font-normal text-[#94A3B8] hover:[&>li>a]:text-white">
      {links.map((link) => (
        <li key={link.name}>
          <Link href={link.href} className="transition-colors">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Footer Component ---
export default function Footer() {
  return (
    <footer className="w-full bg-[#0A1128] text-[#94A3B8] border-t border-gray-800 pt-8 pb-4 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        
        {/* Column 1: Logo, Description & Socials */}
        <div className="space-y-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current stroke-[1.5]" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" />
                <path d="M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
                <circle cx="5" cy="5" r="2" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider text-white leading-none">DRONE</span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-[#94A3B8] mt-0.5">BANGLADESH</span>
            </div>
          </Link>
          <p className="text-[12px] font-normal leading-relaxed text-[#94A3B8]">
            Your trusted partner for premium drones, cameras and accessories in Bangladesh.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Link 
                  key={social.label} 
                  href={social.href} 
                  aria-label={social.label} 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${social.color} hover:opacity-90 transition-opacity`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Columns 2-4: Nav Links */}
        <FooterColumn title="Quick Links" links={FOOTER_LINKS.quickLinks} />
        <FooterColumn title="Customer Service" links={FOOTER_LINKS.customerService} />
        <FooterColumn title="My Account" links={FOOTER_LINKS.myAccount} />

        {/* Column 5: Store Addresses */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">STORE ADDRESS</h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-[12px] font-normal leading-tight text-[#94A3B8]">
              <MapPin className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <p>Level-1, Block-B, Shop-45, Bashundhara City Shopping Complex, Dhaka-1215</p>
            </div>
            <div className="flex items-start gap-2 text-[12px] font-normal leading-tight text-[#94A3B8]">
              <MapPin className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <p>Shop-444, Block-C, Level-4, Jamuna Future Park, Kuril, Dhaka-1229</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Footer Row --- */}
      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gray-800/80 flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] font-medium text-[#94A3B8]">
        
        {/* Copyright */}
        <p>© 2026 Drone Bangladesh. All Rights Reserved.</p>

        {/* Payment Methods */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[#94A3B8]">We Accept:</span>
          <div className="flex items-center gap-1.5">
            {PAYMENT_METHODS.map((item, idx) => (
              <div key={idx} className="bg-white px-1.5 py-0.5 rounded h-6 w-9 flex items-center justify-center shadow-xs">
                <Image 
                  src={item.src} 
                  alt={item.name} 
                  width={32} 
                  height={18} 
                  className="h-full w-auto object-contain" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Developer Credit */}
        <div className="flex items-center gap-2">
          <span>Developed by</span>
          <span className="font-bold text-white tracking-wide">Alif Mahmud</span>
          <div className="w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center">
            <FaWhatsapp className="w-3 h-3 text-white" />
          </div>
        </div>

      </div>
    </footer>
  );
}