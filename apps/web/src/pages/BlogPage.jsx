import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { Breadcrumb, SectionTitle } from '@/components/bits';
import { useLang } from '@/contexts/LanguageContext';
import { splitTags } from '@/lib/articleI18n';

const CATEGORIES = [
  { zh: '全部', en: 'All' },
  { zh: '仙侠文化', en: 'Xianxia Culture' },
  { zh: '中国哲学', en: 'Chinese Philosophy' },
  { zh: '禅修实践', en: 'Meditation Practice' },
  { zh: '道家', en: 'Daoism' },
  { zh: '佛家', en: 'Buddhism' },
  { zh: '个人札记', en: 'Personal Notes' },
];

// Map of English category labels to the stored category values used in the DB.
// The DB stores the English category string for blog articles.
const CAT_VALUES = [
  'All', 'Xianxia Culture', 'Chinese Philosophy', 'Meditation Practice',
  'Daoism', 'Buddhism', 'Personal Notes',
];

function formatDate(d, lang) {
  if (!d) return '';
  return new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const { t, lang } = useLang();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catIdx, setCatIdx] = useState(0);

  useEffect(() => {
    pb.collection('articles')
      .getFullList({ filter: 'type = "blog" && status = "published"', sort: '-created' })
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const catValue = CAT_VALUES[catIdx];
  const filtered = useMemo(
    () => articles.filter((a) => catValue === 'All' || a.category === catValue),
    [articles, catValue],
  );

  return (
    <Layout>
      <Seo
        title={t('Blog — Spirit Root', 'Blog — Spirit Root')}
        description={t(
          '个人博客：关于修行理论、相关思想与日常体悟的随笔与记录。',
          'Personal blog: essays and notes on cultivation theory, related thought, and everyday reflections.',
        )}
      />
      <div className="mx-auto max-w-[80rem] px-5 py-12">
        <Breadcrumb items={[{ label: t('Home', 'Home'), to: '/' }, { label: 'Blog' }]} />
        <div className="mt-4">
          <SectionTitle kicker={t('Reflections', 'Reflections')} title={t('个人博客', 'Personal Blog')} />
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {t(
              '这里记录我对修行理论的学习与思考、相关思想的阅读札记，以及日常生活中的点滴体悟。内容为个人随笔，不代表任何传承或权威教导。',
              'Here I record my study and reflection on cultivation theory, reading notes on related thought, and small everyday insights. The content consists of personal essays and does not represent any lineage or authoritative teaching.',
            )}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => setCatIdx(i)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                catIdx === i ? 'border-gold bg-jade text-[hsl(var(--primary-foreground))]' : 'hover:bg-accent'
              }`}
            >
              {lang === 'zh' ? c.zh : c.en}
            </button>
          ))}
        </div>

        {/* Article list — vertical */}
        {loading ? (
          <div className="mt-10 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-md border bg-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">{t('暂无文章。', 'No articles yet.')}</p>
        ) : (
          <ul className="mt-10 space-y-5">
            {filtered.map((a) => {
              const title = lang === 'en' && a.titleEn ? a.titleEn : a.title;
              const excerpt = lang === 'en' && a.excerptEn ? a.excerptEn : a.excerpt;
              const category = lang === 'en' && a.categoryEn ? a.categoryEn : a.category;
              const tags = splitTags(lang === 'en' && a.tagsEn ? a.tagsEn : a.tags);
              return (
                <li key={a.id}>
                  <Link
                    to={`/blog/${a.slug}`}
                    className="group block rounded-md border bg-card p-6 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {category && <span className="uppercase tracking-widest text-gold">{category}</span>}
                      {a.publishAt && <span>· {formatDate(a.publishAt, lang)}</span>}
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-semibold leading-snug group-hover:text-jade">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {excerpt}
                    </p>
                    {/* Tags — horizontal */}
                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
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
                    <span className="mt-4 inline-block text-xs font-medium text-jade">
                      {t('阅读全文 →', 'Read full article →')}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
}
