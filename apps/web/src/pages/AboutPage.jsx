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
          '关于本站：整理修行理论与相关思想，收录修行人著述，并以个人博客记录学习札记与日常体悟。',
          'About this site: compiling cultivation theory and related thought, collecting practitioner writings, and recording personal study notes and everyday reflections in a blog.',
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
              'Spirit Root 是一个个人知识网站，旨在平实、清晰地整理修行理论与相关思想，并以开放的「修行人著述」专区收录各位修行人的文章。',
              'Spirit Root is a personal knowledge site that aims to compile cultivation theory and related thought plainly and clearly, and to collect the writings of practitioners in an open Practitioner Writings section.',
            )}
          </p>
          <p>
            {t(
              '网站的「修行人著述」专区收录修行人的文章，涵盖禅修止观、心性经典与平凡生活中的修行体悟；是个人认为比较有参考价值的资料，「个人博客」则记录我自己的学习札记、阅读笔记与日常点滴。',
              'The Practitioner Writings section collects articles by practitioners, covering meditation and insight, mind-nature and the classics, and the practice of ordinary life; the Personal Blog records my own study notes, reading notes, and everyday moments.',
            )}
          </p>
          <p>
            {t(
              '内容均为收集自公开网站和概括性整理，保留清晰的空白结构以便逐步充实，修行理论以概括性介绍为主，相关思想以阅读札记形式呈现，博客则为个人随笔。',
              'All content is an original summary arrangement, keeping a clear blank structure for gradual enrichment, and does not reproduce online articles or copyrighted original text. Cultivation theory is presented mainly as summary introductions, related thought as reading notes, and the blog as personal essays.',
            )}
          </p>
          <p>
            {t(
              '本站力求一个安静、朴素、可读的空间，既非娱乐站点，也不代表任何传承或权威教导，仅出于对修行理论与相关思想的好奇与尊重而作。',
              'This site strives to be a quiet, plain, readable space. It is not an entertainment site, nor does it represent any lineage or authoritative teaching — it is made simply out of curiosity and respect for cultivation theory and related thought.',
            )}
          </p>

          <p>
            {t(
              '所有文章仅供各位读者参考，本人不偏重任何修行法门，旨在集思广益。重要声明：请在有专业修行人指导下进行修炼，切勿盲修瞎练。',
              'All articles are for reference only. The author does not favor any particular practice tradition and aims to gather insights from various sources. Important: Please practice under the guidance of a qualified teacher and do not practice blindly.',
            )}
          </p>
        </div>
      </div>
    </Layout>
  );
}
