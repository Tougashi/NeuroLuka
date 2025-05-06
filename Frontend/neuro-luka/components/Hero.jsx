'use client'

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';

const Hero = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className=" container mx-auto px-0 py-4 md:py-8 rounded-lg shadow-xs overflow-hidden">
      <div className="md:flex md:justify-between px-8 md:px-40 pt-0 md:pt-24  ">
          <div className="absolute inset-0  -z-10 ">
            {/* Ganti "/images/background-blob.png" dengan path ke gambar Anda */}
            <Image 
              src="/Group 4.png"
              
              alt=""
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        <div className=" pt-10 md:pt-12 md:w-1/2 ">
          {/* bg-gradient-to-br  from-teal-50  to-white md:w-1/2" */}
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-800 gap-6 mb-2">
            Ukur Area Luka Kulit 
          </h1>
          {/* <h1 className='text-6xl font-semibold text-gray-800 mb-2'>Luka Kulit</h1> */}
          <h1 className='text-5xl md:text-6xl font-semibold text-gray-800 mb-2'>Otomatis dari Foto</h1>
          {/* <h1 className='text-6xl font-semibold text-gray-800 mb-4'>dari Foto</h1> */}
          <div className="space-y-2 md:space-y-4 mb-6 md:mb-0 text-gray-800">
            <p className='text-3xl'>Otomatis mengukur ukuran luka</p>
            <p className='text-3xl'>Bekerja untuk semua jenis luka</p>
            <p className='text-3xl'>Prediksi Pemulihan Luka</p>
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-32">
          <div className="w-full max-w-md">
            {preview ? (
              <div className="relative h-64 w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <Image 
                  src={preview} 
                  alt="Preview luka" 
                  layout="fill" 
                  objectFit="contain"
                />
                <button 
                  onClick={() => {setPreview(null); setImage(null);}}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer ">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="text-green-900 mb-3">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas</p>
                  <p className="text-xs text-gray-500">PNG, JPG, atau JPEG (Maks. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  accept="image/png, image/jpeg, image/jpg"
                />
              </label>
            )}
            
            <div className="mt-4 flex justify-center">
              <button 
                className="px-4 py-2 bg-green-900 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                Unggah Gambar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero