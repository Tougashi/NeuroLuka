'use client'
import React from 'react';

export default function Why() {
  const features = [
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
        </svg>
      ),
      title: "Akurasi Tinggi",
      description: "Hasil pengukuran luka dengan tingkat akurasi tinggi untuk evaluasi yang tepat"
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      title: "Teknologi AI",
      description: "Menggunakan teknologi kecerdasan buatan terkini untuk analisis luka otomatis"
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: "Mudah Digunakan",
      description: "Antarmuka yang sederhana dan mudah dipahami oleh tenaga medis tanpa pelatihan khusus"
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: "Pelacakan Progres",
      description: "Lacak perkembangan penyembuhan luka dengan dokumentasi otomatis dari waktu ke waktu"
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      ),
      title: "Proses Cepat",
      description: "Pengukuran luka dalam hitungan detik untuk menghemat waktu perawatan pasien"
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: "Tanpa Biaya",
      description: "Solusi pengukuran luka dengan gratis tanpa dipungut biaya"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Kenapa Harus Pilih Kami</h2>
        <p className="text-gray-900 max-w-2xl text-2xl mx-auto">
          Solusi pengukur luka digital terbaik untuk kebutuhan medis dan perawatan pasien Anda
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <div className="w-10 h-10 text-green-900">
                {feature.icon()}
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-900 text-lg">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-10">
        <p className="text-gray-900 text-sm">
          Tingkatkan kualitas perawatan luka dengan teknologi pengukuran digital kami
        </p>
      </div>
    </div>
  );
}