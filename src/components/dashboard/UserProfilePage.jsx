'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  User, Mail, Phone, MapPin, KeyRound, Save,
  Camera, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getMyProfile, updateMyProfile } from '@/lib/api';

// ─── helpers ──────────────────────────────────────────────────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const getInitials = (name = '') =>
  name.trim().split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

// ─── Avatar widget ─────────────────────────────────────────────────────────────
function AvatarEditor({ current, onSelect, uploading }) {
  const fileRef = useRef(null);

  return (
    <div className="relative w-20 h-20 shrink-0">
      {/* Avatar circle */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#002FA7] ring-4 ring-white shadow-md">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin opacity-70" /> : null}
          </div>
        )}
      </div>

      {/* Camera trigger */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="Change photo"
        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 hover:bg-slate-700 border-2 border-white flex items-center justify-center text-white transition-colors disabled:opacity-50"
      >
        {uploading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Camera className="w-3.5 h-3.5" />
        }
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) { alert('Please choose an image file.'); return; }
          if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB.'); return; }
          const b64 = await fileToBase64(file);
          onSelect(b64);
          // reset so same file can be re-selected if needed
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Alert banner ─────────────────────────────────────────────────────────────
function Alert({ type, message }) {
  if (!message) return null;
  const styles =
    type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : 'bg-rose-50 border-rose-200 text-rose-700';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${styles}`}>
      <Icon className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}

// ─── Input row ────────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {children}
      </div>
    </div>
  );
}

const inputCls = (disabled = false) =>
  `w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
    disabled
      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-[#002FA7]'
  }`;

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: '', phone: '', address: '',
    currentPassword: '', newPassword: '', confirmNewPassword: '',
  });
  const [avatarPreview, setAvatarPreview]   = useState('');   // local b64 preview
  const [pendingAvatar, setPendingAvatar]   = useState(null); // b64 waiting to upload
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [alert, setAlert]     = useState({ type: '', msg: '' });
  const [fetchError, setFetchError] = useState('');

  // ── Load full profile from server on mount ──
  const loadProfile = useCallback(async () => {
    const res = await getMyProfile();
    if (res?.success && res.data) {
      const d = res.data;
      setForm((f) => ({
        ...f,
        name:    d.name    || user?.name    || '',
        phone:   d.phone   || '',
        address: d.address || '',
      }));
      if (d.avatar) setAvatarPreview(d.avatar);
    } else {
      // fallback to auth context data
      setForm((f) => ({ ...f, name: user?.name || '' }));
      if (res && !res.success) setFetchError(res.message || 'Could not load profile.');
    }
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── Avatar selected — show local preview immediately, save on form submit ──
  const handleAvatarSelect = (b64) => {
    setAvatarPreview(b64);
    setPendingAvatar(b64);
  };

  // ── Form submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', msg: '' });

    // Password validation (only if user is trying to change it)
    const changingPw = form.currentPassword || form.newPassword || form.confirmNewPassword;
    if (changingPw) {
      if (!form.currentPassword) { setAlert({ type: 'error', msg: 'Enter your current password.' }); return; }
      if (form.newPassword.length < 8) { setAlert({ type: 'error', msg: 'New password must be at least 8 characters.' }); return; }
      if (form.newPassword !== form.confirmNewPassword) { setAlert({ type: 'error', msg: 'New passwords do not match.' }); return; }
    }

    setSaving(true);

    // Build payload — only send fields that changed
    const payload = {};
    if (form.name.trim())   payload.name    = form.name.trim();
    if (form.phone.trim())  payload.phone   = form.phone.trim();
    if (form.address.trim()) payload.address = form.address.trim();
    if (pendingAvatar)      payload.avatar  = pendingAvatar;
    if (changingPw) {
      payload.currentPassword    = form.currentPassword;
      payload.newPassword        = form.newPassword;
      payload.confirmNewPassword = form.confirmNewPassword;
    }

    const res = await updateMyProfile(payload);

    if (res?.success) {
      // Sync auth context so Navbar/header reflects new name/avatar immediately
      updateUser({
        name:   res.data?.name   || form.name,
        avatar: res.data?.avatar || avatarPreview,
      });
      setPendingAvatar(null);
      if (res.data?.avatar) setAvatarPreview(res.data.avatar);
      // Clear password fields
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
      setAlert({ type: 'success', msg: 'Profile updated successfully!' });
    } else {
      setAlert({ type: 'error', msg: res?.message || 'Update failed. Please try again.' });
    }

    setSaving(false);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-5 max-w-2xl">

        {/* ── Profile header ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          {/* Avatar with edit button */}
          <div className="relative">
            <AvatarEditor
              current={avatarPreview || user?.avatar}
              onSelect={handleAvatarSelect}
              uploading={avatarUploading}
            />
            {/* Initials fallback layer (sits under the img) */}
            {!avatarPreview && !user?.avatar && (
              <div className="absolute inset-0 w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-black pointer-events-none">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">
              {user?.name || form.name || 'My Profile'}
            </h1>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-blue-50 text-[#002FA7] text-[11px] font-bold rounded-full uppercase tracking-wide">
              {user?.role || 'Customer'}
            </span>
          </div>

          {pendingAvatar && (
            <p className="ml-auto text-[11px] text-amber-600 font-semibold shrink-0">
              New photo selected — save to upload
            </p>
          )}
        </div>

        {/* Alerts */}
        {fetchError && <Alert type="error" message={fetchError} />}
        {alert.msg  && <Alert type={alert.type} message={alert.msg} />}

        {/* ── Edit form ────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">

          {/* Personal info */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" icon={User}>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={set('name')}
                  className={inputCls()}
                  placeholder="Your full name"
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className={inputCls(true)}
                />
              </Field>

              <Field label="Phone Number" icon={Phone}>
                <input
                  type="text"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inputCls()}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </Field>

              <Field label="Shipping Address" icon={MapPin}>
                <input
                  type="text"
                  value={form.address}
                  onChange={set('address')}
                  className={inputCls()}
                  placeholder="Dhaka, Bangladesh"
                />
              </Field>
            </div>
          </div>

          {/* Password change */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#E11D48]" />
              Change Password
              <span className="text-[11px] font-normal text-slate-400">(leave blank to keep current)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={set('currentPassword')}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#002FA7] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={set('newPassword')}
                  placeholder="min 8 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#002FA7] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={form.confirmNewPassword}
                  onChange={set('confirmNewPassword')}
                  placeholder="repeat new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#002FA7] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#002FA7] hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Save className="w-4 h-4" /> Save Changes</>
              }
            </button>
          </div>
        </form>

      </div>
    </ProtectedRoute>
  );
}
