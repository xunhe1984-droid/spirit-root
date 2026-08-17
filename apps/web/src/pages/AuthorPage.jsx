import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';
import { Breadcrumb } from '@/components/bits';
import { getPractitioner, PRACTITIONERS, localizePractitioner } from '@/lib/practitioners';
import { useLang } from '@/contexts/LanguageContext';
import { splitTags } from '@/lib/articleI18n';

function formatDate(d, lang) {
  if (!d) return '';
  return new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AuthorPage() {
  const { authorSlug } = useParams();
  const location = useLocation();
  const { t, lang } = useLang();
  const rawPractitioner = getPractitioner(authorSlug);
  const practitioner = rawPractitioner ? localizePractitioner(rawPractitioner, lang) : null;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';

  useEffect(() => {
    if (!authorSlug) return;
    let active = true;
    setLoading(true);
    pb.collection('articles')
      .getFullList({
        filter: `type = "wiki" && author = "${authorSlug}" && status = "published"`,
        sort: '-created',
        requestKey: `author-articles-${authorSlug}`,
      })
      .then((items) => {
        if (active) setArticles(items);
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
  }, [authorSlug]);

  const filtered = useMemo(() => {
    if (!q) return articles;
    const needle = q.toLowerCase();
    return articles.filter((a) =>
      (a.title + (a.titleEn || '') + a.excerpt + (a.excerptEn || '') + a.tags + (a.tagsEn || '') + a.overview).toLowerCase().includes(needle),
    );
  }, [articles, q]);

  const [crossArticles, setCrossArticles] = useState([]);

  useEffect(() => {
    if (!authorSlug) return;
    let active = true;
    const otherSlugs = PRACTITIONERS.filter((p) => p.slug !== authorSlug && !p.hidden).map((p) => p.slug);
    if (!otherSlugs.length) return;
    const filter = otherSlugs.map((s) => `author = "${s}"`).join(' || ');
    pb.collection('articles')
      .getList(1, 4, {
        filter: `type = "wiki" && status = "published" && (${filter})`,
        sort: '-created',
        requestKey: `author-cross-${authorSlug}`,
      })
      .then((res) => {
        if (active) setCrossArticles(res.items);
      })
      .catch(() => {
        if (active) setCrossArticles([]);
      });
    return () => {
      active = false;
    };
  }, [authorSlug]);

  if (!practitioner) {
    return (
      <Layout>
        <div className="mx-auto max-w-[52rem] px-5 py-20 text-center">
          <h1 className="font-serif text-4xl font-semibold">{t('未找到该修行人', 'Practitioner not found')}</h1>
          <p className="mt-4 text-muted-foreground">{t('该作者不存在或尚未收录。', 'This author does not exist or has not been collected yet.')}</p>
          <Link to="/wiki" className="mt-6 inline-block text-jade hover:underline">
            ← {t('返回修行人著述', 'Back to Practitioner Writings')}
          </Link>
        </div>
      </Layout>
    );
  }

  const links = practitioner.links || [];

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href={`https://spiritroot.online${location.pathname}`} />
        <title>{practitioner.name} — {t('修行人著述', 'Practitioner Writings')} | Spirit Root</title>
        <meta
          name="description"
          content={`${practitioner.name} — ${practitioner.intro}`}
        />
      </Helmet>

      {/* Compact breadcrumb bar */}
      <div className="border-b bg-card/60">
        <div className="mx-auto max-w-[80rem] px-5 py-4">
          <Breadcrumb
            items={[
              { label: t('Home', 'Home'), to: '/' },
              { label: t('修行人著述', 'Practitioner Writings'), to: '/wiki' },
              { label: practitioner.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[80rem] px-5 py-7 sm:py-9">
        {/* Independent profile block */}
        <section className="rounded-lg border bg-card p-5 sm:p-7 paper-texture">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
            <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold/40 bg-accent sm:mx-0 sm:h-32 sm:w-32">
              <img
                src={practitioner.avatar}
                alt={`${practitioner.name} avatar`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {practitioner.tagline}
              </span>
              <h1 className="mt-1.5 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                {practitioner.name}
              </h1>

              <div className="mt-4 space-y-3 text-left">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-jade">{t('人物简介', 'Profile')}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {practitioner.intro}
                  </p>
                </div>
                {practitioner.bio && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-jade">{t('生平介绍', 'Biography')}</h2>
                    <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground prose-ink" dangerouslySetInnerHTML={{ __html: practitioner.bio }} />
                  </div>
                )}
              </div>

              {links.length > 0 && (
                <div className="mt-5 border-t border-border/80 pt-4 text-left">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-jade">{t('友情链接', 'Links')}</h2>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {links.map((l) => (
                      <li key={l.url + l.label}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-accent/40 px-3 py-1.5 text-xs font-medium text-jade transition hover:bg-accent"
                        >
                          {l.label}
                          <ExternalLink className="h-3 w-3 opacity-70" strokeWidth={1.75} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Articles */}
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">{t('文章列表', 'Articles')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading ? t('加载中…', 'Loading…') : t(`共 ${filtered.length} 篇`, `${filtered.length} article(s)`)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex max-w-lg items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm">
            <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              placeholder={t(`搜索 ${practitioner.name} 的文章…`, `Search ${practitioner.name}'s articles…`)}
              value={q}
              onChange={(e) => (e.target.value ? setParams({ q: e.target.value }) : setParams({}))}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button type="button" onClick={() => setParams({})} className="text-xs text-jade hover:underline">
                {t('清除', 'Clear')}
              </button>
            )}
          </div>

          {q && (
            <p className="mt-3 text-sm text-muted-foreground">
              {t(`搜索「`, `Search for "`)}<span className="text-jade">{q}</span>{t(`」· ${filtered.length} 条`, `" — ${filtered.length} result(s)`)}
            </p>
          )}

          {loading ? (
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-md border bg-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 py-12 text-center">
              <span className="font-hei text-4xl text-muted-foreground/30">空</span>
              <p className="mt-3 text-muted-foreground">
                {q ? t('未找到相关文章。', 'No matching articles found.') : t('该修行人暂无文章。', 'No articles from this practitioner yet.')}
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {filtered.map((a) => {
                const title = lang === 'en' && a.titleEn ? a.titleEn : a.title;
                const excerpt = lang === 'en' && a.excerptEn ? a.excerptEn : a.excerpt;
                const category = lang === 'en' && a.categoryEn ? a.categoryEn : a.category;
                const tags = splitTags(lang === 'en' && a.tagsEn ? a.tagsEn : a.tags);
                return (
                  <li key={a.id}>
                    <Link
                      to={`/wiki/${a.slug}`}
                      className="group block rounded-md border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {category && (
                          <span className="uppercase tracking-widest text-gold">{category}</span>
                        )}
                        {a.publishAt && <span>· {formatDate(a.publishAt, lang)}</span>}
                      </div>
                      <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug group-hover:text-jade">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {excerpt}
                      </p>
                      {tags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gold/40 bg-accent/40 px-2 py-0.5 text-[11px] text-jade"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="mt-3 inline-block text-xs font-medium text-jade">
                        {t('阅读全文 →', 'Read full article →')}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {crossArticles.length > 0 && (
          <div className="mt-12 border-t pt-7">
            <h2 className="font-serif text-xl font-semibold sm:text-2xl">{t('相关文章推荐', 'Related Articles')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('来自其他修行人的文章', 'From other practitioners')}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {crossArticles.map((a) => {
                const p = PRACTITIONERS.find((x) => x.slug === a.author);
                const lp = p ? localizePractitioner(p, lang) : null;
                const title = lang === 'en' && a.titleEn ? a.titleEn : a.title;
                const excerpt = lang === 'en' && a.excerptEn ? a.excerptEn : a.excerpt;
                return (
                  <li key={a.id}>
                    <Link
                      to={`/wiki/${a.slug}`}
                      className="group flex flex-col rounded-md border bg-card p-4 hover:border-gold"
                    >
                      <span className="text-[11px] text-jade">{lp?.name}</span>
                      <span className="mt-1 font-serif text-lg font-semibold group-hover:text-jade">
                        {title}
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {excerpt}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
