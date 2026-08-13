/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    try {
      app.findAuthRecordByEmail("users", "admin@spiritroot.com");
    } catch (_) {
      const admin = new Record(users);
      admin.setEmail("admin@spiritroot.com");
      admin.setPassword("cultivation888");
      admin.set("name", "Editor");
      admin.set("role", "admin");
      admin.set("verified", true);
      app.save(admin);
    }

    const articles = app.findCollectionByNameOrId("articles");
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + ".000Z";

    const seed = [
      {
        title: "Spirit Root", slug: "spirit-root", type: "wiki", category: "Xianxia Basics",
        tags: "spirit root, linggen, cultivation, talent",
        excerpt: "The innate foundation that determines one's capacity to cultivate in Xianxia fiction.",
        overview: "In Xianxia fiction, a Spirit Root (灵根, línggēn) is the innate constitution that determines whether — and how well — a person can absorb spiritual energy and walk the path of cultivation.",
        body: "<p>The Spirit Root is one of the most fundamental concepts in cultivation fiction. It describes a person's inborn affinity with the five elements (metal, wood, water, fire, earth) and their ability to draw in and refine <em>Qi</em>.</p><p>A cultivator with a pure, single-element Spirit Root is considered a genius, while those with mixed or 'waste' roots must rely on effort, opportunity, or artificial means to progress.</p>",
        historical: "<p>While the term is a modern literary invention, it draws on older Daoist ideas of innate constitution (禀赋) and the belief that spiritual attainment depends on both nature and cultivation practice.</p>",
        related: "qi,golden-core,cultivation-realms",
        cover: "https://images.hostinger.com/4f95e416-0038-4850-ad03-ef020a97f03b.png",
        seoTitle: "Spirit Root — Xianxia Cultivation Explained | Spirit Root",
        metaDescription: "What is a Spirit Root in Xianxia fiction? An introduction to lingen, the innate talent for cultivation.",
      },
      {
        title: "Qi", slug: "qi", type: "wiki", category: "Cultivation Concepts",
        tags: "qi, energy, breath, vital force",
        excerpt: "The vital energy that flows through all things and fuels cultivation.",
        overview: "Qi (气) is the vital energy or life-force that, in both fiction and traditional Chinese thought, animates the body and the cosmos alike.",
        body: "<p>In cultivation stories, gathering and refining Qi is the first step on the immortal path. Cultivators breathe, meditate, and circulate Qi through meridians to strengthen the body and spirit.</p><p>The concept is rooted in genuine Chinese medicine, Daoist internal alchemy, and Qigong practice.</p>",
        historical: "<p>Qi has been central to Chinese philosophy, medicine, and martial arts for over two thousand years, appearing in texts from the Huangdi Neijing to Daoist alchemical manuals.</p>",
        related: "spirit-root,neidan,qigong",
        cover: "https://images.hostinger.com/073781d0-3ccf-4bfa-8c41-ea98ce86e8cd.png",
        seoTitle: "Qi — Vital Energy in Cultivation | Spirit Root",
        metaDescription: "Understand Qi, the vital energy behind Xianxia cultivation and Chinese traditional practice.",
      },
      {
        title: "Golden Core", slug: "golden-core", type: "wiki", category: "Cultivation Realms",
        tags: "golden core, jindan, realm, breakthrough",
        excerpt: "A major cultivation realm where condensed Qi forms a solid core of energy.",
        overview: "The Golden Core (金丹, jīndān) realm marks a decisive threshold where a cultivator condenses years of gathered Qi into a solid, radiant core.",
        body: "<p>Reaching the Golden Core stage vastly extends lifespan and power. The formation of the core is often the most dangerous breakthrough in a cultivator's early journey.</p><p>The imagery derives directly from Daoist internal alchemy (Neidan), where the 'golden elixir' symbolizes spiritual perfection.</p>",
        historical: "<p>Jindan is a real term from Daoist alchemy, describing the inner elixir cultivated through meditation, breath, and moral refinement rather than a literal pill.</p>",
        related: "nascent-soul,neidan,cultivation-realms",
        cover: "https://images.hostinger.com/4706bfbe-2b15-4959-b4c3-154ee726fa1b.png",
        seoTitle: "Golden Core — Cultivation Realm | Spirit Root",
        metaDescription: "The Golden Core realm explained: how cultivators condense Qi into a core, and its Daoist roots.",
      },
      {
        title: "Cultivation Realms", slug: "cultivation-realms", type: "wiki", category: "Cultivation Realms",
        tags: "realms, stages, progression",
        excerpt: "The staged ladder of power that structures nearly every Xianxia story.",
        overview: "Cultivation Realms are the sequential stages of spiritual attainment through which a cultivator ascends toward immortality.",
        body: "<p>A typical progression runs: Qi Condensation, Foundation Establishment, Golden Core, Nascent Soul, Soul Formation, and beyond toward ascension. Each realm brings longer life, greater strength, and deeper insight into the Dao.</p>",
        historical: "<p>The tiered structure echoes Daoist and Buddhist maps of spiritual progress, reframed as a game-like ladder for narrative momentum.</p>",
        related: "golden-core,nascent-soul,dao-heart",
        cover: "https://images.hostinger.com/4087246a-2032-4fd3-8a66-7b61c27152ae.png",
        seoTitle: "Cultivation Realms Explained | Spirit Root",
        metaDescription: "A guide to the cultivation realms of Xianxia fiction, from Qi Condensation to Nascent Soul.",
      },
      {
        title: "Daoism and Cultivation Fiction", slug: "daoism", type: "wiki", category: "Chinese Mythology",
        tags: "daoism, philosophy, laozi, immortals",
        excerpt: "How Daoist philosophy and the pursuit of immortality shaped Xianxia.",
        overview: "Daoism (道教) is the wellspring from which most cultivation imagery flows — from immortals and elixirs to the harmony of yin and yang.",
        body: "<p>The Daoist quest for longevity and union with the Dao provides the spiritual backbone of Xianxia. Concepts like wu wei, internal alchemy, and the celestial bureaucracy all reappear, transformed, in fiction.</p>",
        historical: "<p>Rooted in the Dao De Jing and Zhuangzi, Daoism developed elaborate practices for cultivating body and spirit over two millennia.</p>",
        related: "neidan,qi,golden-core",
        cover: "https://images.hostinger.com/4087246a-2032-4fd3-8a66-7b61c27152ae.png",
        seoTitle: "Daoism in Cultivation Fiction | Spirit Root",
        metaDescription: "Explore how Daoist philosophy and immortality practices shaped Xianxia cultivation stories.",
      },
    ];

    const blogs = [
      {
        title: "What is Xianxia?", slug: "what-is-xianxia", type: "blog", category: "Xianxia Culture",
        tags: "xianxia, genre, introduction",
        excerpt: "A short introduction to the genre of immortal-hero cultivation fiction.",
        body: "<p>Xianxia (仙侠) literally means 'immortal heroes'. It is a genre of Chinese fantasy centered on cultivators who train to transcend mortality, blending Daoist mysticism, martial arts, and epic adventure.</p><p>Unlike Western fantasy, its magic system is grounded in a coherent spiritual worldview of Qi, realms, and the Dao.</p>",
        cover: "https://images.hostinger.com/4706bfbe-2b15-4959-b4c3-154ee726fa1b.png",
        seoTitle: "What is Xianxia? A Beginner's Guide | Spirit Root",
        metaDescription: "An introduction to Xianxia, the genre of Chinese cultivation and immortal-hero fiction.",
      },
      {
        title: "Fictional Cultivation vs Real Spiritual Practice", slug: "fiction-vs-real-cultivation", type: "blog", category: "Chinese Philosophy",
        tags: "cultivation, daoism, reflection",
        excerpt: "Where the fantasy of cultivation ends and genuine practice begins.",
        body: "<p>It is tempting to read Xianxia as a literal manual for enlightenment. But fictional cultivation compresses centuries of gradual inner work into dramatic breakthroughs and power levels.</p><p>Real Daoist and Buddhist practice is slower, quieter, and concerned less with power than with clarity, ethics, and letting go.</p>",
        cover: "https://images.hostinger.com/073781d0-3ccf-4bfa-8c41-ea98ce86e8cd.png",
        seoTitle: "Fictional Cultivation vs Real Spiritual Practice | Spirit Root",
        metaDescription: "A reflection on the difference between Xianxia cultivation fantasy and genuine spiritual practice.",
      },
      {
        title: "Why Xianxia Became Popular Worldwide", slug: "why-xianxia-popular", type: "blog", category: "Xianxia Culture",
        tags: "xianxia, popularity, translation",
        excerpt: "The web-novel boom that carried cultivation stories across the globe.",
        body: "<p>Fan translations, web-novel platforms, and animated adaptations turned Xianxia from a domestic genre into a global phenomenon. Its clear progression systems and rich mythology resonate with readers everywhere.</p>",
        cover: "https://images.hostinger.com/4087246a-2032-4fd3-8a66-7b61c27152ae.png",
        seoTitle: "Why Xianxia Became Popular Worldwide | Spirit Root",
        metaDescription: "How web novels and translations made Xianxia cultivation fiction a global phenomenon.",
      },
      {
        title: "My Journey Exploring Chinese Meditation Traditions", slug: "meditation-journey", type: "blog", category: "Meditation Practice",
        tags: "meditation, personal notes, zhiguan",
        excerpt: "Personal notes on sitting with breath, stillness, and Chinese contemplative methods.",
        body: "<p>These are personal reflections rather than instruction. I write about my slow, imperfect attempts to sit quietly, follow the breath, and understand practices like Tiantai Zhiguan and Neidan.</p>",
        cover: "https://images.hostinger.com/073781d0-3ccf-4bfa-8c41-ea98ce86e8cd.png",
        seoTitle: "My Journey Exploring Chinese Meditation | Spirit Root",
        metaDescription: "Personal reflections on exploring Chinese meditation traditions like Zhiguan and Neidan.",
      },
    ];

    for (const item of [...seed, ...blogs]) {
      try {
        app.findFirstRecordByData("articles", "slug", item.slug);
        continue;
      } catch (_) {}
      const r = new Record(articles);
      r.set("status", "published");
      r.set("publishAt", now);
      r.set("metaDescription", item.excerpt);
      for (const k in item) r.set(k, item[k]);
      app.save(r);
    }
  },
  (app) => {},
);
