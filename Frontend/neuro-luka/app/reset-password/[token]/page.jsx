'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function ResetPassword({ params }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/reset-password', {
        token: params.token,
        email: new URLSearchParams(window.location.search).get('email'),
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (response.data) {
        alert('Password berhasil direset!');
        router.push('/login');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Gagal mereset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ background: '#fff', borderRadius: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', padding: '48px 32px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontWeight: 600, fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password Baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px 20px', borderRadius: '24px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '1rem' }}
          />
          {error && (
            <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}
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
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.10)',
              marginBottom: '16px'
            }}
          >
            {isLoading ? 'Memproses...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
