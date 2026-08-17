/**
 * 评论 API（Cloudflare Pages Functions + D1 数据库）
 *
 * GET  /api/comments?article=<articleId>
 *   返回某篇文章的已批准评论（按时间升序）
 *
 * POST /api/comments
 *   body: { article, authorName, authorEmail, body, parent, website }
 *   website 为蜜罐字段（防垃圾），填写则静默成功
 */

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// 读取评论列表
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const article = (url.searchParams.get('article') || '').trim();
  if (!article) {
    return json({ error: 'article is required' }, { status: 400 });
  }

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, article, authorName, body, parent, created
       FROM comments
       WHERE article = ? AND approved = 1
       ORDER BY created ASC`
    )
      .bind(article)
      .all();

    return json(results || []);
  } catch (e) {
    console.error('DB query error:', e);
    return json({ error: 'database error' }, { status: 500 });
  }
}

// 提交评论
export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, { status: 400 });
  }

  // 蜜罐：机器人会填写隐藏的 website 字段，静默返回成功
  if (body.website) {
    return json({ ok: true });
  }

  const article = String(body.article || '').trim();
  const content = String(body.body || '').trim();
  if (!article) {
    return json({ error: 'article is required' }, { status: 400 });
  }
  if (!content) {
    return json({ error: 'body is required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const authorName = String(body.authorName || '').trim().slice(0, 100);
  const authorEmail = String(body.authorEmail || '').trim().slice(0, 200);
  const parent = String(body.parent || '').trim().slice(0, 64);
  const created = new Date().toISOString();
  const approved = 1; // 直接显示（如需审核可改为 0 并另建审核页）

  try {
    const { success } = await context.env.DB.prepare(
      `INSERT INTO comments (id, article, authorName, authorEmail, body, parent, created, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, article, authorName, authorEmail, content.slice(0, 5000), parent, created, approved)
      .run();

    if (!success) {
      return json({ error: 'failed to save comment' }, { status: 500 });
    }
    return json({ ok: true, id });
  } catch (e) {
    console.error('DB insert error:', e);
    return json({ error: 'database error' }, { status: 500 });
  }
}
