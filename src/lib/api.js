

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || '/admin';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const buildHeaders = (includeAuth = true, extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (includeAuth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : { success: res.ok, message: await res.text() };

  if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  if (res.status === 401 || res.status === 403) {
    return { success: false, message: data.message || 'Unauthorized.', status: res.status };
  }

  if (!res.ok && !data.success) {
    return { success: false, message: data.message || `Request failed (${res.status})`, status: res.status };
  }
  return data;
};

const request = async (path, { method = 'GET', body, auth = true, headers: h = {} } = {}) => {
  try {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
      method,
      headers: buildHeaders(auth, h),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await handleResponse(res);
  } catch (err) {
    return { success: false, message: 'Server connection failed.', error: err.message };
  }
};

const api = {
  base: API_BASE,
  adminUrl: ADMIN_URL,
  get: (p, o) => request(p, { ...o, method: 'GET' }),
  post: (p, body, o) => request(p, { ...o, method: 'POST', body }),
  put: (p, body, o) => request(p, { ...o, method: 'PUT', body }),
  patch: (p, body, o) => request(p, { ...o, method: 'PATCH', body }),
  delete: (p, body, o) => request(p, { ...o, method: 'DELETE', body }),
  withToken: (token) => ({
    get: (p, o) => request(p, { ...o, method: 'GET', headers: { Authorization: `Bearer ${token}` } }),
    post: (p, body, o) => request(p, { ...o, method: 'POST', body, headers: { Authorization: `Bearer ${token}` } }),
    put: (p, body, o) => request(p, { ...o, method: 'PUT', body, headers: { Authorization: `Bearer ${token}` } }),
    delete: (p, body, o) => request(p, { ...o, method: 'DELETE', body, headers: { Authorization: `Bearer ${token}` } }),
  }),
};

export default api;
export { API_BASE, ADMIN_URL, getToken, buildHeaders };


// ==========================================
// 🚁 Drone Client API Functions
// ==========================================

// ১. মেগা মেনুর জন্য ড্রোন ক্যাটাগরি ফেচ করা
export const getDroneCategories = async () => {
  return await api.get('/client/drones/categories', { auth: false });
};

// ২. নির্দিষ্ট ক্যাটাগরির আন্ডারে থাকা প্রোডাক্ট লিস্ট আনা (Slug দিয়ে)
export const getProductsByDroneCategory = async (slug) => {
  return await api.get(`/client/drones/category/${slug}`, { auth: false });
};

// ৩. সিঙ্গেল প্রোডাক্টের ডিটেইলস আনা (ID দিয়ে)
export const getSingleDroneProduct = async (id) => {
  return await api.get(`/client/drones/product/${id}`, { auth: false });
};

export const getHandheldCategories = async () => {
  return await api.get('/client/handhelds/categories', { auth: false });
};

export const getProductsByHandheldCategory = async (slug) => {
  return await api.get(`/client/handhelds/category/${slug}`, { auth: false });
};

export const getSingleHandheldProduct = async (id) => {
  return await api.get(`/client/handhelds/product/${id}`, { auth: false });
};

export const getRelatedProducts = async (type, id, relation = 'similar') => {
  return await api.get(`/client/${type}/product/${id}/related?relation=${relation}`, { auth: false });
};

export const getStoreSettings = async () => {
  return await api.get('/settings', { auth: false });
};

export const submitContactForm = async (payload) => {
  return await api.post('/contact', payload, { auth: false });
};

// ==========================================
// 🏠 Homepage API Functions
// ==========================================

// Featured categories (isFeatured: true, max 4)
export const getFeaturedCategories = async () => {
  return await api.get('/client/homepage/featured-categories', { auth: false });
};

// Homepage product sections — pass the flag name
export const getHomepageProducts = async (flag, limit = 8) => {
  return await api.get(`/client/homepage/products?flag=${flag}&limit=${limit}`, { auth: false });
};

// Honorable customers (all — client slices to 5 for slider)
export const getHonorableCustomers = async () => {
  return await api.get('/client/homepage/honorable-customers', { auth: false });
};

// ==========================================
// 📦 Order API Functions (authenticated)
// ==========================================

// Logged-in user-er sob orders fetch kora
export const getMyOrders = async () => {
  return await api.get('/orders/mine');
};

// Specific orderId diye single order fetch (for track-order page)
export const getMyOrderByOrderId = async (orderId) => {
  return await api.get(`/orders/mine/${encodeURIComponent(orderId)}`);
};

// ==========================================
// 👤 User Profile API Functions (authenticated)
// ==========================================

// Full user profile fetch (more fields than auth token payload)
export const getMyProfile = async () => {
  return await api.get('/auth/me');
};

// Profile update — accepts { name?, avatar? (base64), currentPassword?, newPassword?, confirmNewPassword? }
export const updateMyProfile = async (payload) => {
  return await api.put('/auth/me', payload);
};
