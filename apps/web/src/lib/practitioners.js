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
      '融会贯通儒释道传统文化与现代科学，创立了"思维本体学"体系，致力于以科学化、可操作的方式指导实证修行与本源中医学习。',
    introEn:
      'Master Qingliangyue, real name Li Penggang, is a licensed traditional Chinese medicine practitioner, an awakened practitioner, and the founder of the Ontology of Thinking system.',
    bio: `<p>一、基础背景</p>
<ul>
<li><strong>出生信息</strong>：1970年出生于河南省南阳市，自幼对中华传统文化兴趣浓厚，尤其喜爱周易、气功相关内容。</li>
<li><strong>教育背景</strong>：毕业于河南中医药大学，在校期间跟随学校气功教研室老师专修气功，在实证层面达到较高层次。</li>
</ul>

<p>二、关键人生节点</p>
<ul>
<li><strong>2004年</strong>：此前长期研修道家理论，发现实证境界易退失的问题，接触佛法后取得根本突破，彻底解决该问题，实现儒释道核心原理的融会贯通。</li>
<li><strong>2011-2016年</strong>：在医院担任中医师，同时开展实证与现代科学结合的研究工作，陆续完成《思维现象基础研究》《科学实证》《西游解读》系列专著的撰写。</li>
<li><strong>2017年</strong>：从医院辞职，专职开展科学化实证教学工作，开设《实证理论》《禅修》《欲界定》三门网络课程，搭建配套助教团队。</li>
</ul>

<p>三、核心成果</p>
<ul>
<li>创立"思维本体学"体系，用现代科学语言重新诠释传统佛道修行内容，打破不同修行体系的壁垒，形成可重复操作的系统化实修方法。</li>
<li>教学前3年就取得近百人证入禅定、数百人证入欲界定的成果，推动传统实修内容去玄学化，向大众化、学科化方向普及。</li>
</ul>`,
    bioEn:
      `<p>I. Basic Background</p>
<ul>
<li><strong>Birth Information</strong>: Born in 1970 in Nanyang City, Henan Province. Showed strong interest in traditional Chinese culture from an early age, particularly in I Ching and qigong.</li>
<li><strong>Educational Background</strong>: Graduated from Henan University of Chinese Medicine, where he specialized in qigong under the school's qigong research faculty, achieving high levels in empirical practice.</li>
</ul>

<p>II. Key Life Milestones</p>
<ul>
<li><strong>2004</strong>: After long-term study of Daoist theory, discovered the problem of easily losing empirical states. Made a fundamental breakthrough after encountering Buddhism, completely solving this issue and achieving integration of core principles from Confucianism, Buddhism, and Daoism.</li>
<li><strong>2011-2016</strong>: Practiced as a TCM doctor in a hospital while conducting research combining empirical practice with modern science, completing the series of works "Fundamental Research on Thought Phenomena," "Scientific Empiricism," and "Journey to the West Interpretation."</li>
<li><strong>2017</strong>: Resigned from the hospital to focus on scientific empirical teaching, launching three online courses: "Empirical Theory," "Meditation," and "Desire Boundary Definition," with an accompanying teaching assistant team.</li>
</ul>

<p>III. Core Achievements</p>
<ul>
<li>Founded the "Ontology of Thinking" system, using modern scientific language to reinterpret traditional Buddhist and Daoist practice content, breaking barriers between different practice systems to form a repeatable, systematic approach to empirical practice.</li>
<li>Within the first three years of teaching, achieved the result of nearly 100 people attaining meditative absorption and hundreds attaining desire boundary definition, driving traditional empirical content toward de-mystification and popularization.</li>
</ul>`,
    tagline: '止观 · 禅修 · 觉照',
    taglineEn: 'Stillness & Insight · Meditation · Mindfulness',
    links: [
      { label: '个人网站', labelEn: 'Personal Website', url: 'http://mindontology.com/' },
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
    hidden: true,
  },
];

export const PRACTITIONER_MAP = PRACTITIONERS.reduce((m, p) => {
  m[p.slug] = p;
  return m;
}, {});

export function getPractitioner(slug) {
  return PRACTITIONER_MAP[slug];
}

// Return visible practitioners only
export function getVisiblePractitioners() {
  return PRACTITIONERS.filter(p => !p.hidden);
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
