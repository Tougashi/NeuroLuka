'use client'

import React from 'react'
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white to-green-50 overflow-hidden pt-20 md:pt-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-16 lg:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-20">
          <div className="w-full md:w-1/2 space-y-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Ukur Area Luka Kulit Otomatis dari Foto
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Otomatis mengukur ukuran luka prediksi pemulihan luka bekerja untuk semua jenis luka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/analisis"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                Mulai Analisis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="#cara-kerja"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg border border-gray-200"
              >
                Pelajari Lebih Lanjut
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-gray-600">100% Akurat</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-600">Analisis Cepat</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Akurasi Tinggi</h3>
                      <p className="text-gray-600">Hasil pengukuran yang presisi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Proses Cepat</h3>
                      <p className="text-gray-600">Hasil dalam hitungan detik</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Riwayat Lengkap</h3>
                      <p className="text-gray-600">Dokumentasi perawatan luka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
            <div className="bubble-container">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <div className="bubble bubble-3"></div>
              <div className="bubble bubble-4"></div>
              <div className="bubble bubble-5"></div>
              <div className="bubble bubble-6"></div>
              <div className="bubble bubble-7"></div>
              <div className="bubble bubble-8"></div>
              <div className="bubble bubble-9"></div>
              <div className="bubble bubble-10"></div>
          </div>
        </div>
        
      <style jsx global>{`
        .bubble-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          background: linear-gradient(135deg, rgba(0, 255, 98, 0.08) 0%, rgba(22, 101, 52, 0.05) 100%);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
          backdrop-filter: blur(5px);
          pointer-events: none;
        }

        .bubble-1 { width: 300px; height: 300px; left: -100px; top: 20%; animation-delay: 0s; }
        .bubble-2 { width: 200px; height: 200px; right: -50px; top: 40%; animation-delay: -2s; }
        .bubble-3 { width: 250px; height: 250px; left: 30%; bottom: -100px; animation-delay: -4s; }
        .bubble-4 { width: 180px; height: 180px; right: 20%; bottom: 20%; animation-delay: -6s; }
        .bubble-5 { width: 220px; height: 220px; left: 10%; top: 60%; animation-delay: -8s; }
        .bubble-6 { width: 120px; height: 120px; left: 60%; top: 10%; animation-delay: -3s; }
        .bubble-7 { width: 160px; height: 160px; right: 10%; top: 70%; animation-delay: -7s; }
        .bubble-8 { width: 100px; height: 100px; left: 80%; top: 30%; animation-delay: -5s; }
        .bubble-9 { width: 140px; height: 140px; left: 50%; bottom: 10%; animation-delay: -9s; }
        .bubble-10 { width: 90px; height: 90px; right: 30%; top: 80%; animation-delay: -10s; }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @media (max-width: 768px) {
          .bubble-1 { width: 120px; height: 120px; left: -40px; top: 10px; }
          .bubble-2 { width: 80px; height: 80px; right: -20px; top: 80px; }
          .bubble-3 { width: 100px; height: 100px; left: 40%; bottom: -30px; }
          .bubble-4 { width: 60px; height: 60px; right: 10%; bottom: 10%; }
          .bubble-5 { width: 90px; height: 90px; left: 5%; top: 60%; }
          .bubble-6 { width: 60px; height: 60px; left: 70%; top: 20px; }
          .bubble-7 { width: 70px; height: 70px; right: 5%; top: 70%; }
          .bubble-8 { width: 50px; height: 50px; left: 60%; top: 120px; }
          .bubble-9 { width: 60px; height: 60px; left: 50%; bottom: 10px; }
          .bubble-10 { width: 40px; height: 40px; right: 30%; top: 80%; }
        }
      `}</style>
    </section>
  )
}

export default Hero