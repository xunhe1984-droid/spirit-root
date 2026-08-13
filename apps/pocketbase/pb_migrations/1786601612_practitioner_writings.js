/// <reference path="../pb_data/types.d.ts" />

// 修行人著述 — adds an `author` field to articles and seeds original,
// summary-style placeholder articles for three practitioners:
// 清凉月老师 (qingliangyue), 杨宁老师 (yangning), 豆腐块 (doufukuai).
// Existing article data is left untouched.

migrate(
  (app) => {
    const articles = app.findCollectionByNameOrId("articles");

    // 1. Add `author` text field (stores the practitioner slug) if missing.
    if (!articles.fields.getByName("author")) {
      articles.fields.add(new TextField({ name: "author", max: 100 }));
      app.save(articles);
    }

    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19) + ".000Z";

    // Original, summary-style intros with a clear blank article structure.
    // No copyrighted text is reproduced.
    const blankBody = (sections) =>
      sections
        .map(
          (s) =>
            `<h2>${s}</h2><p>（待补充：本节将围绕「${s}」展开原创概述与整理，内容由管理员逐步填充。）</p>`,
        )
        .join("");

    const stubs = [
      // ── 清凉月老师 ──
      {
        slug: "qingliangyue-zhiguan-intro",
        title: "止观双运的入门要点",
        author: "qingliangyue",
        category: "止观",
        tags: "止观,禅修,入门,清凉月",
        excerpt:
          "清凉月老师对止观双运的概括性介绍，强调止与观并行而非先后，是禅修入门的核心框架。",
        overview:
          "本文为清凉月老师关于止观双运的原创概述。止（奢摩他）令心安定，观（毗钵舍那）令心明了，二者双运是禅修入门的关键。文章以概括性语言梳理其教学要点，供读者建立基本认识。",
        body: blankBody([
          "止与观的含义",
          "为何强调双运",
          "入门练习次第",
          "常见误区",
          "延伸思考",
        ]),
        related: "qingliangyue-daily-awareness,qingliangyue-breath-mind",
      },
      {
        slug: "qingliangyue-daily-awareness",
        title: "日常生活中的觉照",
        author: "qingliangyue",
        category: "觉照",
        tags: "觉照,日常,正念,清凉月",
        excerpt:
          "如何在行住坐卧中保持觉照，是清凉月老师教学中最贴近生活的部分。",
        overview:
          "本文概述清凉月老师关于日常觉照的教导：修行不必局限于座上，行住坐卧皆可练习觉照。文章以概括性结构呈现其要点，留出空白章节待补充实例与体会。",
        body: blankBody([
          "什么是觉照",
          "座下与座上的衔接",
          "具体场景的练习",
          "容易中断的原因",
          "小结",
        ]),
        related: "qingliangyue-zhiguan-intro,qingliangyue-breath-mind",
      },
      {
        slug: "qingliangyue-breath-mind",
        title: "呼吸与心念的关联",
        author: "qingliangyue",
        category: "禅修",
        tags: "呼吸,心念,数息,清凉月",
        excerpt:
          "清凉月老师从呼吸入手讲解心念的调伏，指出呼吸是观察心的便捷窗口。",
        overview:
          "本文概括清凉月老师关于呼吸与心念关系的讲解：呼吸粗细反映心的状态，借由数息、随息可令心渐趋安定。文章以原创概述为主，保留空白结构以便后续整理。",
        body: blankBody([
          "呼吸作为观察窗口",
          "数息与随息",
          "粗细与深浅",
          "心息相依的体会",
          "注意事项",
        ]),
        related: "qingliangyue-zhiguan-intro,qingliangyue-daily-awareness",
      },

      // ── 杨宁老师 ──
      {
        slug: "yangning-nature-of-mind",
        title: "心性本净的含义",
        author: "yangning",
        category: "心性",
        tags: "心性,本净,佛性,杨宁",
        excerpt:
          "杨宁老师对「心性本净」的概括讲解，指出烦恼客尘并不改变心的本性。",
        overview:
          "本文概述杨宁老师关于心性本净的教导：心之本性本自清净，烦恼如客尘暂现而不染本体。文章以原创概括性语言呈现其教学要点，并保留空白章节待充实。",
        body: blankBody([
          "本净与客尘",
          "认识心性的途径",
          "理悟与证悟的差别",
          "常见疑问",
          "延伸阅读",
        ]),
        related: "yangning-scripture-practice,yangning-affliction-bodhi",
      },
      {
        slug: "yangning-scripture-practice",
        title: "经典研读与实修的结合",
        author: "yangning",
        category: "经典",
        tags: "经典,实修,教理,杨宁",
        excerpt:
          "杨宁老师强调读经须与实修相应，否则易停留在概念层面。",
        overview:
          "本文概括杨宁老师关于经典与实修结合的教导：经典是指月之指，研读须落于身心实证。文章以原创概述梳理其要点，留出空白结构以便补充具体经文与体会。",
        body: blankBody([
          "读经的目的",
          "概念与实证的差距",
          "如何以经印心",
          "选择适合的经典",
          "小结",
        ]),
        related: "yangning-nature-of-mind,yangning-affliction-bodhi",
      },
      {
        slug: "yangning-affliction-bodhi",
        title: "烦恼即菩提的理解",
        author: "yangning",
        category: "心性",
        tags: "烦恼,菩提,转依,杨宁",
        excerpt:
          "杨宁老师对「烦恼即菩提」的概括性解读，强调转而非断。",
        overview:
          "本文概述杨宁老师对「烦恼即菩提」的讲解：烦恼之性即菩提，关键在于觉与不觉，而非强行断除。文章以原创概括语言呈现，保留空白章节待整理实例。",
        body: blankBody([
          "烦恼与菩提的关系",
          "转烦恼为道用",
          "觉与不觉的分野",
          "实践中的体会",
          "延伸思考",
        ]),
        related: "yangning-nature-of-mind,yangning-scripture-practice",
      },

      // ── 豆腐块 ──
      {
        slug: "doufukuai-meditation-diary",
        title: "我的打坐日记",
        author: "doufukuai",
        category: "日记",
        tags: "打坐,日记,体悟,豆腐块",
        excerpt:
          "豆腐块以朴素文字记录日常打坐的点滴，风格平实亲切。",
        overview:
          "本文为豆腐块的打坐日记类文章，以原创概括性记录日常打坐的粗浅体会，不涉及具体传承教法。文章保留空白结构，待作者逐步补充真实记录。",
        body: blankBody([
          "缘起",
          "近期打坐的粗略情况",
          "一点小体会",
          "遇到的困难",
          "自勉",
        ]),
        related: "doufukuai-tofu-insight,doufukuai-ordinary-practice",
      },
      {
        slug: "doufukuai-tofu-insight",
        title: "一块豆腐的启示",
        author: "doufukuai",
        category: "随笔",
        tags: "豆腐,随笔,平凡,豆腐块",
        excerpt:
          "从一块朴素的豆腐中，豆腐块体会到修行应有的平实与无华。",
        overview:
          "本文为豆腐块的随笔，以一块豆腐为喻，抒发对平实修行的原创感悟。文章以概括性语言起笔，保留空白章节以便延展具体联想与体会。",
        body: blankBody([
          "豆腐的朴素",
          "由物及心的联想",
          "对修行的提醒",
          "一点自嘲",
          "结语",
        ]),
        related: "doufukuai-meditation-diary,doufukuai-ordinary-practice",
      },
      {
        slug: "doufukuai-ordinary-practice",
        title: "平凡日子里的修行",
        author: "doufukuai",
        category: "随笔",
        tags: "平凡,生活,在家人,豆腐块",
        excerpt:
          "豆腐块记录在家人如何在平凡生活中安顿身心、随缘修行。",
        overview:
          "本文概述豆腐块作为在家人于平凡生活中修行的体会：不必远求，于柴米油盐间亦可用心。文章以原创概括语言呈现，保留空白结构待补充生活片段。",
        body: blankBody([
          "在家修行的难处",
          "于日常中用心",
          "家庭与修行的平衡",
          "一点小小的坚持",
          "结语",
        ]),
        related: "doufukuai-meditation-diary,doufukuai-tofu-insight",
      },
    ];

    for (const item of stubs) {
      try {
        app.findFirstRecordByData("articles", "slug", item.slug);
        continue; // already exists
      } catch (_) {}

      const r = new Record(articles);
      r.set("type", "wiki");
      r.set("status", "published");
      r.set("publishAt", now);
      r.set("seoTitle", `${item.title} — 修行人著述 | Spirit Root`);
      r.set("metaDescription", item.excerpt);
      for (const k in item) r.set(k, item[k]);
      app.save(r);
    }
  },
  (app) => {
    const slugs = [
      "qingliangyue-zhiguan-intro",
      "qingliangyue-daily-awareness",
      "qingliangyue-breath-mind",
      "yangning-nature-of-mind",
      "yangning-scripture-practice",
      "yangning-affliction-bodhi",
      "doufukuai-meditation-diary",
      "doufukuai-tofu-insight",
      "doufukuai-ordinary-practice",
    ];
    for (const slug of slugs) {
      try {
        const r = app.findFirstRecordByData("articles", "slug", slug);
        app.delete(r);
      } catch (_) {}
    }
  },
);
