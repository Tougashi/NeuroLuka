'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
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
      // First, get CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      // Then submit registration
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
      });

      if (response.data && response.data.message === 'User registered successfully') {
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join('\n'));
      } else {
        setError(err.response?.data?.message || 'Failed to register. Please try again.');
      }
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
        <h2 style={{ fontWeight: 600, fontSize: '2rem', marginBottom: '32px', color: '#16a34a' }}>Daftar</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            name="name"
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            name="password"
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          {error && (
            <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center', whiteSpace: 'pre-line' }}>
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              background: isLoading ? '#cccccc' : '#16a34a', 
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
            {isLoading ? 'Sedang mendaftar...' : 'Daftar'}
          </button>
          <Link href="/">
            <button
              type="button"
              style={{ width: '100%', background: '#eee', color: '#16a34a', border: 'none', borderRadius: '24px', padding: '12px', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px', cursor: 'pointer', marginBottom: '16px' }}
            >
              Kembali ke Main Page
            </button>
          </Link>
        </form>
        <div style={{ fontSize: '0.95rem', marginBottom: '16px' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'underline' }}>Masuk</Link>
        </div>
      </div>
    </div>
  );
}