'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// ── Fetch active banner for the products section (client-side, no auth) ───────
const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

function useProductsBanner() {
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    fetch(`${API_ROOT}/api/client/banners?section=products`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.success) {
          const active = (data.data?.items ?? []).find((b) => b.isActive);
          setBanner(active ?? null);
        }
      })
      .catch(() => {});
  }, []);
  return banner;
}
import ProductCard from '@/components/common/ProductCard';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const REQUEST_BASE = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
const MIN_PRICE = 10000;
const MAX_PRICE = 700000;

const normalizeQueryValues = (value) => {
  if (Array.isArray(value)) return value.flatMap((item) => normalizeQueryValues(item));
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
};

const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, String(entry)));
      return;
    }
    query.set(key, String(value));
  });
  return query.toString();
};

const defaultState = {
  page: 1,
  sort: 'popularity',
  maxPrice: MAX_PRICE,
  selectedBrands: [],
  selectedCategories: [],
  selectedAvailability: [],
};

const parseStateFromSearchParams = (searchParams) => {
  const selectedBrands = normalizeQueryValues(searchParams.getAll('brands'));
  const selectedCategories = normalizeQueryValues(searchParams.getAll('categories'));
  const selectedAvailability = normalizeQueryValues(searchParams.getAll('availability'));

  return {
    page: Math.max(1, Number(searchParams.get('page') || 1)),
    sort: searchParams.get('sort') || 'popularity',
    maxPrice: Math.min(MAX_PRICE, Math.max(MIN_PRICE, Number(searchParams.get('maxPrice') || MAX_PRICE))),
    selectedBrands,
    selectedCategories,
    selectedAvailability,
  };
};

const valueKey = (items = []) => items.join('|');

function ProductsCatalogContent() {
  const pathname    = usePathname();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const banner      = useProductsBanner();  // dynamic DB banner

  const [state, setState] = useState(() => parseStateFromSearchParams(searchParams));
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 12, availableBrands: [], availableCategories: [], availableStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setState(parseStateFromSearchParams(searchParams));
  }, [searchParams]);

  const updateUrl = (nextState) => {
    const params = new URLSearchParams();
    params.set('page', String(nextState.page));
    params.set('sort', nextState.sort);
    params.set('maxPrice', String(nextState.maxPrice));
    params.set('minPrice', String(MIN_PRICE));

    nextState.selectedBrands.forEach((brand) => params.append('brands', brand));
    nextState.selectedCategories.forEach((category) => params.append('categories', category));
    nextState.selectedAvailability.forEach((status) => params.append('availability', status));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const updateStateAndUrl = (nextState) => {
    setState(nextState);
    updateUrl(nextState);
  };

  const fetchProducts = () => {
    const query = buildQueryString({
      page: state.page,
      limit: 12,
      sort: state.sort,
      minPrice: MIN_PRICE,
      maxPrice: state.maxPrice,
      brands: state.selectedBrands,
      categories: state.selectedCategories,
      availability: state.selectedAvailability,
    });

    setLoading(true);
    fetch(`${REQUEST_BASE}/client/products?${query}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!payload?.success) {
          setProducts([]);
          setMeta({ total: 0, page: 1, totalPages: 1, limit: 12, availableBrands: [], availableCategories: [], availableStatus: [] });
          return;
        }

        setProducts(payload.data || []);
        setMeta(payload.meta || { total: 0, page: 1, totalPages: 1, limit: 12, availableBrands: [], availableCategories: [], availableStatus: [] });
      })
      .catch(() => {
        setProducts([]);
        setMeta({ total: 0, page: 1, totalPages: 1, limit: 12, availableBrands: [], availableCategories: [], availableStatus: [] });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [state.page, state.sort, state.maxPrice, valueKey(state.selectedBrands), valueKey(state.selectedCategories), valueKey(state.selectedAvailability)]);

  const totalResults = Number(meta.total || 0);
  const totalPages = Math.max(1, Number(meta.totalPages || 1));
  const currentPage = Math.min(Math.max(1, Number(meta.page || state.page || 1)), totalPages);
  const limit = Number(meta.limit || 12);
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalResults);
  const pageNumbers = Array.from({ length: Math.min(3, totalPages) }, (_, index) => index + 1);
  const availableBrands = meta.availableBrands || [];
  const availableCategories = meta.availableCategories || [];

  const toggleListItem = (key, value) => {
    const current = [...state[key]];
    const nextValues = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    const nextState = { ...state, [key]: nextValues, page: 1 };
    updateStateAndUrl(nextState);
  };

  const handleSortChange = (event) => {
    const nextState = { ...state, sort: event.target.value, page: 1 };
    updateStateAndUrl(nextState);
  };

  const handlePriceChange = (event) => {
    const nextState = { ...state, maxPrice: Number(event.target.value), page: 1 };
    updateStateAndUrl(nextState);
  };

  const handlePageChange = (page) => {
    const nextState = { ...state, page: Math.max(1, Math.min(page, totalPages)) };
    updateStateAndUrl(nextState);
  };

  const clearFilters = () => {
    const nextState = { ...defaultState };
    setState(nextState);
    router.replace(pathname, { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* ── Dynamic banner from DB ───────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#0d1626] shadow-sm">
        <div className="relative h-40 sm:h-52 lg:h-64">
          {banner?.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={banner.imageUrl}
              alt={banner.title || 'Products banner'}
              className="absolute inset-0 h-full w-full object-cover object-right"
              style={{ opacity: 0.6 }}
              loading="eager"
            />
          ) : (
            /* Fallback gradient while no banner is set or loading */
            <div className="absolute inset-0 bg-linear-to-r from-[#0f172a] to-[#1e3a5f]" />
          )}
          {/* Left-side gradient overlay so text stays readable */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0f172a]/85 via-[#0f172a]/40 to-transparent" />
          {/* Left-side content */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-8 lg:px-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                Shop Collection
              </p>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                {banner?.title || 'All Products'}
              </h1>
              {banner?.subtitle ? (
                <p className="mt-2 max-w-xl text-sm text-slate-200">{banner.subtitle}</p>
              ) : (
                <p className="mt-2 max-w-xl text-sm text-slate-200">
                  Discover premium drones, handhelds, and accessories built for performance and reliability.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded border border-[#e0e0e0] bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#333333]">Filter Products</h2>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Price Range (৳)</p>
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1000}
                value={state.maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-[#c1272d]"
              />
              <div className="mt-2 flex items-center justify-between text-[12px] text-[#666666]">
                <span>৳ {MIN_PRICE.toLocaleString('en-BD')}</span>
                <span>৳ {state.maxPrice.toLocaleString('en-BD')}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Availability</p>
              <div className="space-y-2">
                {['In Stock', 'Pre Order', 'Out of Stock'].map((status) => (
                  <label key={status} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                    <input
                      type="checkbox"
                      checked={state.selectedAvailability.includes(status)}
                      onChange={() => toggleListItem('selectedAvailability', status)}
                      className="h-4 w-4 accent-[#c1272d]"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Brand</p>
              <div className="space-y-2">
                {availableBrands.length > 0 ? (
                  availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                      <input
                        type="checkbox"
                        checked={state.selectedBrands.includes(brand)}
                        onChange={() => toggleListItem('selectedBrands', brand)}
                        className="h-4 w-4 accent-[#c1272d]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-[13px] text-[#6b7280]">No brands available</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#333333]">Category</p>
              <div className="space-y-2">
                {availableCategories.length > 0 ? (
                  availableCategories.slice(0, 10).map((category) => (
                    <label key={category} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                      <input
                        type="checkbox"
                        checked={state.selectedCategories.includes(category)}
                        onChange={() => toggleListItem('selectedCategories', category)}
                        className="h-4 w-4 accent-[#c1272d]"
                      />
                      <span>{category}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-[13px] text-[#6b7280]">No categories available</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded border border-[#333333] bg-transparent px-3 py-2 text-[13px] font-medium text-[#333333] transition hover:bg-[#f9fafb]"
              >
                <span>↺</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 border border-[#e0e0e0] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#4b5563]">
              {loading ? 'Loading products...' : `Showing ${totalResults === 0 ? 0 : startResult}-${endResult} of ${totalResults} results`}
            </p>

            <div className="flex items-center gap-2 text-[13px] text-[#4b5563]">
              <label htmlFor="sort" className="font-medium text-[#333333]">
                Sort by:
              </label>
              <select
                id="sort"
                value={state.sort}
                onChange={handleSortChange}
                className="rounded border border-[#d1d5db] bg-white px-2 py-1.5 text-[13px] text-[#1f2937] outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded border border-[#e0e0e0] bg-white text-center">
              <div>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#c1272d] border-t-transparent" />
                <p className="mt-4 text-sm text-[#4b5563]">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded border border-[#e0e0e0] bg-white text-center">
              <div>
                <p className="text-lg font-semibold text-[#333333]">No products found</p>
                <p className="mt-2 text-sm text-[#6b7280]">Try adjusting your filter selection.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id || product.id || `${product.productType}-${product.title}`} product={product} productPath={product.productPath || 'drones'} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#333333] transition hover:border-[#c1272d] hover:text-[#c1272d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-[13px] transition ${
                  pageNumber === currentPage
                    ? 'border-[#c1272d] bg-[#c1272d] text-white'
                    : 'border-[#d1d5db] bg-white text-[#333333] hover:border-[#c1272d] hover:text-[#c1272d]'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#333333] transition hover:border-[#c1272d] hover:text-[#c1272d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ›
            </button>
          </div>

          <div className="mt-8 rounded border border-[#e0e0e0] bg-white p-5 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-[#222222]">DJI Drones Price in Bangladesh</h2>
            <p className="mb-4 text-[13px] leading-6 text-[#555555]">
              Explore the latest collection of DJI drones in Bangladesh at Drone Bangladesh. We offer 100% original DJI drones with official warranty, the best prices, and nationwide delivery. Whether you&apos;re a beginner, content creator, or professional aerial photographer, find the perfect drone for you. From compact mini drones to powerful camera drones, we have it all available in Bangladesh. Order online with confidence &amp; fast delivery.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[13px]">
              <a href="/products" className="text-[#c1272d] hover:underline">DJI Drone Price List 2024</a>
              <span className="text-[#c1272d]">•</span>
              <a href="/products" className="text-[#c1272d] hover:underline">Select Model</a>
              <span className="text-[#c1272d]">•</span>
              <a href="/products" className="text-[#c1272d] hover:underline">Where to Buy All Drones</a>
              <span className="text-[#c1272d]">•</span>
              <a href="/products" className="text-[#c1272d] hover:underline">Why Buy DJI Drones From Drone Bangladesh?</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex min-h-[300px] items-center justify-center rounded border border-[#e0e0e0] bg-white text-center">
            <div>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#c1272d] border-t-transparent" />
              <p className="mt-4 text-sm text-[#4b5563]">Loading products...</p>
            </div>
          </div>
        </main>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
