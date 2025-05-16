'use client'

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setPreview(previewUrl);
      localStorage.setItem('uploadedImage', previewUrl);
       setIsLoading(true);
      setTimeout(() => {
        router.push('/analys');
      },5000); // Delay kecil biar UX-nya smooth
    }
  };
   

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white to-green-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Ukur Area Luka Kulit Otomatis dari Foto
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Otomatis mengukur ukuran luka prediksi pemulihan luka bekerja untuk semua jenis luka
            </p>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              {preview ? (
                <div className="relative h-72 w-full border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
                  <Image 
                    src={preview} 
                    alt="Preview luka" 
                    layout="fill" 
                    objectFit="contain"
                    className="rounded-lg"
                  />
                  <button 
                    onClick={() => {setPreview(null); setImage(null);}}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="text-green-600 mb-4">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="mb-2 text-lg text-gray-600"><span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas</p>
                    <p className="text-sm text-gray-500">PNG, JPG, atau JPEG (Maks. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </label>
              )}
              
              <div className="mt-6 flex justify-center">
                <button
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  Unggah Gambar
                </button>
              </div>
              {isLoading && (
                <div className="flex justify-center items-center mt-4 text-gray-700">
                  <svg className="animate-spin h-6 w-6 mr-3 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="text-lg">Menganalisis gambar...</span>
                </div>
              )}
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