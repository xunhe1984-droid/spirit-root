import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Feather, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { SectionTitle } from '@/components/bits';
import { useLang } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t, lang } = useLang();

  const FEATURES = [
    {
      icon: Sparkles,
      title: t('修行人著述', 'Practitioner Writings'),
      items: lang === 'zh'
        ? ['禅修止观', '心性经典', '日常觉照', '修行随笔']
        : ['Meditation & Insight', 'Mind-Nature & Classics', 'Everyday Mindfulness', 'Practice Notes'],
      to: '/wiki',
    },
    {
      icon: BookOpen,
      title: t('修行理论与相关思想', 'Cultivation Theory & Related Thought'),
      items: lang === 'zh'
        ? ['禅修止观', '心性本净', '经典与实修', '日常觉照']
        : ['Meditation & Insight', 'Innate Purity of Mind', 'Classics & Practice', 'Everyday Mindfulness'],
      to: '/wiki',
    },
    {
      icon: Feather,
      title: t('个人博客', 'Personal Blog'),
      items: lang === 'zh'
        ? ['修行理论学习札记', '相关思想阅读笔记', '日常体悟随笔', '平凡生活中的修行']
        : ['Study notes on cultivation theory', 'Reading notes on related thought', 'Everyday reflections', 'Practice in ordinary life'],
      to: '/blog',
    },
  ];

  return (
    <Layout>
      <Seo />
      {/* Hero */}
      <section className="relative min-h-[92dvh] overflow-hidden">
        <img
          src="https://images.hostinger.com/4706bfbe-2b15-4959-b4c3-154ee726fa1b.png"
          alt="Ink wash mountains"
          className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="relative mx-auto flex min-h-[92dvh] max-w-[70rem] flex-col items-center justify-center px-5 py-24 text-center">
          <span className="animate-fade-up font-hei text-5xl text-jade sm:text-6xl">灵根</span>
          <h1 className="animate-fade-up mt-4 font-serif text-6xl font-bold tracking-tight sm:text-8xl" style={{ animationDelay: '0.1s' }}>
            Spirit Root
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl font-serif text-xl italic text-jade sm:text-2xl" style={{ animationDelay: '0.2s' }}>
            {t('修行理论 · 相关思想 · 个人博客', 'Cultivation Theory · Related Thought · Personal Blog')}
          </p>
          <p className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground" style={{ animationDelay: '0.3s' }}>
            {t(
              '一个个人知识网站，整理修行理论与相关思想，收录修行人的著述，并以博客记录个人的学习札记与日常体悟。',
              'A personal knowledge site compiling cultivation theory and related thought, collecting the writings of practitioners, and recording personal study notes and everyday reflections in a blog.',
            )}
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.4s' }}>
            <Link to="/wiki" className="rounded-full bg-jade px-7 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition hover:opacity-90">
              {t('修行人著述', 'Practitioner Writings')}
            </Link>
            <Link to="/blog" className="rounded-full border border-gold px-7 py-3 text-sm font-medium text-jade transition hover:bg-accent">
              {t('阅读博客', 'Read the Blog')}
            </Link>
          </div>
        </div>
      </section>

      {/* What is Spirit Root */}
      <section className="mx-auto max-w-[56rem] px-5 py-24 text-center">
        <SectionTitle kicker={t('灵根 · The Foundation', 'Linggen · The Foundation')} title={t('关于本站', 'About')} center />
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t(
            '本站整理修行理论与相关思想，收录修行人的著述，并以个人博客记录学习札记与日常体悟。内容为原创概括性整理，逐步充实中，力求平实、清晰、可读。',
            'This site compiles cultivation theory and related thought, collects the writings of practitioners, and records personal study notes and everyday reflections in a blog. The content is an original summary arrangement, gradually enriched, striving to be plain, clear, and readable.',
          )}
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-gold" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[80rem] px-5 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-8">
              <f.icon className="h-8 w-8 text-jade" strokeWidth={1.25} />
              <h3 className="mt-4 font-serif text-2xl font-semibold">{f.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {f.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gold" /> {i}
                  </li>
                ))}
              </ul>
              <Link to={f.to} className="mt-6 inline-block text-sm font-medium text-jade hover:underline">
                {t('探索 →', 'Explore →')}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
