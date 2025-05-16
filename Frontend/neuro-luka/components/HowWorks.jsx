'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HowWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload Gambar",
      description: "Upload foto luka Anda dengan kualitas yang baik dan pencahayaan yang cukup",
      icon: "ri-upload-cloud-2-line",
      color: "bg-blue-100 text-blue-800",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      id: 2,
      title: "Menunggu Model Bekerja",
      description: "Sistem akan menganalisis gambar luka menggunakan model AI yang telah dilatih",
      icon: "ri-ai-generate",
      color: "bg-purple-100 text-purple-800",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      id: 3,
      title: "Hasil Analisis Keluar",
      description: "Dapatkan hasil analisis lengkap termasuk ukuran luka, waktu pemulihan, dan rekomendasi",
      icon: "ri-file-list-3-line",
      color: "bg-green-100 text-green-800",
      gradient: "from-green-50 to-green-100"
    },
    {
      id: 4,
      title: "Riwayat Analisis",
      description: "Jika Anda login, hasil analisis akan tersimpan dan dapat diakses kembali di halaman riwayat",
      icon: "ri-history-line",
      color: "bg-orange-100 text-orange-800",
      gradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cara Kerja Analisis Luka
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Proses analisis luka menggunakan teknologi AI yang dapat memberikan hasil akurat dalam waktu singkat
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
              <div className="relative">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${step.icon} ri-3x`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {step.description}
                </p>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 font-bold">
                  {step.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/analisis"
            className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg"
          >
            Mulai Analisis
            <i className="ri-arrow-right-line ml-3 ri-lg"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowWorks; 