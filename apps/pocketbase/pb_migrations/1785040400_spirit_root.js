/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    // add role field to users
    if (!users.fields.getByName("role")) {
      users.fields.add(
        new SelectField({
          name: "role",
          maxSelect: 1,
          values: ["member", "admin"],
        }),
      );
      app.save(users);
    }

    // ARTICLES (wiki + blog) — public read of published, admin-managed writes
    const articles = new Collection({
      type: "base",
      name: "articles",
      listRule: "status = 'published' || @request.auth.role = 'admin'",
      viewRule: "status = 'published' || @request.auth.role = 'admin'",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
      fields: [
        { name: "title", type: "text", required: true, max: 200 },
        { name: "slug", type: "text", required: true, max: 200 },
        { name: "type", type: "select", required: true, maxSelect: 1, values: ["wiki", "blog"] },
        { name: "category", type: "text", max: 100 },
        { name: "tags", type: "text", max: 300 },
        { name: "excerpt", type: "text", max: 500 },
        { name: "overview", type: "text", max: 2000 },
        { name: "body", type: "editor" },
        { name: "historical", type: "editor" },
        { name: "related", type: "text", max: 500 },
        { name: "cover", type: "text", max: 500 },
        { name: "seoTitle", type: "text", max: 200 },
        { name: "metaDescription", type: "text", max: 400 },
        { name: "ogImage", type: "text", max: 500 },
        { name: "status", type: "select", required: true, maxSelect: 1, values: ["draft", "published", "scheduled"] },
        { name: "publishAt", type: "date" },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_articles_slug ON articles (slug)",
        "CREATE INDEX idx_articles_type ON articles (type)",
      ],
    });
    app.save(articles);

    // COMMENTS — anyone can submit, moderated; only approved shown publicly
    const comments = new Collection({
      type: "base",
      name: "comments",
      listRule: "approved = true || @request.auth.role = 'admin'",
      viewRule: "approved = true || @request.auth.role = 'admin'",
      createRule: "",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
      fields: [
        { name: "article", type: "relation", required: true, maxSelect: 1, collectionId: articles.id, cascadeDelete: true },
        { name: "authorName", type: "text", max: 100 },
        { name: "authorEmail", type: "email" },
        { name: "body", type: "text", required: true, max: 3000 },
        { name: "parent", type: "text", max: 50 },
        { name: "approved", type: "bool" },
        { name: "website", type: "text", max: 200 },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      ],
      indexes: ["CREATE INDEX idx_comments_article ON comments (article)"],
    });
    app.save(comments);
  },
  (app) => {
    for (const name of ["comments", "articles"]) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch (_) {}
    }
  },
);
