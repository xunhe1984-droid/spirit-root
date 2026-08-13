import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useDarkMode } from '@/lib/theme';
import { useLang } from '@/contexts/LanguageContext';

const NAV = [
  { to: '/', label: 'Home', labelZh: '首页' },
  { to: '/wiki', label: 'Writings', labelZh: '著述' },
  { to: '/blog', label: 'Blog', labelZh: '博客' },
  { to: '/about', label: 'About', labelZh: '关于' },
];

function Brand({ t }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold bg-jade text-[hsl(var(--primary-foreground))] font-hei text-lg leading-none">
        灵
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold tracking-wide">Spirit Root</span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {t('灵根 · 修行', 'Linggen · Cultivation')}
        </span>
      </span>
    </Link>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="flex items-center rounded-full border border-gold/50 bg-card p-0.5 text-[11px] font-medium"
      role="group"
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => setLang('zh')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'zh' ? 'bg-jade text-[hsl(var(--primary-foreground))]' : 'text-muted-foreground hover:text-jade'
        }`}
        aria-pressed={lang === 'zh'}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'en' ? 'bg-jade text-[hsl(var(--primary-foreground))]' : 'text-muted-foreground hover:text-jade'
        }`}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
    </div>
  );
}

export default function Layout({ children }) {
  const { dark, toggle } = useDarkMode();
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/wiki?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[80rem] items-center gap-4 px-5 py-3">
          <Brand t={t} />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors hover:text-jade ${
                    isActive ? 'text-jade font-medium' : 'text-foreground/80'
                  }`
                }
              >
                {lang === 'zh' ? n.labelZh : n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={submit} className="hidden sm:flex items-center rounded-full border bg-card px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('搜索著述...', 'Search writings...')}
                className="ml-2 w-28 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:w-40 transition-all"
              />
            </form>
            <LangToggle />
            <button onClick={toggle} aria-label="Toggle theme" className="rounded-full border p-2 hover:bg-accent">
              {dark ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
            </button>
            <button onClick={() => setOpen((o) => !o)} className="rounded-full border p-2 md:hidden" aria-label="Menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t md:hidden">
            <nav className="mx-auto flex max-w-[80rem] flex-col px-5 py-2">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm"
                >
                  {lang === 'zh' ? n.labelZh : n.label}
                </NavLink>
              ))}
              <form onSubmit={submit} className="mt-2 flex items-center rounded-md border bg-card px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('搜索...', 'Search...')} className="ml-2 flex-1 bg-transparent text-sm outline-none" />
              </form>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t bg-card/50">
        <div className="mx-auto grid max-w-[80rem] gap-8 px-5 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <Brand t={t} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t(
                '一个个人知识网站，整理修行理论与相关思想，收录修行人著述，并以博客记录学习札记与日常体悟。',
                'A personal knowledge site compiling cultivation theory and related thought, collecting the writings of practitioners, and recording study notes and everyday reflections in a blog.',
              )}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-jade">
              {t('探索', 'Explore')}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/wiki" className="hover:text-jade">{t('修行人著述', 'Practitioner Writings')}</Link></li>
              <li><Link to="/blog" className="hover:text-jade">{t('个人博客', 'Personal Blog')}</Link></li>
              <li><Link to="/about" className="hover:text-jade">{t('关于本站', 'About')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-jade">
              {t('收录方向', 'Collection')}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/wiki" className="hover:text-jade">{t('禅修止观', 'Meditation & Insight')}</Link></li>
              <li><Link to="/wiki" className="hover:text-jade">{t('心性经典', 'Mind-Nature & Classics')}</Link></li>
              <li><Link to="/wiki" className="hover:text-jade">{t('日常觉照', 'Everyday Mindfulness')}</Link></li>
              <li><Link to="/wiki" className="hover:text-jade">{t('修行随笔', 'Practice Notes')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Spirit Root · {t('一个个人文化项目。', 'A personal cultural project.')} ·{' '}
          <Link to="/admin" className="hover:text-jade">{t('编辑', 'Editor')}</Link>
        </div>
      </footer>
    </div>
  );
}
