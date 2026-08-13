import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { useAuth } from '@/lib/useAuth';
import pb from '@/lib/pocketbaseClient';

const EMPTY = {
  title: '', slug: '', type: 'wiki', category: '', tags: '', excerpt: '', overview: '',
  body: '', historical: '', related: '', cover: '', seoTitle: '', metaDescription: '',
  ogImage: '', status: 'draft', publishAt: '',
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminPage() {
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const bodyRef = useRef(null);

  // Media upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const loadAll = useCallback(() => {
    pb.collection('articles').getFullList({ sort: '-created' }).then(setArticles).catch(() => {});
    pb.collection('comments').getFullList({ sort: '-created' }).then(setComments).catch(() => {});
    pb.collection('media').getFullList({ sort: '-created' }).then(setMedia).catch(() => {});
  }, []);

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin, loadAll]);

  useEffect(() => {
    if (!isAuthed) navigate('/login?next=/admin', { replace: true });
  }, [isAuthed, navigate]);

  if (!isAuthed) return null;
  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-serif text-3xl">Access denied</h1>
          <p className="mt-3 text-muted-foreground">Your account ({user?.email}) is not an editor.</p>
          <button onClick={logout} className="mt-6 rounded bg-jade px-5 py-2 text-sm text-[hsl(var(--primary-foreground))]">Sign out</button>
        </div>
      </Layout>
    );
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startNew = () => { setForm(EMPTY); setEditingId(null); setMsg(''); };
  const startEdit = (a) => {
    setEditingId(a.id);
    setForm({ ...EMPTY, ...a, publishAt: a.publishAt ? a.publishAt.substring(0, 16) : '' });
    setTab('editor');
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    const data = { ...form, slug: form.slug || slugify(form.title) };
    if (data.publishAt) data.publishAt = new Date(data.publishAt).toISOString();
    try {
      if (editingId) await pb.collection('articles').update(editingId, data);
      else await pb.collection('articles').create(data);
      setMsg('Saved.');
      startNew();
      setTab('articles');
      loadAll();
    } catch (err) {
      setMsg('Error: ' + (err?.message || 'could not save'));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    await pb.collection('articles').delete(id).catch(() => {});
    loadAll();
  };

  const setApproved = async (id, approved) => {
    await pb.collection('comments').update(id, { approved }).catch(() => {});
    loadAll();
  };
  const delComment = async (id) => {
    await pb.collection('comments').delete(id).catch(() => {});
    loadAll();
  };

  // Media library helpers
  const getMediaUrl = (rec) => pb.files.getURL(rec, rec.file);

  const uploadMedia = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      fd.append('title', uploadTitle || uploadFile.name);
      await pb.collection('media').create(fd);
      setUploadFile(null);
      setUploadTitle('');
      setUploadMsg('Uploaded!');
      loadAll();
    } catch (err) {
      setUploadMsg('Upload failed: ' + (err?.message || 'unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await pb.collection('media').delete(id).catch(() => {});
    loadAll();
  };

  const copyUrl = (rec) => {
    navigator.clipboard.writeText(getMediaUrl(rec)).then(() => {
      setCopiedId(rec.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const insertIntoBody = (rec) => {
    const url = getMediaUrl(rec);
    const tag = `<img src="${url}" alt="${rec.title || ''}" style="max-width:100%;" />`;
    const ta = bodyRef.current;
    if (!ta) {
      setField('body', (form.body || '') + '\n' + tag);
      return;
    }
    const start = ta.selectionStart ?? (form.body || '').length;
    const end = ta.selectionEnd ?? start;
    const before = (form.body || '').substring(0, start);
    const after = (form.body || '').substring(end);
    setField('body', before + tag + after);
    setTab('editor');
  };

  const inputCls = 'w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade';

  const tabs = [
    ['articles', 'Articles'],
    ['editor', editingId ? 'Edit' : 'New Article'],
    ['media', `Media (${media.length})`],
    ['comments', `Comments (${comments.filter((c) => !c.approved).length} pending)`],
  ];

  return (
    <Layout>
      <Seo title="Admin — Spirit Root" />
      <div className="mx-auto max-w-[80rem] px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl font-semibold">Content Studio</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user?.email}</span>
            <button onClick={logout} className="rounded border px-3 py-1.5 hover:bg-accent">Sign out</button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b overflow-x-auto">
          {tabs.map(([k, l]) => (
            <button
              key={k}
              onClick={() => { setTab(k); if (k === 'editor' && !editingId) startNew(); }}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm ${tab === k ? 'border-jade text-jade' : 'border-transparent text-muted-foreground'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {msg && <p className="mt-4 text-sm text-jade">{msg}</p>}

        {/* ── ARTICLES LIST ── */}
        {tab === 'articles' && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="py-2">Title</th><th>Type</th><th>Category</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="py-2 font-medium">{a.title}</td>
                    <td className="capitalize">{a.type}</td>
                    <td className="text-muted-foreground">{a.category}</td>
                    <td><span className="rounded-full border px-2 py-0.5 text-xs capitalize">{a.status}</span></td>
                    <td className="text-right">
                      <button onClick={() => startEdit(a)} className="text-jade hover:underline">Edit</button>
                      <button onClick={() => remove(a.id)} className="ml-3 text-destructive hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ARTICLE EDITOR ── */}
        {tab === 'editor' && (
          <form onSubmit={save} className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm">Title</label>
                <input required value={form.title} onChange={(e) => setField('title', e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm">Slug (URL)</label>
                  <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="auto from title" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Type</label>
                  <select value={form.type} onChange={(e) => setField('type', e.target.value)} className={inputCls}>
                    <option value="wiki">Wiki</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm">Category</label>
                  <input value={form.category} onChange={(e) => setField('category', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setField('tags', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm">Cover image URL</label>
                <input value={form.cover} onChange={(e) => setField('cover', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Overview</label>
                <textarea rows={2} value={form.overview} onChange={(e) => setField('overview', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Related (comma separated slugs)</label>
                <input value={form.related} onChange={(e) => setField('related', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm">Body (HTML)</label>
                  <button
                    type="button"
                    onClick={() => setTab('media')}
                    className="text-xs text-jade hover:underline"
                  >
                    📷 Insert image from Media Library
                  </button>
                </div>
                <textarea
                  ref={bodyRef}
                  rows={8}
                  value={form.body}
                  onChange={(e) => setField('body', e.target.value)}
                  className={`${inputCls} font-mono text-xs`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Historical Background (HTML)</label>
                <textarea rows={4} value={form.historical} onChange={(e) => setField('historical', e.target.value)} className={`${inputCls} font-mono text-xs`} />
              </div>
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-semibold text-jade">SEO</h3>
                <div className="mt-3 space-y-3">
                  <input placeholder="SEO title" value={form.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} className={inputCls} />
                  <textarea rows={2} placeholder="Meta description" value={form.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} className={inputCls} />
                  <input placeholder="Open Graph image URL" value={form.ogImage} onChange={(e) => setField('ogImage', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm">Status</label>
                  <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputCls}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Publish date</label>
                  <input type="datetime-local" value={form.publishAt} onChange={(e) => setField('publishAt', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="rounded bg-jade px-6 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90">
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && <button type="button" onClick={startNew} className="rounded border px-4 py-2.5 text-sm">New</button>}
              </div>
            </div>
          </form>
        )}

        {/* ── MEDIA LIBRARY ── */}
        {tab === 'media' && (
          <div className="mt-6">
            {/* Upload form */}
            <form onSubmit={uploadMedia} className="rounded-md border bg-card p-5">
              <h3 className="font-serif text-lg font-semibold">Upload Image</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Image file</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full rounded border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Title (optional)</label>
                  <input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Image title"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <button
                  disabled={uploading || !uploadFile}
                  className="rounded bg-jade px-5 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {uploadMsg && <span className={`text-xs ${uploadMsg.startsWith('Upload failed') ? 'text-destructive' : 'text-jade'}`}>{uploadMsg}</span>}
              </div>
            </form>

            {/* Image grid */}
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold">Library ({media.length})</h3>
              {editingId && (
                <p className="mt-1 text-xs text-muted-foreground">Click <strong>Insert into body</strong> to add the image to the article you are currently editing.</p>
              )}
              {media.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No images uploaded yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {media.map((rec) => {
                    const url = getMediaUrl(rec);
                    return (
                      <div key={rec.id} className="rounded-md border bg-card overflow-hidden">
                        <div className="aspect-[4/3] bg-muted overflow-hidden">
                          <img
                            src={url}
                            alt={rec.title || 'image'}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium truncate">{rec.title || 'Untitled'}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              onClick={() => copyUrl(rec)}
                              className="rounded border px-2 py-1 text-[11px] hover:bg-accent"
                            >
                              {copiedId === rec.id ? '✓ Copied' : 'Copy URL'}
                            </button>
                            {editingId && (
                              <button
                                onClick={() => insertIntoBody(rec)}
                                className="rounded bg-jade/10 border border-jade/30 px-2 py-1 text-[11px] text-jade hover:bg-jade/20"
                              >
                                Insert into body
                              </button>
                            )}
                            <button
                              onClick={() => deleteMedia(rec.id)}
                              className="ml-auto rounded border border-destructive/30 px-2 py-1 text-[11px] text-destructive hover:bg-destructive/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COMMENTS ── */}
        {tab === 'comments' && (
          <div className="mt-6 space-y-4">
            {comments.length === 0 && <p className="text-muted-foreground">No comments.</p>}
            {comments.map((c) => (
              <div key={c.id} className={`rounded-md border bg-card p-4 ${!c.approved ? 'border-gold/40' : ''}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm font-medium">{c.authorName || 'Anonymous'} <span className="text-muted-foreground">{c.authorEmail}</span></span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.approved ? 'bg-jade text-[hsl(var(--primary-foreground))]' : 'border border-gold/60 text-gold'}`}>
                    {c.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{c.body}</p>
                <div className="mt-3 flex gap-3 text-xs">
                  {!c.approved
                    ? <button onClick={() => setApproved(c.id, true)} className="text-jade hover:underline">Approve</button>
                    : <button onClick={() => setApproved(c.id, false)} className="text-muted-foreground hover:underline">Unapprove</button>}
                  <button onClick={() => delComment(c.id)} className="text-destructive hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
