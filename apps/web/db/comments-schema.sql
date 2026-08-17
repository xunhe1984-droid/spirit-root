-- Cloudflare D1 评论表结构
-- 在 Cloudflare Dashboard → D1 → 你的数据库 → Console 中执行

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article TEXT NOT NULL,
  authorName TEXT DEFAULT '',
  authorEmail TEXT DEFAULT '',
  body TEXT NOT NULL,
  parent TEXT DEFAULT '',
  created TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent);
