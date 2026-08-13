// 修行人著述 — practitioner metadata, keyed by slug.
// Intros are original and summary-style; no copyrighted text.
// Each field has a Chinese (zh) and English (en) counterpart.

export const PRACTITIONERS = [
  {
    slug: 'qingliangyue',
    name: '清凉月老师',
    nameEn: 'Master Qingliangyue',
    avatar: 'https://images.hostinger.com/b0ca89f0-89f1-437e-a994-678a3c33ae12.png',
    intro:
      '一位致力于禅修与止观教学的修行人，强调止观双运与日常觉照，教学平实而重实证。',
    introEn:
      'A practitioner devoted to teaching meditation and śamatha-vipaśyanā, emphasizing the union of stillness and insight together with everyday mindfulness — practical, grounded instruction focused on direct experience.',
    bio: '长期以止观为核心开展教学与答疑，主张在动中、静中都能保持觉知。内容整理侧重方法脉络、常见误区与日常落地，便于学人循序渐进地建立稳定的修习习惯。本站所载为其著述的概括性整理，非原文转载。',
    bioEn:
      'For many years the teaching has centered on śamatha-vipaśyanā, holding that awareness can be maintained whether in motion or in stillness. The compiled material focuses on the framework of method, common pitfalls, and everyday application, helping students build a stable practice step by step. What appears here is a summary arrangement of the writings, not a reproduction of original transcripts.',
    tagline: '止观 · 禅修 · 觉照',
    taglineEn: 'Stillness & Insight · Meditation · Mindfulness',
    links: [
      { label: '个人网站', labelEn: 'Personal Website', url: 'https://www.qingliangyue.com' },
      { label: '相关资源', labelEn: 'Related Resources', url: 'https://www.qingliangyue.com' },
    ],
  },
  {
    slug: 'yangning',
    name: '杨宁老师',
    nameEn: 'Master Yang Ning',
    avatar: 'https://images.hostinger.com/5996157b-7987-49f5-98e6-71ff3bde2125.png',
    intro:
      '长期讲授佛法与心性修养的修行人，注重经典研读与实修结合，引导学人认识心性本净。',
    introEn:
      'A practitioner who has long taught the Dharma and the cultivation of mind-nature, stressing the union of scripture study with practice, and guiding students to recognize the innate purity of mind.',
    bio: '教学上强调以经典为依、以实修为验，常从心性本净、烦恼与觉照等主题展开。本站收录的相关文章为原创概括，帮助读者把握主线思想与修学要点，便于对照日常体验继续深入。',
    bioEn:
      'The teaching emphasizes scripture as the ground and practice as the test, often unfolding through themes such as the innate purity of mind-nature and the relationship between afflictions and awareness. The articles collected here are original summaries that help readers grasp the main threads and key points of study, making it easier to deepen through comparison with their own experience.',
    tagline: '心性 · 经典 · 实修',
    taglineEn: 'Mind-Nature · Scripture · Practice',
    links: [
      { label: '相关介绍', labelEn: 'Related Introduction', url: 'https://www.baidu.com/s?wd=%E6%9D%A8%E5%AE%81%E8%80%81%E5%B8%88%20%E4%BD%9B%E6%B3%95' },
    ],
  },
];

export const PRACTITIONER_MAP = PRACTITIONERS.reduce((m, p) => {
  m[p.slug] = p;
  return m;
}, {});

export function getPractitioner(slug) {
  return PRACTITIONER_MAP[slug];
}

// Return a localized view of a practitioner for the given language.
export function localizePractitioner(p, lang) {
  if (!p) return p;
  const L = (zh, en) => (lang === 'en' ? (en || zh) : (zh || en));
  return {
    ...p,
    name: L(p.name, p.nameEn),
    intro: L(p.intro, p.introEn),
    bio: L(p.bio, p.bioEn),
    tagline: L(p.tagline, p.taglineEn),
    links: (p.links || []).map((l) => ({ ...l, label: L(l.label, l.labelEn) })),
  };
}
