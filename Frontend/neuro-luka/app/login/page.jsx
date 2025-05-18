'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Email atau password tidak sesuai. Silakan coba lagi.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 sm:p-12">
          <h2 className="text-2xl font-semibold text-green-600 text-center mb-6">Anda Sudah Login</h2>
          <p className="text-gray-600 text-center mb-6">Anda telah terdeteksi sebagai pengguna yang sudah login. Anda akan dialihkan ke halaman beranda.</p>
          <Link href="/" className="block w-full">
            <button
              type="button"
              className="w-full bg-green-600 text-white rounded-3xl py-3 px-4 text-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-12">
        <h2 className="text-3xl font-semibold text-green-600 text-center mb-8">Masuk</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Lupa Kata Sandi?
            </Link>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-3xl text-white text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Sedang masuk...' : 'Masuk'}
          </button>
          <Link href="/" className="block w-full">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-3xl bg-gray-100 text-green-600 text-lg font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Kembali ke Beranda
            </button>
          </Link>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-green-600 font-semibold hover:underline">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}