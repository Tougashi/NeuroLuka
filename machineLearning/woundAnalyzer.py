import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy import ndimage
from skimage import measure
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
import os
from imutils import paths
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

class AnalisisLuka:
    def __init__(self, path_model=None):
        self.rasio_pixel_ke_cm = None
        self.ukuran_referensi_cm = 2.54  # ukuran objek referensi (misal koin)
        
        # Inisialisasi model CNN
        if path_model and os.path.exists(path_model):
            self.model = tf.keras.models.load_model(path_model)
            print("Memuat model CNN yang sudah dilatih")
        else:
            self.model = self.bangun_model_cnn()
            print("Membuat model CNN baru")
    
    def bangun_model_cnn(self):
        """Membangun model CNN gaya U-Net untuk segmentasi luka"""
        # Input gambar
        input = tf.keras.Input(shape=(256, 256, 3))
        
        # Path downsampling
        x = layers.Conv2D(64, 3, padding='same', activation='relu')(input)
        x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
        x = layers.MaxPooling2D(2)(x)
        
        x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
        x = layers.MaxPooling2D(2)(x)
        
        x = layers.Conv2D(256, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(256, 3, padding='same', activation='relu')(x)
        x = layers.MaxPooling2D(2)(x)
        
        # Bagian tengah jaringan
        x = layers.Conv2D(512, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(512, 3, padding='same', activation='relu')(x)
        
        # Path upsampling
        x = layers.UpSampling2D(2)(x)
        x = layers.Conv2D(256, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(256, 3, padding='same', activation='relu')(x)
        
        x = layers.UpSampling2D(2)(x)
        x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
        
        x = layers.UpSampling2D(2)(x)
        x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
        x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
        
        # Output
        output = layers.Conv2D(1, 1, activation='sigmoid')(x)
        
        model = tf.keras.Model(inputs=input, outputs=output)
        
        model.compile(optimizer='adam',
                     loss='binary_crossentropy',
                     metrics=['accuracy', tf.keras.metrics.MeanIoU(num_classes=2)])
        
        return model
    
    def latih_model(self, direktori_gambar, direktori_mask, epochs=50, batch_size=8):
        """Melatih model CNN dengan gambar luka dan mask-nya"""
        # Memuat dan memproses data pelatihan
        daftar_gambar = sorted(list(paths.list_images(direktori_gambar)))
        daftar_mask = sorted(list(paths.list_images(direktori_mask)))
        
        gambar = []
        mask = []
        
        for path_gambar, path_mask in zip(daftar_gambar, daftar_mask):
            img = cv2.imread(path_gambar)
            img = cv2.resize(img, (256, 256))
            img = img / 255.0
            gambar.append(img)
            
            msk = cv2.imread(path_mask, cv2.IMREAD_GRAYSCALE)
            msk = cv2.resize(msk, (256, 256))
            msk = (msk > 127).astype(np.float32)  # Binerisasi mask
            mask.append(msk)
        
        gambar = np.array(gambar)
        mask = np.array(mask)
        mask = np.expand_dims(mask, axis=-1)
        
        # Membagi data untuk validasi
        X_train, X_val, y_train, y_val = train_test_split(
            gambar, mask, test_size=0.2, random_state=42)
        
        # Augmentasi data
        augmentasi = ImageDataGenerator(
            rotation_range=20,
            width_shift_range=0.1,
            height_shift_range=0.1,
            shear_range=0.1,
            zoom_range=0.1,
            horizontal_flip=True,
            fill_mode='nearest')
        
        # Callback untuk pelatihan
        callback = [
            EarlyStopping(patience=10, verbose=1),
            ModelCheckpoint('model_luka_terbaik.keras', save_best_only=True, verbose=1)
        ]
        
        # Melatih model
        riwayat = self.model.fit(
            augmentasi.flow(X_train, y_train, batch_size=batch_size),
            steps_per_epoch=len(X_train) // batch_size,
            epochs=epochs,
            validation_data=(X_val, y_val),
            callbacks=callback)
        
        # Menyimpan model yang sudah dilatih
        self.model.save('model_segmentasi_luka.keras')
        
        return riwayat
    
    def muat_gambar(self, path_gambar):
        """Memuat gambar dari path file"""
        self.gambar_asli = cv2.imread(path_gambar)
        if self.gambar_asli is None:
            raise Exception(f"Tidak dapat memuat gambar dari {path_gambar}")
        self.gambar_kerja = self.gambar_asli.copy()
        return self.gambar_asli
    
    def praproses_gambar(self):
        """Mempersiapkan gambar untuk CNN"""
        # Menyimpan dimensi asli
        self.tinggi_asli, self.lebar_asli = self.gambar_kerja.shape[:2]
        
        # Resize untuk input CNN
        self.input_cnn = cv2.resize(self.gambar_kerja, (256, 256))
        self.input_cnn = self.input_cnn / 255.0
        self.input_cnn = np.expand_dims(self.input_cnn, axis=0)
        
        return self.input_cnn
    
    def kalibrasi_dengan_referensi(self, mask_referensi=None):
        """Kalibrasi menggunakan objek referensi"""
        if mask_referensi is None:
            abu = cv2.cvtColor(self.gambar_kerja, cv2.COLOR_BGR2GRAY)
            lingkaran = cv2.HoughCircles(abu, cv2.HOUGH_GRADIENT, 1, 20,
                                      param1=50, param2=30, minRadius=20, maxRadius=100)
            
            if lingkaran is not None:
                lingkaran = np.uint16(np.around(lingkaran))
                for i in lingkaran[0, :]:
                    area_referensi_pixel = np.pi * (i[2] ** 2)
                    area_referensi_cm2 = np.pi * ((self.ukuran_referensi_cm / 2) ** 2)
                    self.rasio_pixel_ke_cm = area_referensi_cm2 / area_referensi_pixel
                    break
            else:
                print("Peringatan: Gagal mendeteksi referensi otomatis. Menggunakan rasio default")
                self.rasio_pixel_ke_cm = 0.01
        else:
            area_referensi_pixel = np.sum(mask_referensi > 0)
            area_referensi_cm2 = np.pi * ((self.ukuran_referensi_cm / 2) ** 2)
            self.rasio_pixel_ke_cm = area_referensi_cm2 / area_referensi_pixel
        
        return self.rasio_pixel_ke_cm
    
    def segmentasi_luka(self):
        """Segmentasi luka menggunakan CNN"""
        if not hasattr(self, 'input_cnn'):
            raise Exception("Lakukan praproses gambar terlebih dahulu")
        
        # Prediksi dengan CNN
        prediksi_mask = self.model.predict(self.input_cnn)[0]
        prediksi_mask = (prediksi_mask > 0.5).astype(np.uint8) * 255
        
        # Kembalikan ke ukuran asli
        self.mask_luka_akhir = cv2.resize(prediksi_mask, 
                                        (self.lebar_asli, self.tinggi_asli))
        
        # Pasca-pemrosesan
        kernel = np.ones((5,5), np.uint8)
        self.mask_luka_akhir = cv2.morphologyEx(self.mask_luka_akhir, 
                                             cv2.MORPH_OPEN, kernel)
        self.mask_luka_akhir = cv2.morphologyEx(self.mask_luka_akhir, 
                                             cv2.MORPH_CLOSE, kernel)
        
        return self.mask_luka_akhir
    
    def hitung_luas_luka(self):
        """Menghitung luas luka"""
        if not hasattr(self, 'mask_luka_akhir'):
            raise Exception("Mask luka belum dibuat. Jalankan segmentasi_luka() dulu")
        
        if self.rasio_pixel_ke_cm is None:
            print("Peringatan: Menggunakan rasio pixel-ke-cm default")
            self.rasio_pixel_ke_cm = 0.01 
        
        pixel_luka = np.sum(self.mask_luka_akhir > 0)
        self.luas_luka_cm2 = pixel_luka * self.rasio_pixel_ke_cm
        
        # Hitung perimeter untuk metrik tambahan
        kontur, _ = cv2.findContours(self.mask_luka_akhir, 
                                   cv2.RETR_EXTERNAL, 
                                   cv2.CHAIN_APPROX_SIMPLE)
        if kontur:
            self.keliling_luka = cv2.arcLength(kontur[0], True) * np.sqrt(self.rasio_pixel_ke_cm)
        else:
            self.keliling_luka = 0
        
        return self.luas_luka_cm2
    
    def tampilkan_hasil(self):
        """Menampilkan hasil pengukuran"""
        overlay = self.gambar_kerja.copy()
        kontur_luka, _ = cv2.findContours(self.mask_luka_akhir, 
                                        cv2.RETR_EXTERNAL, 
                                        cv2.CHAIN_APPROX_SIMPLE)
        
        cv2.drawContours(overlay, kontur_luka, -1, (0, 255, 0), 2)
        
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 2, 1)
        plt.imshow(cv2.cvtColor(self.gambar_asli, cv2.COLOR_BGR2RGB))
        plt.title('Gambar Asli')
        plt.axis('off')
        
        plt.subplot(2, 2, 2)
        plt.imshow(self.mask_luka_akhir, cmap='gray')
        plt.title('Mask Segmentasi CNN')
        plt.axis('off')
        
        plt.subplot(2, 2, 3)
        plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        plt.title(f'Deteksi Luka\nLuas: {self.luas_luka_cm2:.2f} cm²\nKeliling: {self.keliling_luka:.2f} cm')
        plt.axis('off')
        
        # Tampilkan perhatian CNN (gradient-weighted class activation)
        if hasattr(self, 'input_cnn'):
            self.tampilkan_perhatian_cnn()
            plt.subplot(2, 2, 4)
            plt.imshow(self.peta_perhatian, cmap='jet')
            plt.title('Peta Perhatian CNN')
            plt.axis('off')
        
        plt.tight_layout()
        plt.show()
    
    def tampilkan_perhatian_cnn(self):
        """Membuat peta perhatian menggunakan Grad-CAM"""
        # Ambil layer konvolusi terakhir
        layer_konvolusi_terakhir = next(layer for layer in self.model.layers[::-1] 
                                     if isinstance(layer, layers.Conv2D))
        
        # Buat model yang memetakan input ke aktivasi layer konvolusi terakhir
        model_grad = tf.keras.models.Model(
            [self.model.inputs], [layer_konvolusi_terakhir.output, self.model.output])
        
        # Hitung gradien
        with tf.GradientTape() as tape:
            output_konvolusi, prediksi = model_grad(self.input_cnn)
            loss = prediksi[:, 0]
        
        # Ekstrak filter dan gradien
        output = output_konvolusi[0]
        grads = tape.gradient(loss, output_konvolusi)[0]
        
        # Gabungkan gradien
        weights = tf.reduce_mean(grads, axis=(0, 1))
        cam = tf.reduce_sum(tf.multiply(weights, output), axis=-1)
        
        # Proses CAM
        cam = cv2.resize(cam.numpy(), (256, 256))
        cam = np.maximum(cam, 0)
        cam = cam / cam.max()
        
        # Konversi ke heatmap
        cam = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
        self.peta_perhatian = cv2.cvtColor(cam, cv2.COLOR_BGR2RGB)
        
        return self.peta_perhatian

# Contoh penggunaan:
if __name__ == "__main__":
    # Inisialisasi analyzer (dengan path model opsional)
    analyzer = AnalisisLuka(path_model="model_segmentasi_luka.h5")
    
    # Jika perlu melatih model:
    # analyzer.latih_model("path_ke_gambar", "path_ke_mask", epochs=50)
    
    # Memuat gambar
    path_gambar = "Wound_dataset/Abrasions/abrasions (65).jpg"
    analyzer.muat_gambar(path_gambar)
    
    # Praproses
    analyzer.praproses_gambar()
    
    # Kalibrasi (opsional - butuh objek referensi dalam gambar)
    analyzer.kalibrasi_dengan_referensi()
    
    # Segmentasi luka dengan CNN
    analyzer.segmentasi_luka()
    
    # Hitung luas
    luas_cm2 = analyzer.hitung_luas_luka()
    print(f"Luas luka: {luas_cm2:.2f} cm²")
    
    # Tampilkan hasil
    analyzer.tampilkan_hasil()