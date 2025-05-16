import React from 'react'

const FAQ = () => {
  const features = [
    {
      title: "Perkiraan Ukuran Luka yang Akurat",
      description: "Dapatkan hasil pengukuran luka yang presisi dengan teknologi pemrosesan gambar dan perhitungan canggih.",
      icon: "ri-ruler-line"
    },
    {
      title: "Klasifikasi Jaringan",
      description: "Sistem kami bisa membedakan jenis jaringan pada luka untuk membantu menentukan perawatan yang tepat.",
      icon: "ri-microscope-line"
    },
    {
      title: "Deteksi Luka Otomatis",
      description: "Cukup unggah foto luka — teknologi AI kami akan mendeteksi dan menandai area yang perlu diperhatikan secara otomatis.",
      icon: "ri-ai-generate"
    },
    {
      title: "Prediksi Pemulihan",
      description: "Dapatkan estimasi waktu penyembuhan berdasarkan kondisi luka dan faktor-faktor pasien lainnya.",
      icon: "ri-line-chart-line"
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-3 rounded-full bg-green-50 text-green-700 font-medium text-sm mb-8 shadow-sm">
            Didukung oleh Teknologi Kecerdasan Buatan
          </span>
  
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Analisis Luka Lebih Cerdas, Cepat, dan Mudah
          </h1>
  
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ambil keputusan lebih cepat dan tepat — cukup unggah foto, dan biarkan AI kami membantu merencanakan perawatan yang optimal.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                  <i className={`${feature.icon} ri-2x`}></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ