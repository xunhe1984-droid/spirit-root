import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';

export function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-jade">{it.label}</Link>
          ) : (
            <span className="text-foreground/70">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Tag({ children, to }) {
  const cls =
    'inline-block rounded-full border border-gold/50 bg-accent/40 px-2.5 py-0.5 text-[11px] tracking-wide text-jade';
  return to ? <Link to={to} className={cls}>{children}</Link> : <span className={cls}>{children}</span>;
}

export function ArticleCard({ a }) {
  const { t } = useLang();
  const href = `/${a.type}/${a.slug}`;
  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-md border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
    >
      {a.cover && (
        <div className="aspect-[16/10] overflow-hidden">
          <img src={a.cover} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {a.category && <span className="mb-2 text-[11px] uppercase tracking-widest text-gold">{a.category}</span>}
        <h3 className="font-serif text-xl font-semibold leading-snug group-hover:text-jade">{a.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{a.excerpt}</p>
        <span className="mt-4 text-xs font-medium text-jade">{t('阅读全文 →', 'Read full article →')}</span>
      </div>
    </Link>
  );
}

export function SectionTitle({ kicker, title, center }) {
  return (
    <div className={center ? 'text-center' : ''}>
      {kicker && <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{kicker}</span>}
      <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{title}</h2>
    </div>
  );
}
