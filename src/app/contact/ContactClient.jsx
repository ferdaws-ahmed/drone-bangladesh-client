'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Map as MapIcon,
  ShieldCheck,
  HeadsetIcon,
  Send
} from 'lucide-react';
import { getStoreSettings, submitContactForm } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const DEFAULT_CONTACT = {
  phone: '+880 1317-768213',
  email: 'dronebangladesh567@gmail.com',
  address: 'Level-1, Block-B, Shop-43, Bashundhara City Shopping Complex, Dhaka-1215',
  mapLink: 'https://maps.google.com/?q=Bashundhara+City+Shopping+Complex+Dhaka',
};

const INQUIRY_TYPES = [
  'Support',
  'Product Question',
  'Order Support',
  'Warranty / Repair',
  'Bulk / Corporate',
  'Other',
];

export default function ContactClient() {
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [storeName, setStoreName] = useState('Drone Bangladesh');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Courier delivery / product / support query',
    queryType: 'Support',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toast = useToast();

  // ── Dynamic banner from DB ──────────────────────────────────────────────────
  const [contactBanner, setContactBanner] = useState(null);
  useEffect(() => {
    fetch(`${API_ROOT}/api/client/banners?section=contact`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.success) {
          const active = (data.data?.items ?? []).find((b) => b.isActive);
          setContactBanner(active ?? null);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStoreSettings();
        if (res?.success && res.data) {
          setStoreName(res.data.storeName || storeName);
          const c = res.data.contact || {};
          setContact({
            phone: c.phone || DEFAULT_CONTACT.phone,
            email: c.email || DEFAULT_CONTACT.email,
            address: c.address || DEFAULT_CONTACT.address,
            mapLink: c.mapLink || DEFAULT_CONTACT.mapLink,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) {
      e.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email';
    }
    if (!form.message.trim()) e.message = 'Please write your message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await submitContactForm(form);
      if (res?.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', subject: 'Courier delivery / product / support query', queryType: 'Support', message: '' });
        setErrors({});
        toast.success(res.message || 'Message sent successfully!');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(res?.message || 'Failed to send message.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const mapEmbed = 'https://maps.google.com/maps?q=Bashundhara+City+Shopping+Complex+and+Jamuna+Future+Park+Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans py-6">
      {/* 1. Hero Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6">
        <div className="relative overflow-hidden bg-[#0d1626] text-white py-10 px-6 sm:px-10 rounded-2xl shadow-sm" style={{ minHeight: '180px' }}>
          {/* DB banner image — bg, focused on right side */}
          {contactBanner?.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={contactBanner.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-right"
              style={{ opacity: 0.45 }}
            />
          )}
          {/* Dot pattern overlay — always visible */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] bg-size-[16px_16px]" />
          {/* Left gradient so text stays readable */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0d1626]/95 via-[#0d1626]/60 to-transparent" />
          {/* Bottom red accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />

          {/* Left-side static text content */}
          <div className="relative z-10 max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.2em] text-red-600 uppercase mb-2">WE ARE HERE TO HELP</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              Talk To A <span className="text-red-600">Drone Expert</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              Product, courier, delivery and after-sales questions are managed from one support desk.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5"><span className="text-red-600 font-bold">✓</span> Expert Support</span>
              <span className="flex items-center gap-1.5"><span className="text-red-600 font-bold">✓</span> Quick Response</span>
              <span className="flex items-center gap-1.5"><span className="text-red-600 font-bold">✓</span> Trusted Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Body Grid: Let's Make Your Next Flight Better & Send Us a Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Info Details Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200/80 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Let&apos;s Make Your Next Flight Better
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Whether you need product guidance, delivery support, or professional drone solutions, our expert team is ready to assist you.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-800">Level-1, Block-B, Shop-43, Bashundhara City Shopping Complex, Dhaka-1215</p>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-800">Shop-444, Block-C, Level-4, Jamuna Future Park, Kuril, Dhaka-1229</p>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <a href="tel:+8801317768213" className="text-xs font-bold text-slate-800 hover:text-red-600">
                  +880 1317-768213
                </a>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50/70 border border-slate-100">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href="mailto:dronebangladesh567@gmail.com" className="text-xs font-bold text-slate-800 hover:text-red-600">
                  dronebangladesh567@gmail.com
                </a>
              </div>
            </div>

            {/* Courier Delivery Highlight Box */}
            <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Courier Delivery</p>
                <p className="text-[11px] text-slate-500 mt-0.5">We will deliver your orders to your provided address.</p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Send Us a Message Form Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <div className="h-6 w-6 rounded bg-red-100 flex items-center justify-center font-bold">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Send Us a Message</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-5">Fill the form below and we&apos;ll get back to you as soon as possible</p>

            {success && (
              <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-[11px] font-bold text-emerald-800">Message sent successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 bg-slate-50/40"
                />
                {errors.name && <p className="text-[10px] text-red-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 bg-slate-50/40"
                />
                {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="Courier delivery / product / support query"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Query type
                </label>
                <select
                  value={form.queryType}
                  onChange={(e) => updateField('queryType', e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-slate-50/40 focus:outline-none focus:border-red-600"
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  How can we help? <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Type your message here..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 bg-slate-50/40"
                />
                {errors.message && <p className="text-[10px] text-red-600 mt-0.5">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/20 disabled:opacity-70"
              >
                {submitting ? 'Sending...' : <>Send Message <Send className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. Find Us on the Map Section */}
      <section className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-3 w-1 bg-red-600 rounded"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Find Us on the Map</h2>
              </div>
              <p className="text-xs text-slate-500">Visit our stores at Bashundhara City or Jamuna Future Park. Click on the markers for details or get directions.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200/80">
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-red-600" /> Fast Delivery <span className="font-normal text-slate-500 hidden sm:inline">Across Bangladesh</span></span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Official Store <span className="font-normal text-slate-500 hidden sm:inline">100% Original Products</span></span>
              <span className="flex items-center gap-1.5"><HeadsetIcon className="w-3.5 h-3.5 text-red-600" /> Expert Support <span className="font-normal text-slate-500 hidden sm:inline">Always Here to Help</span></span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-200 h-[480px]">
            <iframe
              src={mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Store Location Map"
            />

            {/* Absolute Floating Card on Map */}
            <div className="absolute top-4 right-4 z-10 w-72 sm:w-80 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200 hidden sm:block">
              <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4" />
                Our Store Locations
              </div>

              <div className="space-y-3 text-xs border-b border-slate-100 pb-3 mb-3">
                <div>
                  <p className="font-bold text-slate-900">Bashundhara City Shopping Complex</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Level-1, Block-B, Shop-43, Dhaka-1215</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Jamuna Future Park</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Shop-444, Block-C, Level-4, Kuril, Dhaka-1229</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-red-600" /> +880 1317-768213</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-red-600" /> dronebangladesh567@gmail.com</p>
              </div>

              <a
                href={contact.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/20"
              >
                <MapIcon className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}