# File: predict.py
from woundAnalyzer import AnalisisLuka

# Muat model yang sudah dilatih
analyzer = AnalisisLuka(path_model="model_segmentasi_luka.h5")

# Langsung prediksi tanpa training
analyzer.muat_gambar("luka_baru.jpg")
analyzer.praproses_gambar()
analyzer.segmentasi_luka()
luas = analyzer.hitung_luas_luka()  # Hasil dalam cm²