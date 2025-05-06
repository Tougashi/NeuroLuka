'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.get('/sanctum/csrf-cookie');
      
      const response = await axios.post('/api/login', {
        email,
        password
      });

      if (response.data) {
        alert('Login berhasil!');
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

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
          {error && (
            <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.9rem', color: '#444', fontWeight: 500 }}>Forgot Password?</Link>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              background: isLoading ? '#cccccc' : '#008080', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '24px', 
              padding: '12px', 
              fontSize: '1.1rem', 
              fontWeight: 500, 
              boxShadow: '0 4px 8px rgba(0,0,0,0.10)', 
              marginBottom: '16px', 
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
          <Link href="/">
            <button
              type="button"
              style={{ width: '100%', background: '#eee', color: '#008080', border: 'none', borderRadius: '24px', padding: '12px', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px', cursor: 'pointer', marginBottom: '16px' }}
            >
              Kembali ke Main Page
            </button>
          </Link>
        </form>
        <div style={{ fontSize: '0.95rem', marginBottom: '16px' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#008080', fontWeight: 600, textDecoration: 'underline' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}