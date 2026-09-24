'use client';

/**
 * PackageDetailPage.jsx
 *
 * Client component for /maintenance/[slug].
 * Shows full package details on the left and the booking form on the right.
 * Receives the package object as a prop (fetched server-side).
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Clock, CalendarCheck,
  Loader2, CheckCircle,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const fmtPrice = (n) => '৳' + Number(n).toLocaleString('en-BD');

// ── Booking Form ───────────────────────────────────────────────────────────────
function BookingForm({ pkg }) {
  const toast = useToast();

  const EMPTY = {
    name: '', email: '', phone: '', droneModel: '',
    packageId: pkg._id,
    packageName: pkg.name,
    subject: '', serviceDetails: '', preferredDate: '',
  };

  const [form, setForm]             = useState(EMPTY);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name       = 'Full name is required.';
    if (!form.phone.trim())      e.phone      = 'Phone number is required.';
    if (!form.droneModel.trim()) e.droneModel = 'Drone model is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_ROOT}/api/maintenance/service-requests`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.success) {
        setSuccess(true);
        toast.success(data.message || 'Service request submitted!');
      } else {
        toast.error(data?.message || 'Submission failed. Please try again.');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition';
  const labelCls = 'mb-1 block text-xs font-bold text-slate-700';

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-base font-black text-slate-900">Request Submitted!</h3>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
          We&apos;ve received your service request and will contact you shortly to confirm the appointment.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSuccess(false)}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Submit Another
          </button>
          <Link
            href="/maintenance"
            className="rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            Back to Maintenance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Zihan Ahmed"
            className={inputCls}
          />
          {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className={labelCls}>
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+880 1XXXXXXXXX"
            className={inputCls}
          />
          {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Email + Drone Model */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="example@domain.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            Drone Model <span className="text-red-600">*</span>
          </label>
          <input
            value={form.droneModel}
            onChange={(e) => set('droneModel', e.target.value)}
            placeholder="e.g. DJI Mavic 3"
            className={inputCls}
          />
          {errors.droneModel && (
            <p className="mt-0.5 text-xs text-red-600">{errors.droneModel}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className={labelCls}>Subject</label>
        <input
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
          placeholder="e.g. Annual Inspection, Crash Repair…"
          className={inputCls}
        />
      </div>

      {/* Service Details */}
      <div>
        <label className={labelCls}>Maintenance Service Details</label>
        <textarea
          rows={4}
          value={form.serviceDetails}
          onChange={(e) => set('serviceDetails', e.target.value)}
          placeholder="Describe the issue or service you need in detail…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Preferred Date */}
      <div>
        <label className={labelCls}>Preferred Date &amp; Time</label>
        <input
          type="datetime-local"
          value={form.preferredDate}
          onChange={(e) => set('preferredDate', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-red-700 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        <CalendarCheck className="h-4 w-4" />
        {submitting ? 'Submitting…' : 'Confirm Maintenance Request'}
      </button>
    </form>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function PackageDetailPage({ pkg }) {
  const features   = (pkg.features   ?? []).filter(Boolean);
  const inclusions = (pkg.inclusions ?? []).filter(Boolean);
  const exclusions = (pkg.exclusions ?? []).filter(Boolean);

  const topBorder = pkg.category === 'premium' ? 'border-red-600' : 'border-blue-600';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-red-500 selection:text-white">
      {/* ── Container ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/maintenance"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Maintenance
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
            Maintenance Package
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {pkg.name}
          </h1>
          {pkg.shortDescription && (
            <p className="mt-2 max-w-2xl text-sm text-slate-500">{pkg.shortDescription}</p>
          )}
        </div>

        {/* Two-column layout: details left, form right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">

          {/* ── LEFT: Package details ── */}
          <div className="space-y-6">

            {/* Pricing + Duration card */}
            <div className={`rounded-2xl border-l-4 ${topBorder} bg-white p-6 shadow-sm`}>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Starting Price
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    {fmtPrice(pkg.price)}
                  </p>
                  {pkg.originalPrice > 0 && (
                    <p className="text-sm text-slate-400 line-through">
                      {fmtPrice(pkg.originalPrice)}
                    </p>
                  )}
                </div>
                {pkg.duration && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">{pkg.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {pkg.description && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">
                  About This Package
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">{pkg.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">
                  What&apos;s Included
                </h2>
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inclusions */}
            {inclusions.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">
                  Inclusions
                </h2>
                <ul className="space-y-2">
                  {inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusions */}
            {exclusions.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">
                  Exclusions
                </h2>
                <ul className="space-y-2">
                  {exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── RIGHT: Booking form ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 border-b border-slate-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                  Book a Service
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Schedule {pkg.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fill in the form and we&apos;ll confirm your appointment shortly.
                </p>
              </div>
              <BookingForm pkg={pkg} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
