'use client'
import { useState } from 'react';

export default function AboutUs() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50" id='tentang'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="md:flex">
            <div className="md:w-2/6 p-8 md:p-12 bg-gradient-to-br from-green-50 to-green-100">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Tentang Kami
              </h1>
              <div className="w-20 h-1 bg-green-600 rounded-full mb-8"></div>
              <p className="text-gray-700 text-lg hidden md:block">
                Inovasi dalam analisis luka menggunakan teknologi AI
              </p>
            </div>
            
            <div className="md:w-4/6 p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 text-lg leading-relaxed">
                  Selamat datang di aplikasi <span className="font-semibold text-green-700">Neuro Luka</span>, sebuah proyek inovatif yang dikembangkan 
                  sebagai bagian dari tugas akhir semester (UAS) mata kuliah kalkulus. Aplikasi ini dirancang untuk membantu 
                  tenaga medis dan klien dalam menganalisis luka secara otomatis menggunakan teknologi pemrosesan citra digital 
                  dan kecerdasan buatan (AI).
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mt-6">
                  Proyek ini dibuat oleh mahasiswa Teknik Informatika Universitas Siliwangi yang beranggotakan:
                </p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Muhammad Adryan Suryaman
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Farhan Esha Putra Kusuma Atmaja
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Yogi Nugraha
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Bunga Rylla Octaramadhany
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Farid Syah Fadillah
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}