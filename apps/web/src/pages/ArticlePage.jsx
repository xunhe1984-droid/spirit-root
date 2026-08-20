import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import Comments from '@/components/Comments';
import { Breadcrumb, Tag } from '@/components/bits';
import { getPractitioner, localizePractitioner } from '@/lib/practitioners';
import { useLang } from '@/contexts/LanguageContext';
import { splitTags } from '@/lib/articleI18n';

export default function ArticlePage({ type }) {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    setState('loading');
    pb.collection('articles')
      .getFirstListItem(`slug = "${slug}"`)
      .then(async (a) => {
        if (!active) return;
        setArticle(a);
        setState('ready');
        const slugs = (a.related || '').split(',').map((s) => s.trim()).filter(Boolean);
        if (slugs.length) {
          const filter = slugs.map((s) => `slug = "${s}"`).join(' || ');
          try {
            const rel = await pb.collection('articles').getFullList({ filter });
            if (active) setRelated(rel);
          } catch { /* ignore */ }
        } else {
          setRelated([]);
        }
      })
      .catch(() => active && setState('notfound'));
    return () => { active = false; };
  }, [slug]);

  if (state === 'loading') {
    return (
      <Layout>
        <div className="mx-auto max-w-[52rem] px-5 py-16">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-64 animate-pulse rounded bg-muted" />
        </div>
      </Layout>
    );
  }

  if (state === 'notfound' || !article) {
    return (
      <Layout>
        <div className="mx-auto max-w-[52rem] px-5 py-24 text-center">
          <h1 className="font-serif text-4xl font-semibold">{t('文章未找到', 'Article not found')}</h1>
          <p className="mt-4 text-muted-foreground">{t('此页面可能已移动或尚未发布。', 'This page may have moved or does not exist yet.')}</p>
          <Link to={`/${type}`} className="mt-6 inline-block text-jade hover:underline">← {t('返回', 'Back to')} {type}</Link>
        </div>
      </Layout>
    );
  }

  const isWiki = article.type === 'wiki';
  const rawPractitioner = isWiki && article.author ? getPractitioner(article.author) : null;
  const practitioner = rawPractitioner ? localizePractitioner(rawPractitioner, lang) : null;

  const title = lang === 'en' && article.titleEn ? article.titleEn : article.title;
  const excerpt = lang === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
  const overview = lang === 'en' && article.overviewEn ? article.overviewEn : article.overview;
  const body = lang === 'en' && article.bodyEn ? article.bodyEn : article.body;
  const category = lang === 'en' && article.categoryEn ? article.categoryEn : article.category;
  const tags = splitTags(lang === 'en' && article.tagsEn ? article.tagsEn : article.tags);

  const crumbs = [
    { label: t('Home', 'Home'), to: '/' },
    isWiki
      ? { label: t('修行人著述', 'Practitioner Writings'), to: '/wiki' }
      : { label: 'Blog', to: '/blog' },
  ];
  if (practitioner) {
    crumbs.push({ label: practitioner.name, to: `/wiki/author/${practitioner.slug}` });
  }
  crumbs.push({ label: title });

  const seoTitle = lang === 'en' && article.titleEn
    ? `${article.titleEn} — Practitioner Writings | Spirit Root`
    : (article.seoTitle || `${article.title} — Spirit Root`);
  const seoDesc = lang === 'en' && article.excerptEn ? article.excerptEn : (article.metaDescription || excerpt);

  return (
    <Layout>
      <Seo
        title={seoTitle}
        description={seoDesc}
        image={article.ogImage || article.cover}
        type="article"
      />
      <article className="mx-auto max-w-[52rem] px-5 py-12">
        <Breadcrumb items={crumbs} />

        {category && <span className="mt-6 block text-xs uppercase tracking-widest text-gold">{category}</span>}
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {article.publishAt && (
          <p className="mt-3 text-sm text-muted-foreground">
            {new Date(article.publishAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        {practitioner && (
          <p className="mt-2 text-sm text-jade">
            {t('作者：', 'Author: ')}<Link to={`/wiki/author/${practitioner.slug}`} className="hover:underline">{practitioner.name}</Link>
          </p>
        )}

        {article.cover && (
          <img src={article.cover} alt={title} className="mt-8 aspect-[16/9] w-full rounded-md object-cover" />
        )}

        {overview && (
          <div className="mt-8 rounded-md border-l-2 border-gold bg-accent/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-jade">{t('概述', 'Overview')}</h2>
            <p className="mt-2 leading-relaxed">{overview}</p>
          </div>
        )}

        {body && (
          <div className="prose-ink mt-8 max-w-none text-[1.05rem]" dangerouslySetInnerHTML={{ __html: body }} />
        )}

        {article.historical && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-semibold">{t('历史背景', 'Historical Background')}</h2>
            <div className="prose-ink mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: article.historical }} />
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}

        <Comments articleId={article.slug} />

        {related.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="font-serif text-2xl font-semibold">{t('相关文章推荐', 'Related Articles')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => {
                const rTitle = lang === 'en' && r.titleEn ? r.titleEn : r.title;
                const rExcerpt = lang === 'en' && r.excerptEn ? r.excerptEn : r.excerpt;
                return (
                  <li key={r.id}>
                    <Link to={`/${r.type}/${r.slug}`} className="flex flex-col rounded-md border bg-card p-4 hover:border-gold">
                      <span className="font-serif text-lg font-semibold text-jade">{rTitle}</span>
                      <span className="mt-1 text-sm text-muted-foreground line-clamp-2">{rExcerpt}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </article>
    </Layout>
  );
}
