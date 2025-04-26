# File: train.py
from woundAnalyzer import AnalisisLuka

analyzer = AnalisisLuka()
analyzer.latih_model(
    direktori_gambar="D:/Farid2/Tugas/kalkulus2/UAS/NeuroLuka/machineLearning/Wound_dataset/train_images",
    direktori_mask="D:/Farid2/Tugas/kalkulus2/UAS/NeuroLuka/machineLearning/Wound_dataset/train_masks",
    epochs=50
)