import React, { useEffect, useState, useCallback } from 'react';

import Layout from '@/components/Layout';
import Seo from '@/components/Seo';

const ADMIN_KEY_STORAGE = 'sr-admin-key';

function getStoredKey() {
  try { return localStorage.getItem(ADMIN_KEY_STORAGE) || ''; } catch { return ''; }
}

function storeKey(key) {
  try { localStorage.setItem(ADMIN_KEY_STORAGE, key); } catch {}
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(getStoredKey);
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const api = async (url, opts = {}) => {
    const headers = { ...opts.headers, 'x-admin-key': adminKey };
    const resp = await fetch(url, { ...opts, headers });
    if (resp.status === 401) throw new Error('unauthorized');
    if (!resp.ok) throw new Error('request failed');
    return resp.json();
  };

  const loadComments = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/comments');
      setComments(data);
    } catch (e) {
      if (e.message === 'unauthorized') {
        setAdminKey('');
        storeKey('');
        setError('管理密钥无效，请重新输入。');
      } else {
        setError('加载失败: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (adminKey) loadComments();
  }, [adminKey, loadComments]);

  const saveKey = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    storeKey(keyInput.trim());
    setKeyInput('');
  };

  const delComment = async (id) => {
    if (!window.confirm('确定删除此评论？')) return;
    try {
      await api(`/api/comments?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
      setMsg('已删除。');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setError('删除失败: ' + e.message);
    }
  };

  const logout = () => {
    setAdminKey('');
    storeKey('');
    setComments([]);
  };

  // 没有密钥 → 显示密钥输入界面
  if (!adminKey) {
    return (
      <Layout>
        <Seo title="Admin — Spirit Root" />
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-serif text-3xl font-semibold">评论管理</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            请输入你在 Cloudflare 设置的 <code>ADMIN_KEY</code> 环境变量值。
          </p>
          <form onSubmit={saveKey} className="mt-6">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="输入管理密钥"
              className="w-full rounded-md border bg-background px-4 py-2 text-sm outline-none focus:border-jade"
              autoFocus
            />
            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="mt-4 w-full rounded-md bg-jade py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-60"
            >
              进入管理
            </button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            密钥设置后会保存在浏览器中，下次自动登录。
          </p>
        </div>
      </Layout>
    );
  }

  // 评论管理界面
  return (
    <Layout>
      <Seo title="评论管理 — Spirit Root" />
      <div className="mx-auto max-w-[80rem] px-5 py-12">
        {/* 头部 */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold">评论管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              共 {comments.length} 条评论
            </p>
          </div>
          <button onClick={logout} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">
            退出 / 更换密钥
          </button>
        </div>

        {msg && <p className="mt-4 text-sm text-jade">{msg}</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {/* 评论列表 */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[0,1,2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-md border bg-card" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">暂无评论。</p>
          ) : (
            comments.map((c) => {
              const articleTitle = c.articleTitleEn || c.articleTitle || c.article;
              return (
                <div
                  key={c.id}
                  className={`rounded-md border bg-card p-4 ${!c.approved ? 'border-gold/40' : ''}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium">{c.authorName || 'Anonymous'}</span>
                      {c.authorEmail && (
                        <span className="text-muted-foreground">{c.authorEmail}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(c.created)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.parent ? (
                        <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">回复</span>
                      ) : null}
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                        c.approved
                          ? 'bg-jade/10 text-jade'
                          : 'border border-gold/60 text-gold'
                      }`}>
                        {c.approved ? '已批准' : '待审核'}
                      </span>
                    </div>
                  </div>

                  {articleTitle && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      文章：{articleTitle}
                    </p>
                  )}

                  <p className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {c.body}
                  </p>

                  <div className="mt-3 flex gap-3 text-xs">
                    <button
                      onClick={() => delComment(c.id)}
                      className="text-destructive hover:underline"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
