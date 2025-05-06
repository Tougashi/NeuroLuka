import React from 'react'


const About = () => {
  
  const steps = [
    'Unggah Gambar',
    'AI Mendeteksi Luka',
    'Hasil Langsung Tersedia',
    'Pantau Perkembangan (Opsional)'
  ];
  
  return (
    <div className=" max-w-6xl mx-auto px-4 py-12 text-center"id='tentang' >
  
      <div className="mb-8">
        <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium text-sm">
          Didukung oleh Teknologi Kecerdasan Buatan
        </span>
      </div>
  
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
        Analisis Luka Lebih Cerdas, Cepat, dan Mudah
      </h1>
  
      <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-16">
        Ambil keputusan lebih cepat dan tepat — cukup unggah foto, dan biarkan AI kami membantu merencanakan perawatan yang optimal.
      </p>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Perkiraan Ukuran Luka yang Akurat</h2>
          <p className="text-gray-600">
            Dapatkan hasil pengukuran luka yang presisi dengan teknologi pemrosesan gambar dan perhitungan canggih.
          </p>
        </div>
  
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Klasifikasi Jaringan</h2>
          <p className="text-gray-600">
            Sistem kami bisa membedakan jenis jaringan pada luka untuk membantu menentukan perawatan yang tepat.
          </p>
        </div>
  
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Deteksi Luka Otomatis</h2>
          <p className="text-gray-600">
            Cukup unggah foto luka — teknologi AI kami akan mendeteksi dan menandai area yang perlu diperhatikan secara otomatis.
          </p>
        </div>
  
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-500 text-left">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Prediksi Pemulihan</h2>
          <p className="text-gray-600">
            Dapatkan estimasi waktu penyembuhan berdasarkan kondisi luka dan faktor-faktor pasien lainnya.
          </p>
        </div>
      </div>
  
      <div>
        <h1 className='font-semibold text-3xl md:text-5xl text-gray-900'>Bagaimana Cara Kerjanya?</h1>
      </div>
  
      <div className="md:w-6xl mx-auto py-8 px-4">
        <div className="flex flex-wrap justify-center items-center gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <span className="text-sm md:text-2xl font-medium text-gray-900">
                {step}
              </span>
              {index < steps.length - 1 && (
                <span className="mx-2 text-gray-800">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
  
      <div className="grid grid-cols-2 py-12">
        <h2 className="text-2xl text-gray-900 font-semibold px-8 text-center py-10">Kenapa Harus Kami?</h2>
        <div className="bg-gray-300 py-8 px-6 text-left">
          <p className="text-xl">
            Satu solusi untuk semua — bantu perawatan luka jadi lebih cepat, efisien, dan akurat.
          </p>
        </div>
      </div>
    
    </div>
  )
}

export default About