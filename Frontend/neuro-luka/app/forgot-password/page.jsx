'use client'
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
      // In a real application, connect this to your API
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // const data = await response.json();
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success simulation
      setMessage({ 
        type: 'success', 
        text: 'Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.'
      });
      
      // Reset form
      setEmail('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.' 
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Lupa Password</title>
        <meta name="description" content="Reset password page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-900 flex items-center justify-center">
              {/* Replace with your actual logo */}
              <svg 
                className="h-10 w-10 text-white" 
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
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Lupa Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan alamat email Anda dan kami akan mengirimkan link untuk mengatur ulang password Anda.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {message.text && (
              <div 
                className={`mb-4 p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <p>{message.text}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Alamat Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Link Reset Password'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-sm text-center">
                <Link 
                  href="/login" 
                  className="font-medium text-green-900 hover:text-green-800"
                >
                  Sudah ingat password Anda? Kembali ke halaman login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}