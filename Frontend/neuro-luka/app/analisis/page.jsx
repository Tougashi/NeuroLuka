'use client'
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import axios from '@/utils/axios';

export default function WoundAnalysis() {
  const { data: session } = useSession();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

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

    try {
      validateImage(image);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Get CSRF token first
      await axios.get('/sanctum/csrf-cookie');      const formDataLaravel = new FormData();
      formDataLaravel.append('image', image);

      // Send to Laravel backend
      const uploadResponse = await axios.post('/api/analyze', formDataLaravel, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Gagal mengunggah gambar');
      }

      const uploadResult = uploadResponse.data;      // Send to FastAPI service for analysis
      const formDataFastAPI = new FormData();
      // Create a new file with the correct mime type
      const newFile = new File([image], image.name, { type: image.type });
      formDataFastAPI.append('file', newFile);

      const analysisResponse = await axios.post('http://localhost:8090/predict', formDataFastAPI, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!analysisResponse.data) {
        throw new Error('Gagal menganalisis gambar');
      }

      const analysisResult = analysisResponse.data;

      // Combine results
      const result = {
        ...analysisResult,
        image_url: uploadResult.image_url,
      };

      setAnalysisResult(result);

      // Save to history if user is logged in
      if (session?.user) {
        try {
          await axios.post('/api/history', {
            image_url: preview,
            analysis_result: result
          });
        } catch (error) {
          console.error('Gagal menyimpan riwayat:', error);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Analisis Luka</h1>
            <p className="text-lg text-gray-600">Upload gambar luka untuk mendapatkan analisis mendalam</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
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

            <button
              onClick={analyzeImage}
              disabled={!image || isAnalyzing}
              className={`w-full mt-6 py-3 px-6 rounded-xl text-white font-medium text-lg transition-all duration-200 ${
                !image || isAnalyzing
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
                      <span>{analysisResult.area_cm2} cm²</span>
                      <span className="mx-2">×</span>
                      <span>{analysisResult.perimeter_cm} cm</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Area × Perimeter</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Estimasi Waktu Pemulihan</h3>
                    <p className="text-xl font-semibold text-gray-900">{analysisResult.estimated_recovery_time}</p>
                    <p className="text-sm text-gray-500 mt-1">Berdasarkan ukuran dan kondisi luka</p>
                  </div>                  <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
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
      </main>
    </div>
  );
}