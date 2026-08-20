
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Seo from '@/components/Seo';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (key.length > 0) {
      localStorage.setItem('admin_key', key);
      navigate('/admin', { replace: true });
    } else {
      setError('Please enter the Admin Key.');
    }
  };

  return (
    <Layout>
      <Seo title="Admin Login — Spirit Root" />
      <div className="mx-auto flex max-w-md flex-col px-5 py-24">
        <h1 className="font-serif text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter Admin Key to manage content.</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-md border bg-card p-6">
          <div>
            <label className="mb-1 block text-sm">Admin Key</label>
            <input type="password" required value={key} onChange={(e) => setKey(e.target.value)} className="w-full rounded border bg-background px-3 py-2 text-sm outline-none focus:border-jade" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button className="w-full rounded bg-jade px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Verify Key
          </button>
        </form>
      </div>
    </Layout>
  );
}
