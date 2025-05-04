'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ background: '#fff', borderRadius: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', padding: '48px 32px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 600, fontSize: '2rem', marginBottom: '32px' }}>Log in</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '8px', fontSize: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Link href="#" style={{ fontSize: '0.9rem', color: '#444', fontWeight: 500 }}>Forgot Password?</Link>
          </div>
          <button type="submit" style={{ width: '100%', background: '#008080', color: '#fff', border: 'none', borderRadius: '24px', padding: '12px', fontSize: '1.1rem', fontWeight: 500, boxShadow: '0 4px 8px rgba(0,0,0,0.10)', marginBottom: '16px', cursor: 'pointer' }}>
            Log in
          </button>
          <button
            onClick={() => window.location.href = '/'}
            type="button"
            style={{ width: '100%', background: '#eee', color: '#008080', border: 'none', borderRadius: '24px', padding: '12px', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px', cursor: 'pointer', marginBottom: '16px' }}
          >
            Kembali ke Main Page
          </button>
        </form>
        <div style={{ fontSize: '0.95rem', marginBottom: '16px' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#008080', fontWeight: 600, textDecoration: 'underline' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
} 