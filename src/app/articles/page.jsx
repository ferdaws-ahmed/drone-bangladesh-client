'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_ROOT = /\/api\/?$/.test(API_BASE) ? API_BASE.replace(/\/api\/?$/, '') : API_BASE;
const buildApiUrl = (path) => `${API_ROOT}/api/${path.replace(/^\/+/, '')}`;
const PAGE_SIZE = 12;

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });

    fetch(buildApiUrl(`/client/articles?${params.toString()}`), { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (!active) return;
        setArticles(payload.success ? payload.data?.items || [] : []);
        setMeta(payload.success ? payload.data?.meta || { page, totalPages: 1, total: 0 } : { page, totalPages: 1, total: 0 });
      })
      .catch(() => {
        if (active) setArticles([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page]);

  const totalPages = Math.max(1, Number(meta.totalPages || 1));

  const buildPaginationNumbers = () => {
    const nums = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) nums.push(i);
      return nums;
    }
    nums.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) nums.push('...');
    for (let i = start; i <= end; i += 1) nums.push(i);
    if (end < totalPages - 1) nums.push('...');
    nums.push(totalPages);
    return nums;
  };

  const btn32 = 'flex items-center justify-center text-[13px] font-semibold transition rounded-[6px] w-8 h-8';

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center mb-8">
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            textAlign: 'center',
            color: '#222',
            marginBottom: '24px',
            lineHeight: 1.3,
          }}
        >
          Drone News &amp; Help Blog
        </h1>
        <div
          style={{
            width: '40px',
            height: '2px',
            backgroundColor: '#c1272d',
            margin: '0 auto',
          }}
          aria-hidden="true"
        />
      </header>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '20px',
            rowGap: '24px',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="aspect-video bg-gray-100" />
              <div style={{ padding: '20px' }} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-base font-semibold text-gray-700 mb-1">No articles found</p>
          <p className="text-sm text-gray-500">Please check back soon for new updates.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '20px',
            rowGap: '24px',
          }}
        >
          {articles.map((article) => (
            <article
              key={article._id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
              className="group flex flex-col transition-shadow hover:shadow-md"
            >
              <Link href={`/articles/${article.slug}`} className="block w-full">
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Drone Bangladesh
                    </div>
                  )}
                </div>
              </Link>

              <div style={{ padding: '20px' }} className="flex flex-col flex-1">
                <Link href={`/articles/${article.slug}`} className="block mb-2">
                  <h2
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#111',
                      lineHeight: 1.4,
                      marginBottom: '8px',
                    }}
                    className="line-clamp-2 group-hover:text-[#c1272d] transition"
                  >
                    {article.title}
                  </h2>
                </Link>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#777',
                    marginBottom: '12px',
                  }}
                >
                  By <span className="font-semibold">{article.author || 'Drone Bangladesh'}</span>
                  <span className="mx-1.5">•</span>
                  {formatDate(article.createdAt)}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/articles/${article.slug}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#c1272d',
                    }}
                    className="inline-flex items-center gap-0.5 transition hover:underline"
                  >
                    Read More
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Article pagination"
          className="mt-8 flex items-center justify-center gap-1.5 flex-wrap"
          style={{ marginTop: '32px' }}
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className={`${btn32} px-2 border min-w-[36px] ${
              page === 1
                ? 'border-[#e0e0e0] text-[#333] opacity-40 cursor-not-allowed'
                : 'border-[#e0e0e0] text-[#333] hover:border-[#c1272d] hover:text-[#c1272d]'
            }`}
          >
            ← Prev
          </button>

          {buildPaginationNumbers().map((num, idx) =>
            num === '...' ? (
              <span key={`dots-${idx}`} className="px-1 text-[13px] text-[#777] min-w-[24px] text-center">
                ...
              </span>
            ) : (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={btn32}
                style={
                  page === num
                    ? { backgroundColor: '#c1272d', color: '#ffffff', border: '1px solid #c1272d' }
                    : { backgroundColor: 'transparent', color: '#333', border: '1px solid #e0e0e0' }
                }
              >
                {num}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className={`${btn32} px-2 border min-w-[36px] ${
              page === totalPages
                ? 'border-[#e0e0e0] text-[#333] opacity-40 cursor-not-allowed'
                : 'border-[#e0e0e0] text-[#333] hover:border-[#c1272d] hover:text-[#c1272d]'
            }`}
          >
            Next →
          </button>
        </nav>
      )}
    </main>
  );
}
