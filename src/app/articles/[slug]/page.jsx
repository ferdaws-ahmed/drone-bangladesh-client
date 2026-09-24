import Link from 'next/link';
import Image from 'next/image';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_ROOT = /\/api\/?$/.test(API_BASE) ? API_BASE.replace(/\/api\/?$/, '') : API_BASE;
const buildApiUrl = (path) => `${API_ROOT}/api/${path.replace(/^\/+/, '')}`;

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));

async function getArticle(slug) {
  try {
    const response = await fetch(buildApiUrl(`/client/articles/${encodeURIComponent(slug)}`), {
      cache: 'no-store',
    });
    const payload = await response.json();
    return payload.success ? payload.data : null;
  } catch (err) {
    console.error('Failed to fetch article:', err);
    return null;
  }
}

async function getRelatedArticles(currentArticle) {
  try {
    const params = new URLSearchParams({ limit: '6' });
    if (currentArticle?.category) params.set('category', currentArticle.category);
    const response = await fetch(buildApiUrl(`/client/articles?${params.toString()}`), {
      cache: 'no-store',
    });
    const payload = await response.json();
    const items = payload.success ? payload.data?.items || [] : [];
    return items.filter((a) => a._id !== currentArticle?._id).slice(0, 4);
  } catch (err) {
    console.error('Failed to fetch related articles:', err);
    return [];
  }
}

export default async function ArticleDetailsPage({ params }) {
  const slug = (await params).slug;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#222] mb-2">Article not found</h1>
        <p className="text-sm text-gray-500 mb-5">
          The article you are looking for may have been moved or does not exist.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#c1272d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a91f25] transition"
        >
          ← Back to Articles
        </Link>
      </main>
    );
  }

  const related = await getRelatedArticles(article);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription || article.excerpt || '',
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Organization',
      name: article.author || 'Drone Bangladesh',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Drone Bangladesh',
    },
    keywords: (article.tags || []).join(', '),
    articleSection: article.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
    },
  };

  const authorInitial = (article.author || 'DB').charAt(0).toUpperCase();
  const isUpdated =
    article.updatedAt &&
    new Date(article.updatedAt).getTime() - new Date(article.createdAt).getTime() > 1000 * 60 * 5;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <div className="mb-6">
              <Link
                href="/articles"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#c1272d] hover:underline"
              >
                <span aria-hidden="true">←</span> Back to Articles
              </Link>
            </div>

            <header className="mb-8">
              {article.category && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                  className="inline-block rounded-full bg-[#fef0f0] px-3 py-1 text-[#c1272d] mb-4"
                >
                  {article.category}
                </span>
              )}

              <h1
                style={{
                  fontSize: '34px',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: '#111',
                  marginBottom: '20px',
                }}
                className="sm:text-4xl"
              >
                {article.title}
              </h1>

              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-5 border-b border-gray-100"
                style={{ fontSize: '13px' }}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c1272d] to-[#e84e54] flex items-center justify-center text-white text-xs font-bold"
                  >
                    {authorInitial}
                  </span>
                  <span className="font-semibold text-[#333]">
                    {article.author || 'Drone Bangladesh'}
                  </span>
                </span>
                <span className="text-gray-300">•</span>
                <time dateTime={article.createdAt} className="text-gray-500">
                  {formatDate(article.createdAt)}
                </time>
                {isUpdated && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 italic">Updated {formatDate(article.updatedAt)}</span>
                  </>
                )}
              </div>
            </header>

            {article.imageUrl && (
              <div
                className="mb-8 overflow-hidden rounded-lg border border-[#e0e0e0] bg-gray-50 shadow-sm"
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {article.excerpt && (
              <div
                className="mb-8 rounded-lg border-l-4 bg-[#fef8f8] px-5 py-4"
                style={{ borderLeftColor: '#c1272d' }}
              >
                <p
                  style={{
                    fontSize: '17px',
                    lineHeight: 1.7,
                    color: '#444',
                  }}
                  className="italic font-medium"
                >
                  {article.excerpt}
                </p>
              </div>
            )}

            <div
              className="mb-10"
              style={{
                fontSize: '15px',
                lineHeight: 1.85,
                color: '#333',
              }}
            >
              <div className="whitespace-pre-wrap space-y-4">{article.content}</div>
            </div>

            {article.tags?.length > 0 && (
              <div className="mb-8 pt-6 border-t border-gray-100">
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                  className="text-gray-500 mb-3"
                >
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href="/articles"
                      className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-[#c1272d] hover:bg-[#fef0f0] hover:text-[#c1272d] transition"
                    >
                      <span className="text-[#c1272d]">#</span>
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-5 flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-[#c1272d] to-[#e84e54] flex items-center justify-center text-white text-base font-bold">
                {authorInitial}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#222] text-sm">
                  {article.author || 'Drone Bangladesh'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Editorial Team</p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Bangladesh&apos;s trusted source for drone news, buying advice, product reviews and tutorials.
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-4 self-start">
            {article.metaDescription && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                  className="text-gray-400 mb-2"
                >
                  About this article
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: '#555',
                  }}
                >
                  {article.metaDescription}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-[#fef0f0] to-white p-5 shadow-sm">
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#111',
                  marginBottom: '6px',
                }}
              >
                Stay Updated
              </h3>
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: '#666',
                  marginBottom: '14px',
                }}
              >
                Get new drone reviews, deals and guides delivered to your inbox.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#c1272d] focus:ring-1 focus:ring-[#c1272d]/30"
                />
                <button
                  type="button"
                  className="w-full rounded-md bg-[#c1272d] px-3 py-2 text-xs font-semibold text-white hover:bg-[#a91f25] transition"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div
                  className="px-4 py-3 border-b border-gray-100 bg-gray-50"
                >
                  <h3
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#222',
                    }}
                  >
                    Related Articles
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {related.map((r) => (
                    <Link
                      key={r._id}
                      href={`/articles/${r.slug}`}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 transition group"
                    >
                      <div className="h-14 w-14 shrink-0 rounded-md overflow-hidden bg-gray-100 relative">
                        {r.imageUrl ? (
                          <Image
                            src={r.imageUrl}
                            alt={r.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
                            DB
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {r.category && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              color: '#c1272d',
                            }}
                          >
                            {r.category}
                          </span>
                        )}
                        <h4
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: 1.45,
                            color: '#333',
                          }}
                          className="line-clamp-2 group-hover:text-[#c1272d] transition mt-0.5"
                        >
                          {r.title}
                        </h4>
                        <p
                          className="mt-1"
                          style={{
                            fontSize: '10px',
                            color: '#888',
                          }}
                        >
                          {formatDate(r.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
