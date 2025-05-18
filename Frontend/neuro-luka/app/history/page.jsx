'use client'
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import Image from 'next/image';

export default function RiwayatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/history');
          setHistory(response.data);
        } catch (error) {
          console.error('Error fetching history:', error);
          setError('Gagal memuat riwayat analisis');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!loading) {
      fetchHistory();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Riwayat Analisis</h1>
            <p className="text-lg text-gray-600">Lihat riwayat analisis luka Anda</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada riwayat analisis</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {history.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.original_image}`}
                      alt="Wound Analysis"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.wound_type}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ukuran:</span> {Number(item.area_cm2).toFixed(2)} cm²
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Keakuratan:</span> {Number(item.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tanggal:</span>{' '}
                        {new Date(item.analyzed_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 