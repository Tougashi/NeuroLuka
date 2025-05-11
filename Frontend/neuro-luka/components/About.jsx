import React from 'react'


const About = () => {
  
  return (
    <div className=" max-w-6xl mx-auto mt-30 px-4 py-12 text-center" id='tentang' >
  
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
    </div>
  )
}

export default About