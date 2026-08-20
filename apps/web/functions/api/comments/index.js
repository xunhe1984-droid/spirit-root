/**
 * 评论 API（Cloudflare Pages Functions + D1 数据库）
 *
 * GET  /api/comments?article=<articleId>&visitorId=<visitorId>
 *   返回某篇文章正常显示（未被屏蔽）的评论（公开），带 isMine（当前访客是否可删除）
 *
 * GET  /api/comments
 *   返回全部评论（管理用，需 x-admin-key 头）
 *
 * POST /api/comments
 *   body: { article, authorName, authorEmail, body, parent, website, visitorId }
 *   visitorId 为浏览器生成的匿名访客ID，用于「只能删除自己的评论」
 *   website 为蜜罐字段（防垃圾），填写则静默成功
 *
 * DELETE /api/comments?id=<id>[&visitorId=<visitorId>]
 *   管理员可直接删除；普通访客需 visitorId 匹配该评论的 visitor_id 才能删除自己的评论
 */

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function checkAdmin(context) {
  const key = context.request.headers.get('x-admin-key');
  return key && key === (context.env.ADMIN_KEY || '');
}

// 读取评论列表
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const article = (url.searchParams.get('article') || '').trim();

  try {
    // 无 article 参数 → 全部评论（管理用）
    if (!article) {
      if (!checkAdmin(context)) {
        return json({ error: 'unauthorized' }, { status: 401 });
      }
      const { results } = await context.env.DB.prepare(
        `SELECT c.id, c.article, c.authorName, c.authorEmail, c.body, c.parent, c.created, c.approved,
                COALESCE(a.title, '') as articleTitle, COALESCE(a.titleEn, '') as articleTitleEn
         FROM comments c
         LEFT JOIN articles a ON c.article = a.id
         ORDER BY c.created DESC`
      ).all();
      return json(results || []);
    }

    // 有 article 参数 → 公开评论
    const visitorId = (url.searchParams.get('visitorId') || '').trim().slice(0, 64);
    const { results } = await context.env.DB.prepare(
      `SELECT c.id, c.article, c.authorName, c.body, c.parent, c.created,
              (c.visitor_id = ?) AS isMine
       FROM comments c
       WHERE c.article = ? AND c.approved = 1
       ORDER BY c.created ASC`
    )
      .bind(visitorId, article)
      .all();

    // isMine 统一转成布尔值（不对外暴露 visitor_id，保护隐私）
    const list = (results || []).map((c) => ({ ...c, isMine: !!c.isMine }));
    return json(list);
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
  const visitorId = String(body.visitorId || '').trim().slice(0, 64);
  const created = new Date().toISOString();
  const approved = 1; // 评论默认直接显示；管理员屏蔽时由 PATCH 置为 0

  try {
    const { success } = await context.env.DB.prepare(
      `INSERT INTO comments (id, article, authorName, authorEmail, body, parent, created, approved, visitor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, article, authorName, authorEmail, content.slice(0, 5000), parent, created, approved, visitorId)
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

// 屏蔽/解除屏蔽评论（blocked=1 屏蔽隐藏，blocked=0 恢复显示）
export async function onRequestPatch(context) {
  if (!checkAdmin(context)) {
    return json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(context.request.url);
  const id = (url.searchParams.get('id') || '').trim();
  const blocked = url.searchParams.get('blocked');

  if (!id || blocked === null) {
    return json({ error: 'id and blocked are required' }, { status: 400 });
  }

  // DB 字段 approved 兼容旧数据：1=正常显示，0=已屏蔽（隐藏）
  const val = blocked === '1' ? 0 : 1;

  try {
    const { success } = await context.env.DB.prepare(
      `UPDATE comments SET approved = ? WHERE id = ?`
    ).bind(val, id).run();

    if (!success) {
      return json({ error: 'update failed' }, { status: 500 });
    }
    return json({ ok: true });
  } catch (e) {
    console.error('DB patch error:', e);
    return json({ error: 'database error' }, { status: 500 });
  }
}

// 删除评论（管理员可直接删；普通访客只能删自己的）
export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const id = (url.searchParams.get('id') || '').trim();
  if (!id) {
    return json({ error: 'id is required' }, { status: 400 });
  }

  const isAdmin = checkAdmin(context);
  const visitorId = (url.searchParams.get('visitorId') || '').trim().slice(0, 64);

  try {
    const comment = await context.env.DB.prepare(
      'SELECT visitor_id FROM comments WHERE id = ?'
    ).bind(id).first();

    if (!comment) {
      return json({ error: 'not found' }, { status: 404 });
    }

    // 非管理员：必须提供 visitorId 且与评论的 visitor_id 一致（只能删自己的）
    if (!isAdmin) {
      if (!visitorId || comment.visitor_id !== visitorId) {
        return json({ error: 'unauthorized' }, { status: 403 });
      }
    }

    await context.env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
    return json({ ok: true });
  } catch (e) {
    console.error('DB delete error:', e);
    return json({ error: 'database error' }, { status: 500 });
  }
}
