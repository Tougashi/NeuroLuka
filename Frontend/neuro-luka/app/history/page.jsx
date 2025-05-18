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
  const [selectedWound, setSelectedWound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define WOUND_TYPES at component level
  const WOUND_TYPES = {
    "luka_goresan": {
      name: "Luka Goresan",
      recommendations: [
        "Bersihkan luka dengan air bersih atau larutan saline steril",
        "Oleskan antiseptik ringan",
        "Tutup dengan plester atau perban steril",
        "Ganti perban setiap hari atau saat basah"
      ]
    },
    "luka_lecet": {
      name: "Luka Lecet",
      recommendations: [
        "Bersihkan luka dengan air bersih",
        "Hindari menggosok area luka",
        "Gunakan salep antibiotik",
        "Tutup dengan perban non-stick"
      ]
    },
    "luka_bakar": {
      name: "Luka Bakar",
      recommendations: [
        "Segera dinginkan luka dengan air mengalir",
        "Jangan pecahkan lepuhan",
        "Gunakan salep khusus luka bakar",
        "Tutup dengan perban steril",
        "Hindari paparan sinar matahari"
      ]
    },
    "luka_terpotong": {
      name: "Luka Terpotong",
      recommendations: [
        "Tekan luka untuk menghentikan perdarahan",
        "Bersihkan dengan antiseptik",
        "Gunakan plester atau jahitan jika diperlukan",
        "Jaga luka tetap kering"
      ]
    },
    "luka_terbuka": {
      name: "Luka Terbuka",
      recommendations: [
        "Bersihkan luka dengan larutan saline",
        "Gunakan salep antibiotik",
        "Tutup dengan perban steril",
        "Ganti perban secara teratur"
      ]
    }
  };

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
          if (response.data.length > 0) {
            setSelectedWound(response.data[0]);
          }
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
      <div className="pt-24 md:pt-32">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Riwayat Analisis</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Riwayat Analisis</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedWound(item);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedWound?.id === item.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.original_image}`}
                        alt="Wound Analysis"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {WOUND_TYPES[item.wound_type]?.name || item.wound_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.analyzed_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
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
            ) : selectedWound ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Foto Original</h3>
                      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selectedWound.original_image}`}
                          alt="Original Wound"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Hasil Segmentasi</h3>
                      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selectedWound.segmentation_image}`}
                          alt="Segmentation Result"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Luka</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Jenis Luka</dt>
                            <dd className="mt-1 text-sm text-gray-900">{WOUND_TYPES[selectedWound.wound_type]?.name || selectedWound.wound_type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Ukuran</dt>
                            <dd className="mt-1 text-sm text-gray-900">{Number(selectedWound.area_cm2).toFixed(2)} cm²</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tanggal Analisis</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(selectedWound.analyzed_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Estimasi Pemulihan</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Kondisi Jaringan</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedWound.tissue_condition}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estimasi Berdasarkan Luas</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedWound.area_recovery_time}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Estimasi Pemulihan</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedWound.total_recovery_time}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Rekomendasi Perawatan</h3>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="prose prose-sm max-w-none">
                          {WOUND_TYPES[selectedWound.wound_type]?.recommendations.map((rec, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <h4 className="text-base font-medium text-gray-900 mb-2">{rec.title}</h4>
                              <p className="text-gray-600">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Pilih riwayat analisis untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 