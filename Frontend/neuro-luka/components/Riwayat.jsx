'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

const Riwayat = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/user');
        setIsAuthenticated(true);
        // Only fetch history if authenticated
        const response = await axios.get('/api/analysis/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-gray-600">Silakan login terlebih dahulu</h2>
        <p className="text-gray-500 mt-2">Anda perlu login untuk melihat riwayat analisis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-gray-600">Belum ada riwayat analisis</h2>
        <p className="text-gray-500 mt-2">Mulai analisis luka Anda untuk melihat riwayat di sini</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Wound Image */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl}
                alt="Wound analysis"
                fill
                className="object-cover"
              />
            </div>

            {/* Right column - Analysis Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Analisis #{item.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Ukuran Luka</p>
                  <p className="font-semibold">{item.size}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Waktu Pemulihan</p>
                  <p className="font-semibold">{item.recoveryTime}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Progress Penyembuhan</p>
                <p className="text-gray-700">{item.healingProgress}</p>
              </div>

              <button
                onClick={() => router.push(`/analis/${item.id}`)}
                className="w-full bg-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Riwayat; 