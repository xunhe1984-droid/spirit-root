import React from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { Breadcrumb, SectionTitle } from '@/components/bits';
import { useLang } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLang();
  return (
    <Layout>
      <Seo
        title={t('关于 — Spirit Root', 'About — Spirit Root')}
        description={t(
          '关于 Spirit Root：整理修行理论与相关思想，收录修行人著述，记录学习札记与体悟。',
          'About Spirit Root: Compiling cultivation theory and related thought, collecting practitioner writings, and recording study notes and reflections.',
        )}
      />
      <div className="mx-auto max-w-[52rem] px-5 py-12">
        <Breadcrumb items={[{ label: t('Home', 'Home'), to: '/' }, { label: t('关于', 'About') }]} />
        <div className="mt-4">
          <SectionTitle kicker="灵根" title={t('关于 Spirit Root', 'About Spirit Root')} />
        </div>
        <img
          src="https://images.hostinger.com/4087246a-2032-4fd3-8a66-7b61c27152ae.png"
          alt={t('云雾中的山寺', 'Mountain temple in the mist')}
          className="mt-8 aspect-[16/9] w-full rounded-md object-cover"
        />
        <div className="prose-ink mt-8 space-y-5 text-[1.05rem] leading-relaxed text-foreground/90">
          <p>
            {t(
              'Spirit Root 是一个关于传统实修与心性理论的个人知识网站，旨在平实、清晰地梳理各门派的实证脉络与核心思想。',
              'Spirit Root is a personal knowledge hub dedicated to traditional cultivation and mind-nature theories, aiming to present empirical paths and core insights plainly and clearly.',
            )}
          </p>
          <p>
            {t(
              '「修行人著述」专区汇集具有实证参考价值的修行人文章，涵盖禅修止观、心性发微与日常觉照；「个人博客」则用于记录个人的研读札记与实修心得。',
              'The "Practitioner Writings" section curates valuable empirical articles covering meditation, insight practice, and daily mindfulness; the "Personal Blog" records personal study notes and reflections.',
            )}
          </p>
          <p>
            {t(
              '本站内容均采自公开资料并做系统性归纳，力求营造一个朴素、严谨的阅读空间。本站不代表任何宗派传承，亦无权威背书。',
              'All content is systematically organized from public sources to provide a quiet, rigorous reading space. The site does not represent any specific lineage or authority.',
            )}
          </p>
          <p className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
            {t(
              '声明：所有内容仅供研讨参考，不偏立宗派。实修精深细微，请在明师指导下循序渐进，切勿盲修瞎练。',
              'Disclaimer: All content is for study and reference only. Practice requires careful discernment; please study progressively under qualified guidance and avoid blind practice.',
            )}
          </p>
        </div>
      </div>
    </Layout>
  );
}
