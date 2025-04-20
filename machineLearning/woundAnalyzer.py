import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy import ndimage
from skimage import measure

class WoundAnalyzer:
    def __init__(self):
        self.pixel_to_cm_ratio = None  # akan diisi dari objek kalibrasi
        self.reference_size_cm = 2.54  # ukuran objek referensi dalam cm (misalnya koin)
    
    def load_image(self, image_path):
        """Memuat gambar dari path file"""
        self.original_image = cv2.imread(image_path)
        if self.original_image is None:
            raise Exception(f"Tidak dapat memuat gambar dari {image_path}")
        self.working_image = self.original_image.copy()
        return self.original_image
    
    def preprocess_image(self):
        """Preprocessing dasar gambar"""
        # Resize gambar untuk konsistensi
        height, width = self.working_image.shape[:2]
        max_dimension = 800
        if max(height, width) > max_dimension:
            scale = max_dimension / max(height, width)
            self.working_image = cv2.resize(self.working_image, 
                                           (int(width * scale), int(height * scale)))
        
        # Konversi ke LAB color space
        self.lab_image = cv2.cvtColor(self.working_image, cv2.COLOR_BGR2LAB)
        
        # Filter untuk mengurangi noise
        self.working_image = cv2.GaussianBlur(self.working_image, (5, 5), 0)
        
        return self.working_image
    
    def calibrate_with_reference(self, reference_mask=None):
        """
        Kalibrasi menggunakan objek referensi
        Dapat menggunakan objek referensi otomatis atau manual
        """
        if reference_mask is None:
            gray = cv2.cvtColor(self.working_image, cv2.COLOR_BGR2GRAY)
            circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, 20,
                                      param1=50, param2=30, minRadius=20, maxRadius=100)
            
            if circles is not None:
                circles = np.uint16(np.around(circles))
                for i in circles[0, :]:
                    # Gambar lingkaran objek referensi
                    cv2.circle(self.working_image, (i[0], i[1]), i[2], (0, 255, 0), 2)
                    
                    # Hitung rasio pixel-to-cm
                    reference_area_pixels = np.pi * (i[2] ** 2)
                    reference_area_cm2 = np.pi * ((self.reference_size_cm / 2) ** 2)
                    self.pixel_to_cm_ratio = reference_area_cm2 / reference_area_pixels
                    break
            else:
                print("Tidak dapat mendeteksi objek referensi otomatis")
                # Default rasio jika tidak ada kalibrasi
                self.pixel_to_cm_ratio = 0.01  # 1 pixel = 0.01 cm²
        else:
            # Jika mask objek referensi disediakan
            reference_area_pixels = np.sum(reference_mask > 0)
            reference_area_cm2 = np.pi * ((self.reference_size_cm / 2) ** 2)
            self.pixel_to_cm_ratio = reference_area_cm2 / reference_area_pixels
        
        return self.pixel_to_cm_ratio
    
    def segment_wound(self):
        """Segmentasi area luka"""
        # Metode segmentasi warna dasar pada ruang warna LAB
        # Range warna luka dapat disesuaikan berdasarkan dataset
        lower_bound = np.array([0, 145, 130])
        upper_bound = np.array([255, 170, 170])  
        
        # Membuat mask berdasarkan range warna
        wound_mask = cv2.inRange(self.lab_image, lower_bound, upper_bound)
        
        # Operasi morfologi untuk memperbaiki mask
        kernel = np.ones((5,5), np.uint8)
        wound_mask = cv2.morphologyEx(wound_mask, cv2.MORPH_OPEN, kernel)
        wound_mask = cv2.morphologyEx(wound_mask, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(wound_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        

        if contours:
            largest_contour = max(contours, key=cv2.contourArea)

            self.final_wound_mask = np.zeros_like(wound_mask)
            cv2.drawContours(self.final_wound_mask, [largest_contour], 0, 255, -1)
        else:
            self.final_wound_mask = wound_mask
        
        return self.final_wound_mask
    
    def calculate_wound_area(self):
        """Hitung luas luka menggunakan konsep integral"""
        if not hasattr(self, 'final_wound_mask'):
            raise Exception("Wound mask belum dibuat. Jalankan segment_wound() dulu")
        
        if self.pixel_to_cm_ratio is None:
            print("Warning: Rasio pixel-to-cm tidak dikalibrasi. Menggunakan default")
            self.pixel_to_cm_ratio = 0.01 
        
        wound_pixels = np.sum(self.final_wound_mask > 0)
        self.wound_area_cm2 = wound_pixels * self.pixel_to_cm_ratio
        
        return self.wound_area_cm2
    
    def visualize_results(self):
        """Visualisasi hasil pengukuran"""
        # Overlay mask pada gambar asli
        overlay = self.working_image.copy()
        wound_contours, _ = cv2.findContours(self.final_wound_mask, 
                                            cv2.RETR_EXTERNAL, 
                                            cv2.CHAIN_APPROX_SIMPLE)
        
        cv2.drawContours(overlay, wound_contours, -1, (0, 255, 0), 2)
        
        # Tampilkan hasil
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 2, 1)
        plt.imshow(cv2.cvtColor(self.original_image, cv2.COLOR_BGR2RGB))
        plt.title('Gambar Asli')
        plt.axis('off')
        
        plt.subplot(2, 2, 2)
        plt.imshow(self.final_wound_mask, cmap='gray')
        plt.title('Segmentasi Luka')
        plt.axis('off')
        
        plt.subplot(2, 2, 3)
        plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        plt.title(f'Hasil Deteksi\nLuas Luka: {self.wound_area_cm2:.2f} cm²')
        plt.axis('off')
        
        plt.tight_layout()
        plt.show()

# Penggunaan:
if __name__ == "__main__":
    analyzer = WoundAnalyzer()
    
    # Load gambar
    image_path = "Wound_dataset/Abrasions/abrasions (65).jpg"
    analyzer.load_image(image_path)
    
    # Preprocessing
    analyzer.preprocess_image()
    
    # Kalibrasi dengan objek referensi
    analyzer.calibrate_with_reference()
    
    # Segmentasi luka
    analyzer.segment_wound()
    
    # Hitung luas
    area_cm2 = analyzer.calculate_wound_area()
    print(f"Luas luka: {area_cm2:.2f} cm²")
    
    # Visualisasi
    analyzer.visualize_results()