
from woundAnalyzer import AnalisisLuka

analyzer = AnalisisLuka(path_model="./model_segmentasi_luka2.pth")

# Prediksi luka
analyzer.muat_gambar("./Wound_dataset/test.jpg")
analyzer.praproses_gambar()


analyzer.kalibrasi_dengan_referensi(4)  # Sesuaikan dengan jenis koin yang digunakan di foto

# Segmentasi awal dengan model deep learning
analyzer.segmentasi_luka(threshold=0.5, refinement=True)

# Improvisasi deteksi dengan gradasi warna dan pemisahan area tubuh
# Gunakan threshold yang sesuai:
# - 8-12 untuk luka dengan perubahan warna halus
# - 13-17 untuk kasus umum
# - 18-25 untuk luka dengan kontras tinggi
analyzer.improvisasi_deteksi_luka(gradasi_threshold=8)  # Menggunakan threshold yang sesuai untuk deteksi halus tanpa noise

# Hitung luas area luka
luas = analyzer.hitung_luas_luka()

# Tampilkan hasil dengan visualisasi
analyzer.tampilkan_hasil()

print(f"Luas luka pada gambar: {luas:.2f} cm²")
