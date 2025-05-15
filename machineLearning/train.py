# File: train.py
import torch
import torch.nn as nn
import torch.multiprocessing as mp
from woundAnalyzer import AnalisisLuka

# Add this line to fix multiprocessing issue
if __name__ == "__main__":
    # Optional: For Windows multi-processing
    mp.freeze_support()
    
    # Check if GPU is available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    if torch.cuda.is_available():
        print(f"Menggunakan GPU: {torch.cuda.get_device_name(0)}")
        print(f"Total GPU: {torch.cuda.device_count()}")
        for i in range(torch.cuda.device_count()):
            print(f"  GPU {i}: {torch.cuda.get_device_name(i)}")
            print(f"  Memory: {torch.cuda.get_device_properties(i).total_memory / 1e9:.2f} GB")
    else:
        print("Menggunakan CPU")

    # Initialize the wound analyzer with new model
    analyzer = AnalisisLuka()

    # Train dengan lebih sedikit epoch karena menggunakan pre-trained model
    analyzer.latih_model(
        direktori_gambar="D:/Farid2/Tugas/kalkulus2/UAS/NeuroLuka/machineLearning/Wound_dataset/train_images",
        direktori_mask="D:/Farid2/Tugas/kalkulus2/UAS/NeuroLuka/machineLearning/Wound_dataset/train_masks",
        epochs=30,  # Reduced epochs because we're using pre-trained model
        batch_size=16
    )