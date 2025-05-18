'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from '@/utils/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset message
    setMessage({ type: '', text: '' });
    
    // Basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setMessage({ 
        type: 'error', 
        text: 'Masukkan alamat email yang valid' 
      });
      return;
    }
    
    setIsLoading(true);      
    try {
      // First, get CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      const response = await axios.post('/api/forgot-password', {
        email: email
      });
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Link reset kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.'
      });
      
      // Reset form
      setEmail('');
    } catch (error) {
      console.error('Error details:', error);
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat();
          setMessage({ 
            type: 'error', 
            text: errorMessages.join('\n')
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: error.response.data.message || 'Email tidak ditemukan dalam sistem.'
          });
        }
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-12">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg 
              className="h-8 w-8 text-green-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-green-600 mb-4">
            Lupa Kata Sandi?
          </h2>
          <p className="text-gray-600 mb-8">
            Masukkan alamat email Anda dan kami akan mengirimkan link untuk mengatur ulang password Anda.
          </p>
        </div>

        {message.text && (
          <div 
            className={`mb-6 p-4 rounded-xl text-center text-sm whitespace-pre-line ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
            />
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
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            ) : (
              'Kirim Link Reset Password'
            )}
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
          <Link 
            href="/login" 
            className="text-green-600 font-semibold hover:underline"
          >
            Sudah ingat password Anda? Kembali ke halaman login
          </Link>
        </div>
      </div>
    </div>
  );
}
