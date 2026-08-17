import React, { useEffect, useState } from 'react';

function CommentItem({ c, replies, onReply }) {
  return (
    <li className="border-t pt-4">
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-sm">{c.authorName || 'Anonymous'}</span>
        <span className="text-xs text-muted-foreground">{new Date(c.created).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{c.body}</p>
      <button onClick={() => onReply(c)} className="mt-1 text-xs text-jade hover:underline">Reply</button>
      {replies.length > 0 && (
        <ul className="mt-3 space-y-3 border-l pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-sm">{r.authorName || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', body: '', website: '' });
  const [replyTo, setReplyTo] = useState(null);
  const [status, setStatus] = useState('');

  const load = () => {
    fetch(`/api/comments?article=${encodeURIComponent(articleId)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => {});
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
      <h3 className="font-serif text-2xl font-semibold">Comments</h3>
      {top.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No comments yet. Be the first to share a thought.</p>
      ) : (
        <ul className="mt-5 space-y-5">
          {top.map((c) => (
            <CommentItem key={c.id} c={c} onReply={setReplyTo} replies={comments.filter((r) => r.parent === c.id)} />
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-8 rounded-md border bg-card p-5">
        <h4 className="font-serif text-lg font-semibold">
          {replyTo ? `Replying to ${replyTo.authorName || 'Anonymous'}` : 'Leave a comment'}
        </h4>
        {replyTo && (
          <button type="button" onClick={() => setReplyTo(null)} className="text-xs text-jade">Cancel reply</button>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input placeholder="Name (optional)" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
          <input type="email" placeholder="Email (optional)" value={form.authorEmail} onChange={(e) => setForm({ ...form, authorEmail: e.target.value })} className="rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
        </div>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden="true" />
        <textarea required placeholder="Share your thoughts..." rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="mt-3 w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
        <div className="mt-3 flex items-center gap-4">
          <button disabled={status === 'sending'} className="rounded bg-jade px-5 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-60">
            {status === 'sending' ? 'Submitting...' : 'Submit'}
          </button>
          {status === 'done' && <span className="text-xs text-jade">Thank you — your comment is awaiting moderation.</span>}
          {status === 'error' && <span className="text-xs text-destructive">Something went wrong. Please try again.</span>}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Comments are moderated before appearing. Name and email are optional.</p>
      </form>
    </section>
  );
}
