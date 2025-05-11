'use client'
import { useState } from 'react';

export default function AboutUs() {
  return (
    <div className=" bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/6 p-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Tentang Kami</h1>
          </div>
          
          <div className="md:w-4/6 p-8">
            <p className="text-gray-800 text-lg">
              Selamat datang di aplikasi <span className="font-semibold">Neuro Luka</span> sebuah proyek inovatif yang dikembangkan 
              sebagai bagian dari tugas akhir semester (UAS) mata kuliah kalkulus. Aplikasi ini dirancang untuk membantu 
              tenaga medis dan klien dalam menganalisis luka secara otomatis menggunakan teknologi pemrosesan citra digital 
              dan kecerdasan buatan (AI). Proyek ini dibuat oleh mahasiswa Teknik Informatika Universitas Siliwangi yang beranggotakan
              Muhammad Adryan Suryaman, Farhan Esha Putra Kusuma Atmaja, Yogi Nugraha, Bunga Rylla Octaramadhany, Farid Syah Fadillah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}