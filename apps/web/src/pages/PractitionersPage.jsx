import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';
import { Breadcrumb } from '@/components/bits';
import { PRACTITIONERS, localizePractitioner } from '@/lib/practitioners';
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

export default function PractitionersPage() {
  const { t, lang } = useLang();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';

  useEffect(() => {
    pb.collection('articles')
      .getFullList({
        filter: 'type = "wiki" && author != "" && status = "published"',
        sort: '-created',
      })
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return articles.filter((a) =>
      (a.title + (a.titleEn || '') + a.excerpt + (a.excerptEn || '') + a.tags + (a.tagsEn || '') + a.overview).toLowerCase().includes(needle),
    );
  }, [articles, q]);

  const practitioners = PRACTITIONERS.map((p) => localizePractitioner(p, lang));

  return (
    <Layout>
      <Helmet>
        <title>{t('修行人著述 — Spirit Root', 'Practitioner Writings — Spirit Root')}</title>
        <meta
          name="description"
          content={t(
            '修行人著述专区：收录修行人的文章合集，涵盖禅修、止观、心性与日常修行体悟，开放的修行人著述收录平台。',
            'Practitioner Writings: a collection of articles by practitioners covering meditation, śamatha-vipaśyanā, mind-nature, and everyday practice — an open platform for practitioner writings.',
          )}
        />
      </Helmet>

      {/* Compact header */}
      <div className="border-b bg-card/80 paper-texture">
        <div className="mx-auto max-w-[80rem] px-5 py-6 sm:py-8">
          <Breadcrumb items={[{ label: t('Home', 'Home'), to: '/' }, { label: t('修行人著述', 'Practitioner Writings') }]} />
          <div className="mt-3 max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              {t('修行人著述', 'Practitioner Writings')}
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              {t('修行人著述', 'Practitioner Writings')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t(
                '收录修行人的文章，涵盖禅修止观、心性经典与平凡生活中的修行体悟。这是一个开放的修行人著述收录平台，内容为原创概括性整理，逐步充实中。',
                'A collection of writings by practitioners, covering meditation and insight, mind-nature and the classics, and the practice of ordinary life. An open platform for practitioner writings — original summary content, gradually being enriched.',
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[80rem] px-5 py-7 sm:py-9">
        {q ? (
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {t(`搜索「`, `Search for "`)}<span className="text-jade">{q}</span>{t(`」的结果 · ${results.length} 条`, `" — ${results.length} result(s)`)}
              </p>
              <button type="button" onClick={() => setParams({})} className="text-xs text-jade hover:underline">
                {t('清除搜索', 'Clear search')}
              </button>
            </div>

            <div className="mt-3 flex max-w-lg items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm">
              <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                placeholder={t('搜索文章标题、摘要、标签…', 'Search titles, excerpts, tags…')}
                value={q}
                onChange={(e) => (e.target.value ? setParams({ q: e.target.value }) : setParams({}))}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-md border bg-card" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="mt-12 py-12 text-center">
                <span className="font-hei text-4xl text-muted-foreground/30">空</span>
                <p className="mt-3 text-muted-foreground">{t('未找到相关文章。', 'No matching articles found.')}</p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {results.map((a) => {
                  const p = PRACTITIONERS.find((x) => x.slug === a.author);
                  const lp = p ? localizePractitioner(p, lang) : null;
                  const title = lang === 'en' && a.titleEn ? a.titleEn : a.title;
                  const excerpt = lang === 'en' && a.excerptEn ? a.excerptEn : a.excerpt;
                  const tags = splitTags(lang === 'en' && a.tagsEn ? a.tagsEn : a.tags);
                  return (
                    <li key={a.id}>
                      <Link
                        to={`/wiki/${a.slug}`}
                        className="group block rounded-md border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {lp && <span className="text-jade">{lp.name}</span>}
                          {a.category && <span>· {lang === 'en' && a.categoryEn ? a.categoryEn : a.category}</span>}
                          {a.publishAt && <span>· {formatDate(a.publishAt, lang)}</span>}
                        </div>
                        <h3 className="mt-1.5 font-serif text-xl font-semibold group-hover:text-jade">
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
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          /* Single row of practitioner cards — no duplicate sections */
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-serif text-xl font-semibold sm:text-2xl">{t('修行人', 'Practitioners')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('已收录的修行人 · 点击卡片进入个人简介与文章列表', 'Featured practitioners · click a card for the profile and article list')}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
              {practitioners.map((p) => (
                <Link
                  key={p.slug}
                  to={`/wiki/author/${p.slug}`}
                  className="group flex flex-col items-center overflow-hidden rounded-lg border bg-card px-5 py-6 text-center transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md hover:shadow-black/5 sm:px-6 sm:py-7"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gold/40 bg-accent sm:h-24 sm:w-24">
                    <img
                      src={p.avatar}
                      alt={`${p.name} avatar`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold group-hover:text-jade sm:text-2xl">
                    {p.name}
                  </h3>
                  <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold">
                    {p.tagline}
                  </span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.intro}
                  </p>
                  <span className="mt-5 inline-block rounded-full bg-jade px-5 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition group-hover:opacity-90">
                    {t('查看文章 →', 'View articles →')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
