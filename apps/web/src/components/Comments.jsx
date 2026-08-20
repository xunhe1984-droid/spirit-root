import React, { useEffect, useMemo, useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';

// 生成/读取匿名访客ID（localStorage 持久化），用于「只能删除自己的评论」
function getVisitorId() {
  try {
    let id = localStorage.getItem('sr_visitor_id');
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
        ('v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
      localStorage.setItem('sr_visitor_id', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function CommentItem({ c, replies, onReply, onDelete }) {
  const { t } = useLang();
  return (
    <li className="border-t pt-4">
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-sm">{c.authorName || t('匿名', 'Anonymous')}</span>
        <span className="text-xs text-muted-foreground">{new Date(c.created).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{c.body}</p>
      <div className="mt-1 flex items-center gap-3">
        <button onClick={() => onReply(c)} className="text-xs text-jade hover:underline">{t('回复', 'Reply')}</button>
        {c.isMine && (
          <button onClick={() => onDelete(c)} className="text-xs text-destructive hover:underline">{t('删除', 'Delete')}</button>
        )}
      </div>
      {replies.length > 0 && (
        <ul className="mt-3 space-y-3 border-l pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-sm">{r.authorName || t('匿名', 'Anonymous')}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created).toLocaleDateString()}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t('回复 ', 'Reply to ') + (c.authorName || t('匿名', 'Anonymous'))}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{r.body}</p>
              {r.isMine && (
                <button onClick={() => onDelete(r)} className="mt-1 text-xs text-destructive hover:underline">{t('删除', 'Delete')}</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Comments({ articleId }) {
  const { t } = useLang();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', body: '', website: '' });
  const [replyTo, setReplyTo] = useState(null);
  const [status, setStatus] = useState('');
  const visitorId = useMemo(() => getVisitorId(), []);

  const load = () => {
    fetch(`/api/comments?article=${encodeURIComponent(articleId)}&visitorId=${encodeURIComponent(visitorId)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => {});
  };

  const delComment = async (comment) => {
    if (!window.confirm(t('确定删除这条评论吗？', 'Delete this comment?'))) return;
    try {
      const resp = await fetch(
        `/api/comments?id=${encodeURIComponent(comment.id)}&visitorId=${encodeURIComponent(visitorId)}`,
        { method: 'DELETE' }
      );
      if (!resp.ok) throw new Error('delete failed');
      load();
    } catch {
      setStatus('error');
    }
  };
  useEffect(() => { if (articleId) load(); /* eslint-disable-next-line */ }, [articleId]);

  const submit = async (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot
    if (!form.body.trim()) return;
    setStatus('sending');
    try {
      const resp = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: articleId,
          authorName: form.authorName,
          authorEmail: form.authorEmail,
          body: form.body,
          parent: replyTo ? replyTo.id : '',
          visitorId,
          website: form.website,
        }),
      });
      if (!resp.ok) throw new Error('submit failed');
      setForm({ authorName: '', authorEmail: '', body: '', website: '' });
      setReplyTo(null);
      setStatus('done');
      load(); // 刷新评论列表
    } catch {
      setStatus('error');
    }
  };

  const top = comments.filter((c) => !c.parent);

  return (
    <section className="mt-14">
      <h3 className="font-serif text-2xl font-semibold">{t('评论', 'Comments')}</h3>
      {top.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t('暂无评论，来分享您的想法吧。', 'No comments yet. Be the first to share a thought.')}</p>
      ) : (
        <ul className="mt-5 space-y-5">
          {top.map((c) => (
            <CommentItem key={c.id} c={c} onReply={setReplyTo} onDelete={delComment} replies={comments.filter((r) => r.parent === c.id)} />
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-8 rounded-md border bg-card p-5">
        <h4 className="font-serif text-lg font-semibold">
          {replyTo
            ? t('正在回复 ', 'Replying to ') + (replyTo.authorName || t('匿名', 'Anonymous')) + t(' 的评论', "'s comment")
            : t('发表评论', 'Leave a comment')}
        </h4>
        {replyTo && (
          <button type="button" onClick={() => setReplyTo(null)} className="text-xs text-jade">{t('取消回复', 'Cancel reply')}</button>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input placeholder={t('姓名（可选）', 'Name (optional)')} value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
          <input type="email" placeholder={t('邮箱（可选）', 'Email (optional)')} value={form.authorEmail} onChange={(e) => setForm({ ...form, authorEmail: e.target.value })} className="rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
        </div>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden="true" />
        <textarea required placeholder={t('分享您的想法...', 'Share your thoughts...')} rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="mt-3 w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
        <div className="mt-3 flex items-center gap-4">
          <button disabled={status === 'sending'} className="rounded bg-jade px-5 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-60">
            {status === 'sending'
              ? t('提交中...', 'Submitting...')
              : replyTo ? t('提交回复', 'Submit reply') : t('提交评论', 'Submit comment')}
          </button>
          {status === 'done' && <span className="text-xs text-jade">{t('感谢 — 您的评论已发布。', 'Thank you — your comment is now live.')}</span>}
          {status === 'error' && <span className="text-xs text-destructive">{t('发生错误，请重试。', 'Something went wrong. Please try again.')}</span>}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{t('评论将直接显示。请友善发言。姓名和邮箱为选填。', 'Comments appear immediately. Please be kind. Name and email are optional.')}</p>
      </form>
    </section>
  );
}
