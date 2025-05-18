'use client'
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useDropzone } from 'react-dropzone';
import axios from '@/utils/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function WoundAnalysis() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedWoundType, setSelectedWoundType] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const woundTypes = [
    { id: 'luka_goresan', name: 'Luka Goresan' },
    { id: 'luka_lecet', name: 'Luka Lecet' },
    { id: 'luka_bakar', name: 'Luka Bakar' },
    { id: 'luka_terpotong', name: 'Luka Terpotong' },
    { id: 'luka_terbuka', name: 'Luka Terbuka' }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setPreview(previewUrl);
      setAnalysisResult(null);
      setError(null);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/jpg': ['.jpg'],
      'image/pjpeg': ['.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 1,
    multiple: false
  });  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPEG, JPG, PNG, atau GIF.');
    }

    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 5MB.');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError('Silakan pilih gambar terlebih dahulu');
      return;
    }

    if (!selectedWoundType) {
      setError('Silakan pilih jenis luka');
      return;
    }

    try {
      validateImage(image);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create form data for Laravel backend
      const formDataLaravel = new FormData();
      formDataLaravel.append('image', image);
      formDataLaravel.append('wound_type', selectedWoundType);

      // Send to Laravel backend
      const uploadResponse = await axios.post('/api/analyze', formDataLaravel, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Gagal mengunggah gambar');
      }

      const uploadResult = uploadResponse.data;

      // Create form data for FastAPI service
      const formDataFastAPI = new FormData();
      const newFile = new File([image], image.name, { type: image.type });
      formDataFastAPI.append('file', newFile);
      formDataFastAPI.append('wound_type', selectedWoundType);

      // Create a separate axios instance for FastAPI
      const fastApiClient = axios.create({
        baseURL: 'http://localhost:8090',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      // Send to FastAPI service for analysis
      const analysisResponse = await fastApiClient.post('/predict', formDataFastAPI);

      if (!analysisResponse.data) {
        throw new Error('Gagal menganalisis gambar');
      }

      const analysisResult = analysisResponse.data;

      // Get recommendations based on wound type
      const woundTypeInfo = WOUND_TYPES[selectedWoundType] || {
        name: selectedWoundType,
        recommendations: []
      };

      // Combine results
      const result = {
        ...analysisResult,
        image_url: uploadResult.data.original_image_url,
        segmentation_image_url: uploadResult.data.segmentation_image_url,
        wound_type: woundTypeInfo.name,
        recommendations: woundTypeInfo.recommendations,
        area_recovery_time: analysisResult.area_recovery_time,
        total_recovery_time: analysisResult.total_recovery_time
      };

      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.response?.data?.message || error.message || 'Terjadi kesalahan saat menganalisis gambar');
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Analisis Luka</h1>
              <p className="text-lg text-gray-600">Upload gambar luka untuk mendapatkan analisis mendalam</p>
            </div>            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {/* Disclaimer Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-green-800 mb-2">Petunjuk Pengambilan Gambar:</h2>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Jarak kamera sekitar 25-30 cm dari area luka</li>
                  <li>Pastikan pencahayaan cukup terang</li>
                  <li>Fokuskan kamera tepat pada area luka</li>
                  <li>Hindari gambar yang blur atau tidak jelas</li>
                </ul>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="relative">
                    <div className="relative h-80 w-full rounded-lg overflow-hidden mb-4">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setImage(null);
                        setAnalysisResult(null);
                      }}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xl text-gray-600 mb-2">
                        {isDragActive ? 'Lepaskan gambar di sini' : 'Seret dan lepas gambar di sini'}
                      </p>
                      <p className="text-sm text-gray-500">atau klik untuk memilih file</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG atau JPEG (Maks. 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {preview && (
                <div className="mt-6">
                  <label htmlFor="woundType" className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Jenis Luka
                  </label>
                  <select
                    id="woundType"
                    value={selectedWoundType}
                    onChange={(e) => setSelectedWoundType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Pilih jenis luka...</option>
                    {woundTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={analyzeImage}
                disabled={!image || !selectedWoundType || isAnalyzing}
                className={`w-full mt-6 py-3 px-6 rounded-xl text-white font-medium text-lg transition-all duration-200 ${
                  !image || !selectedWoundType || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 transform hover:scale-[1.02]'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menganalisis...
                  </div>
                ) : 'Analisis Gambar'}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
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

      {analysisResult && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hasil Analisis</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Ukuran Luka</h3>
                      <div className="text-xl font-semibold text-gray-900">
                        <span>{Number(analysisResult.area_cm2).toFixed(2)} cm²</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Area</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Estimasi Waktu Pemulihan</h3>
                      <p className="text-xl font-semibold text-gray-900">{analysisResult.estimated_recovery_time}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>• Berdasarkan luas: {analysisResult.area_recovery_time}</p>
                        <p>• Total estimasi: {analysisResult.total_recovery_time}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Jenis Luka</h3>
                      <p className="text-xl font-semibold text-gray-900">{analysisResult.wound_type}</p>
                    </div>
                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Segmentasi Luka</h3>
                      <div className="mt-2 relative h-80 w-full">
                        {analysisResult.segmentation_image && (
                          <Image
                            src={`data:image/png;base64,${analysisResult.segmentation_image}`}
                            alt="Hasil Segmentasi Luka"
                            fill
                            className="object-contain rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Rekomendasi Perawatan</h3>
                      <div className="prose prose-sm max-w-none">
                        <ul className="list-disc pl-4 text-gray-700 space-y-1">
                          {analysisResult.recommendations?.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}