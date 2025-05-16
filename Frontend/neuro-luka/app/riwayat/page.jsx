'use client'
import Navbar from '@/components/Navbar';
import Riwayat from '@/components/Riwayat';

export default function RiwayatPage() {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
          Riwayat Analisis
        </h1>
        <Riwayat />
      </div>
    </div>
  );
} 