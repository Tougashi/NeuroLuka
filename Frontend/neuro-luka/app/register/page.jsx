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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-12">
        <h2 className="text-3xl font-semibold text-green-600 text-center mb-8">Daftar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              name="name"
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
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
              name="password"
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm whitespace-pre-line">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-3xl text-white text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Sedang mendaftar...' : 'Daftar'}
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
          Sudah punya akun?{' '}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}