/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const articles = app.findCollectionByNameOrId("articles");
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + ".000Z";

    const stubs = [
      // 人物
      {
        slug: "han-li", title: "韩立", category: "人物", tags: "主角,韩立,平凡弟子,大乘期",
        excerpt: "《凡人修仙传》男主角，出身平凡却凭借坚韧毅力与机缘一步步登顶修仙巅峰。",
        overview: "韩立（Han Li）是《凡人修仙传》的主人公。他出身平民，自幼入黄枫谷，以平凡灵根走上漫长修仙之路，历经数百年终成大乘修士。其成道之路以稳健著称，从不依赖天才资质，而靠积累、谋略与无数机缘。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p><p>建议包含：早期经历、修炼历程、重要战役、性格特征、重要法宝与功法等章节。</p>",
        related: "wan-meng, cultivation-realms-fanren, qingyuan-sword-art",
      },
      {
        slug: "nan-gong-wan", title: "南宫婉", category: "人物", tags: "女主角,南宫婉,元婴期,韩立",
        excerpt: "韩立在人界的道侣，修为高洁，与韩立共历艰辛。",
        overview: "南宫婉是韩立在人界结识的挚友与道侣，曾被封于结界之中，后被韩立救出。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      {
        slug: "fairy-violet-spirit", title: "紫灵仙子", category: "人物", tags: "仙界,紫灵,韩立",
        excerpt: "仙界重要人物，与韩立在仙界有深厚渊源。",
        overview: "紫灵仙子是《凡人修仙传》仙界篇的重要角色。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      // 境界体系
      {
        slug: "cultivation-realms-fanren", title: "修仙境界体系", category: "境界体系", tags: "境界,炼气,筑基,金丹,元婴,化神,合体,大乘,渡劫",
        excerpt: "《凡人修仙传》中完整的修炼境界划分，从炼气期到大乘期乃至仙界的详细说明。",
        overview: "《凡人修仙传》建立了一套完整的修仙境界体系，人界分为：炼气期、筑基期、结丹期（金丹期）、元婴期、化神期、合体期、大乘期、渡劫期。每个大境界又细分若干小层次，每次突破都需要机缘与积累。",
        body: "<p><strong>人界境界（从低到高）：</strong></p><ul><li>炼气期（1–13层）</li><li>筑基期（初期、中期、后期）</li><li>结丹期（金丹期）</li><li>元婴期（初期、中期、后期）</li><li>化神期</li><li>合体期</li><li>大乘期</li><li>渡劫期</li></ul><p>仙界另有仙人、真仙等更高层次，本条目待管理员补充。</p>",
        related: "han-li, breakthrough-tribulation",
      },
      {
        slug: "breakthrough-tribulation", title: "天劫与渡劫", category: "境界体系", tags: "天劫,渡劫,雷劫,突破",
        excerpt: "修士突破大境界时面临天地劫难，稍有不慎便会身殒道消。",
        overview: "修士在突破大境界，尤其是元婴期及以上时，必须承受天劫考验。天劫以雷劫最为常见，威力与修士境界成正比。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "cultivation-realms-fanren",
      },
      // 功法秘术
      {
        slug: "qingyuan-sword-art", title: "青元剑诀", category: "功法秘术", tags: "剑诀,青元,韩立,飞剑",
        excerpt: "韩立早期修炼的剑法功诀，奠定其飞剑体系的基础。",
        overview: "青元剑诀是韩立修炼飞剑之术的入门功法，后经不断完善演化为更高阶的剑道体系。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li, cultivation-realms-fanren",
      },
      {
        slug: "great-development-technique", title: "大衍神通", category: "功法秘术", tags: "神通,大衍,韩立",
        excerpt: "韩立修炼的强大神通之一，蕴含深厚的道法变化。",
        overview: "大衍神通是《凡人修仙传》中韩立掌握的重要神通，以变化莫测著称。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      {
        slug: "provenance-true-devil-art", title: "真魔功", category: "功法秘术", tags: "魔功,真魔,韩立,魔道",
        excerpt: "融合魔道精髓的高阶功法，威力极大却需慎重修炼。",
        overview: "真魔功是韩立后期修炼的重要功法之一，融合了魔界精髓，大幅提升战斗力。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li, cultivation-realms-fanren",
      },
      // 法宝
      {
        slug: "seventy-two-flying-swords", title: "七十二路飞剑", category: "法宝", tags: "飞剑,法宝,韩立,竹灵剑",
        excerpt: "韩立标志性的攻击法宝，七十二把竹蜂云剑齐出威力惊人。",
        overview: "韩立以竹蜂云剑为核心，凝练出七十二路飞剑阵法，是其招牌战术之一。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li, qingyuan-sword-art",
      },
      {
        slug: "heaven-earth-spirit-flame", title: "天地灵火", category: "法宝", tags: "灵火,炼器,韩立",
        excerpt: "修仙界中极为珍稀的天地异火，对炼器与战斗均有重要价值。",
        overview: "天地灵火是《凡人修仙传》中出现的各类珍稀异火的统称，韩立曾收集多种用于炼器与战斗。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      // 宗门势力
      {
        slug: "luoyun-sect", title: "落云宗", category: "宗门势力", tags: "宗门,落云宗,人界",
        excerpt: "天南修仙界的重要宗门之一，韩立曾在此留下深刻印记。",
        overview: "落云宗是天南修仙界的顶级势力之一，门规严格，弟子众多。韩立与落云宗的渊源贯穿了其在天南的早中期岁月。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      {
        slug: "nine-kingdoms-alliance", title: "九国联盟", category: "宗门势力", tags: "九国,联盟,人界,战争",
        excerpt: "天南人界中由多国修仙门派组成的联合势力，与魔道长期对峙。",
        overview: "九国联盟是天南人界修仙界的重要政治结构，由正道门派与世俗国家联合组成，对抗魔道势力。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "luoyun-sect",
      },
      // 灵兽
      {
        slug: "weeping-soul-beast", title: "噬魂兽", category: "灵兽", tags: "灵兽,噬魂兽,韩立,吞噬",
        excerpt: "韩立豢养的奇特灵兽，以吞噬鬼魂为食，外形憨厚内里却威力强大。",
        overview: "噬魂兽（Weeping Soul Beast）是韩立早期获得的灵兽，外形似熊，能吞噬鬼魂，在战斗中出奇制胜。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      {
        slug: "leopard-kirin-beast", title: "豹麟兽", category: "灵兽", tags: "灵兽,豹麟,韩立,坐骑",
        excerpt: "韩立后期的强力灵兽，兼具速度与战力，忠诚可靠。",
        overview: "豹麟兽是韩立修仙后期豢养的重要灵兽，速度与攻击力均十分出色。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li",
      },
      // 地图
      {
        slug: "tiannan-region", title: "天南修仙界", category: "地图", tags: "天南,地图,人界,修仙",
        excerpt: "韩立修仙初期长期活动的地域，分布众多宗门与秘境。",
        overview: "天南修仙界是韩立度过漫长修仙初期的主要舞台，地域辽阔，宗门林立，秘境众多，是《凡人修仙传》人界篇的核心地图。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p><p>建议包含：地域划分、重要宗门分布、主要秘境等内容。</p>",
        related: "luoyun-sect, nine-kingdoms-alliance",
      },
      {
        slug: "spirit-realm", title: "灵界", category: "地图", tags: "灵界,上界,天界,修仙",
        excerpt: "凌驾于人界之上的更高层次世界，修士渡劫成功后可飞升至此。",
        overview: "灵界是《凡人修仙传》中人界之上的大千世界，资源更为丰富，强者如云，韩立飞升后的主要活动舞台。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "cultivation-realms-fanren, han-li",
      },
      // 剧情时间线
      {
        slug: "plot-timeline-mortal-world", title: "人界篇时间线", category: "剧情时间线", tags: "时间线,人界,剧情,事件",
        excerpt: "韩立从炼气期到渡劫飞升的漫长人界历程中的重要事件梳理。",
        overview: "本条目梳理韩立在人界期间（炼气至渡劫）的重要事件节点，帮助读者快速回顾剧情脉络。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p><p>建议按章节或时期划分，逐条列出关键事件。</p>",
        related: "han-li, cultivation-realms-fanren",
      },
      {
        slug: "plot-timeline-spirit-realm", title: "灵界篇时间线", category: "剧情时间线", tags: "时间线,灵界,剧情,事件",
        excerpt: "韩立飞升灵界后的重要剧情事件与势力交锋梳理。",
        overview: "本条目梳理韩立在灵界（飞升后至大乘期）的重要事件节点与势力变化。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "han-li, spirit-realm",
      },
      // 名词索引
      {
        slug: "glossary-linggen", title: "灵根", category: "名词索引", tags: "灵根,资质,修仙基础",
        excerpt: "修仙者的先天资质，决定其修炼速度与上限，分单灵根至五灵根等多种类型。",
        overview: "灵根是《凡人修仙传》中修仙者先天修炼资质的核心概念，分单灵根（最佳）至五灵根（最差）。灵根属性与金、木、水、火、土五行对应。灵根越纯，修炼越快，突破越容易。",
        body: "<p>灵根类型：</p><ul><li><strong>单灵根</strong>：五系其一，最为纯净，天才资质</li><li><strong>双灵根</strong>：含两种属性，仍属优秀</li><li><strong>三灵根</strong>：中等资质</li><li><strong>四灵根</strong>：资质较差</li><li><strong>五灵根</strong>：俗称废灵根，修炼艰难</li><li><strong>变异灵根</strong>：特殊属性，可能是福也可能是祸</li></ul>",
        related: "cultivation-realms-fanren",
      },
      {
        slug: "glossary-dan-fang", title: "丹方", category: "名词索引", tags: "丹药,炼丹,配方,名词",
        excerpt: "炼制丹药所需的配方，是修仙界珍贵资源的重要来源。",
        overview: "丹方是炼制修仙丹药的配方，记录所需药材、配比、火候等要素，品阶越高的丹方越为稀缺。",
        body: "<p>本条目为占位资料，等待管理员填充详细内容。</p>",
        related: "cultivation-realms-fanren",
      },
      {
        slug: "glossary-magic-treasure-grades", title: "法宝品阶", category: "名词索引", tags: "法宝,品阶,灵宝,仙器,名词",
        excerpt: "《凡人修仙传》中法宝按品阶划分的体系说明，从低阶法器到仙器逐级递增。",
        overview: "法宝品阶体系是修仙界衡量法宝价值的标准，大致分为：法器、灵宝、仙器等层次，每类又有品级之分。",
        body: "<p>大致品阶划分（由低至高）：</p><ul><li>法器（低/中/高阶）</li><li>灵宝（低/中/高阶）</li><li>仙器（下品/中品/上品）</li></ul><p>具体细分与各阶特征待管理员补充。</p>",
        related: "seventy-two-flying-swords, heaven-earth-spirit-flame",
      },
    ];

    for (const item of stubs) {
      try {
        app.findFirstRecordByData("articles", "slug", item.slug);
        continue; // skip if already exists
      } catch (_) {}

      const r = new Record(articles);
      r.set("type", "wiki");
      r.set("status", "published");
      r.set("publishAt", now);
      r.set("seoTitle", `${item.title} — 凡人修仙传 Wiki | Spirit Root`);
      r.set("metaDescription", item.excerpt);
      for (const k in item) r.set(k, item[k]);
      app.save(r);
    }
  },
  (app) => {
    const slugs = [
      "han-li","nan-gong-wan","fairy-violet-spirit",
      "cultivation-realms-fanren","breakthrough-tribulation",
      "qingyuan-sword-art","great-development-technique","provenance-true-devil-art",
      "seventy-two-flying-swords","heaven-earth-spirit-flame",
      "luoyun-sect","nine-kingdoms-alliance",
      "weeping-soul-beast","leopard-kirin-beast",
      "tiannan-region","spirit-realm",
      "plot-timeline-mortal-world","plot-timeline-spirit-realm",
      "glossary-linggen","glossary-dan-fang","glossary-magic-treasure-grades",
    ];
    for (const slug of slugs) {
      try {
        const r = app.findFirstRecordByData("articles", "slug", slug);
        app.delete(r);
      } catch (_) {}
    }
  },
);
