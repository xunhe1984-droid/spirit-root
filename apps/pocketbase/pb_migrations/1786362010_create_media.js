/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const existing = (() => {
      try { return app.findCollectionByNameOrId("media"); } catch (_) { return null; }
    })();
    if (existing) return;

    const collection = new Collection({
      type: "base",
      name: "media",
      listRule: "@request.auth.role = 'admin'",
      viewRule: "@request.auth.role = 'admin'",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
      fields: [
        { name: "title", type: "text", max: 200 },
        {
          name: "file",
          type: "file",
          required: true,
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
          thumbs: ["400x300", "800x600"],
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      ],
    });
    app.save(collection);
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId("media"));
    } catch (_) {}
  },
);
