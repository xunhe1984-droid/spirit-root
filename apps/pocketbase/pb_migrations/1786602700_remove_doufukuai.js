/// <reference path="../pb_data/types.d.ts" />
// Remove 豆腐块 practitioner articles after the practitioner card was deleted.

migrate(
  (app) => {
    try {
      const rows = app.findRecordsByFilter('articles', 'author = "doufukuai"');
      for (const r of rows) {
        app.deleteRecord(r);
      }
    } catch (e) {
      // collection or records may not exist; safe to ignore
    }
  },
  (app) => {
    // no-op rollback (deleted seed data is not restored)
  },
);
