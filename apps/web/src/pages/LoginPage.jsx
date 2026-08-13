import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';
import { useAuth } from '@/lib/useAuth';

export default function LoginPage() {
  const { login, isAuthed } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  useEffect(() => {
    if (isAuthed) navigate(next, { replace: true });
  }, [isAuthed, navigate, next]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(next, { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <Seo title="Editor Login — Spirit Root" />
      <div className="mx-auto flex max-w-md flex-col px-5 py-24">
        <h1 className="font-serif text-3xl font-semibold">Editor Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage articles and comments.</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-md border bg-card p-6">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={busy} className="w-full rounded bg-jade px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-60">
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
