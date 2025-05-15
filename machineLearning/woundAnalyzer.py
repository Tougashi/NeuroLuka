import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy import ndimage
from skimage import measure, color
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms
import os
from imutils import paths
from PIL import Image
import torchvision.transforms.functional as TF
from tqdm import tqdm 
import segmentation_models_pytorch as smp

class WoundSegmentationModel(nn.Module):
    def __init__(self):
        super(WoundSegmentationModel, self).__init__()
        
        self.model = smp.DeepLabV3Plus(
            encoder_name="resnet50",
            encoder_weights=None,  # Tidak menggunakan pre-trained weights
            in_channels=3,
            classes=1,
        )
    
    def forward(self, x):
        return self.model(x)
        
    def load_state_dict(self, state_dict):
        try:
            super().load_state_dict(state_dict)
        except RuntimeError:
            # Jika gagal, coba load dengan strict=False
            super().load_state_dict(state_dict, strict=False)
            print("Model loaded with some missing or unexpected keys.")

class WoundDataset(Dataset):
    def __init__(self, img_paths, mask_paths, transform=None, augment=False):
        self.img_paths = img_paths
        self.mask_paths = mask_paths
        self.transform = transform
        self.augment = augment
    
    def __len__(self):
        return len(self.img_paths)
    
    def __getitem__(self, idx):
        # Load image dan mask
        image = Image.open(self.img_paths[idx]).convert('RGB')
        mask = Image.open(self.mask_paths[idx]).convert('L')
        
        # Resize ke ukuran standar
        image = image.resize((256, 256), Image.LANCZOS)
        mask = mask.resize((256, 256), Image.NEAREST)
        
        # Data augmentation jika diaktifkan
        if self.augment and torch.rand(1) < 0.5:
            # Random rotasi
            angle = torch.randint(-30, 30, (1,)).item()
            image = TF.rotate(image, angle)
            mask = TF.rotate(mask, angle)
            
            # Random horizontal flip
            if torch.rand(1) < 0.5:
                image = TF.hflip(image)
                mask = TF.hflip(mask)
            
            # Random perubahan brightness dan contrast
            if torch.rand(1) < 0.5:
                brightness = 0.8 + 0.4 * torch.rand(1).item()
                contrast = 0.8 + 0.4 * torch.rand(1).item()
                image = TF.adjust_brightness(image, brightness)
                image = TF.adjust_contrast(image, contrast)
        
        # Convert ke tensor
        image = TF.to_tensor(image)
        mask = TF.to_tensor(mask)
        
        # Normalisasi image
        if self.transform:
            image = self.transform(image)
        
        return image, mask


class AnalisisLuka:
    def __init__(self, path_model=None):
        self.rasio_pixel_ke_cm = None
        self.ukuran_referensi_cm = 2.54  # Ukuran objek referensi (misal koin)
        
        # Setup device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Menggunakan: {self.device}")
        
        # Inisialisasi model DeepLabV3+
        self.model = WoundSegmentationModel().to(self.device)
        
        # Load model jika path disediakan
        if path_model and os.path.exists(path_model):
            self.model.load_state_dict(torch.load(path_model, map_location=self.device, weights_only=True))
            print("Memuat model PyTorch yang sudah dilatih")
            self.model.eval()
        else:
            print("Membuat model PyTorch baru")
    
    def latih_model(self, direktori_gambar, direktori_mask, epochs=100, batch_size=8):
        """Melatih model DeepLabV3+ dengan gambar luka dan mask-nya"""
        # Get all image and mask paths
        daftar_gambar = sorted(list(paths.list_images(direktori_gambar)))
        daftar_mask = sorted(list(paths.list_images(direktori_mask)))
        
        print(f"Total gambar: {len(daftar_gambar)}, Total mask: {len(daftar_mask)}")
        
        # Setup data transforms
        transform = transforms.Compose([
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        
        # Create dataset dengan augmentasi untuk data training
        dataset = WoundDataset(
            daftar_gambar, 
            daftar_mask, 
            transform=transform,
            augment=True  # Aktifkan data augmentation
        )
        
        # Split data untuk training dan validasi
        train_size = int(0.8 * len(dataset))
        val_size = len(dataset) - train_size
        train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
        
        # Create data loaders
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, 
                                 num_workers=0)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, 
                               num_workers=0)
        
        # Setup loss function - Gunakan kombinasi BCEWithLogitsLoss dan Dice Loss
        # untuk hasil segmentasi yang lebih baik
        criterion = CombinedLoss()
        
        # Optimizer dengan learning rate scheduler
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.1, patience=5, verbose=True
        )
        
        # Training setup untuk mixed precision
        scaler = torch.amp.GradScaler() if torch.cuda.is_available() else None
        
        # Gunakan multiple GPUs jika tersedia
        if torch.cuda.device_count() > 1:
            print(f"Menggunakan {torch.cuda.device_count()} GPUs!")
            self.model = nn.DataParallel(self.model)
        
        self.model = self.model.to(self.device)
        
        # Inisialisasi best validation metrics
        best_val_loss = float('inf')
        best_val_dice = 0.0  # Inisialisasi dengan 0 karena Dice Score range adalah 0-1
        progress_format = '{l_bar}{bar:20}{r_bar}{bar:-20b}'
        history = {'train_loss': [], 'val_loss': [], 'train_dice': [], 'val_dice': []}
        
        for epoch in range(epochs):
            # Training phase dengan progress bar
            self.model.train()
            train_loss = 0.0
            train_dice = 0.0
            
            # Progress bar untuk training
            train_loop = tqdm(train_loader, 
                            desc=f'Epoch {epoch+1}/{epochs} [Train]',
                            bar_format=progress_format,
                            leave=False)
            
            for images, masks in train_loop:
                images = images.to(self.device)
                masks = masks.to(self.device)
                
                optimizer.zero_grad()
                
                with torch.amp.autocast(device_type='cuda', dtype=torch.float16):
                    outputs = self.model(images)
                    loss, dice_score = criterion(outputs, masks)
                
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
                
                train_loss += loss.item() * images.size(0)
                train_dice += dice_score.item() * images.size(0)
                
                # Update progress bar
                train_loop.set_postfix(loss=loss.item(), dice=dice_score.item())
            
            train_loss /= len(train_loader.dataset)
            train_dice /= len(train_loader.dataset)
            history['train_loss'].append(train_loss)
            history['train_dice'].append(train_dice)
            
            # Validation phase dengan progress bar
            self.model.eval()
            val_loss = 0.0
            val_dice = 0.0
            
            # Progress bar untuk validation
            val_loop = tqdm(val_loader,
                        desc=f'Epoch {epoch+1}/{epochs} [Val]',
                        bar_format=progress_format,
                        leave=False)
            
            with torch.no_grad():
                for images, masks in val_loop:
                    images = images.to(self.device)
                    masks = masks.to(self.device)
                    
                    outputs = self.model(images)
                    loss, dice_score = criterion(outputs, masks)
                    
                    val_loss += loss.item() * images.size(0)
                    val_dice += dice_score.item() * images.size(0)
                    val_loop.set_postfix(loss=loss.item(), dice=dice_score.item())
            
            val_loss /= len(val_loader.dataset)
            val_dice /= len(val_loader.dataset)
            history['val_loss'].append(val_loss)
            history['val_dice'].append(val_dice)
            
            # Update learning rate berdasarkan val_loss
            scheduler.step(val_loss)
            
            # Print summary per epoch
            print(f'\nEpoch {epoch+1}/{epochs} - '
                f'Train Loss: {train_loss:.4f}, Dice: {train_dice:.4f}, '
                f'Val Loss: {val_loss:.4f}, Dice: {val_dice:.4f}', flush=True)
            
            # Save best model
            if val_dice > best_val_dice or (val_dice == best_val_dice and val_loss < best_val_loss):
                best_val_loss = val_loss
                best_val_dice = val_dice
                torch.save(self.model.state_dict(), 'model_segmentasi_luka2.pth')
                print(f"Model terbaik disimpan! (Loss: {best_val_loss:.4f}, Dice: {best_val_dice:.4f})")
        
        # Pastikan kita load model terbaik setelah training
        self.model.load_state_dict(torch.load('model_segmentasi_luka2.pth', map_location=self.device, weights_only=True))
        self.model.eval()
        
        return history
    
    def muat_gambar(self, path_gambar):
        """Memuat gambar dari path file"""
        self.gambar_asli = cv2.imread(path_gambar)
        if self.gambar_asli is None:
            raise Exception(f"Tidak dapat memuat gambar dari {path_gambar}")
        self.gambar_kerja = self.gambar_asli.copy()
        return self.gambar_asli
    
    def praproses_gambar(self):
        """Mempersiapkan gambar untuk model dengan preprocessing yang lebih baik"""
        # Menyimpan dimensi asli
        self.tinggi_asli, self.lebar_asli = self.gambar_kerja.shape[:2]
        
        # Resize ke ukuran yang model harapkan
        img = cv2.resize(self.gambar_kerja, (256, 256))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Normalisasi - gunakan mean dan std yang sama dengan saat training
        img = img / 255.0
        img = (img - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
        img = img.transpose(2, 0, 1)  # HWC to CHW
        
        # Convert to tensor
        self.input_model = torch.from_numpy(img).float().unsqueeze(0).to(self.device)
        
        return self.input_model
    
    def kalibrasi_dengan_referensi(self, diameter_referensi_cm=2.54):
        """Kalibrasi dengan deteksi referensi otomatis dan validasi jarak pengambilan foto"""
        gray = cv2.cvtColor(self.gambar_kerja, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Get image dimensions
        height, width = self.gambar_kerja.shape[:2]
        min_frame_coverage = 0.15  # Minimal 15% dari lebar frame
        max_frame_coverage = 0.40  # Maksimal 40% dari lebar frame
        
        # Deteksi lingkaran (koin/referensi) dengan parameter yang lebih beragam
        circles = cv2.HoughCircles(
            blurred, cv2.HOUGH_GRADIENT, dp=1.2, 
            minDist=100, param1=50, param2=30, 
            minRadius=30, maxRadius=120
        )
        
        if circles is not None:
            circles = np.uint16(np.around(circles))
            
            # Cari lingkaran terbaik
            best_circle = circles[0][0]
            
            # Hitung persentase coverage dari frame
            circle_diameter = best_circle[2] * 2
            frame_coverage = circle_diameter / width
            
            # Validasi jarak pengambilan foto
            distance_message = ""
            if frame_coverage < min_frame_coverage:
                distance_message = "WARNING: Foto terlalu jauh! Dekatkan kamera (5-10cm dari luka)"
                message_color = (0, 0, 255)  # Merah untuk warning
            elif frame_coverage > max_frame_coverage:
                distance_message = "WARNING: Foto terlalu dekat! Jauhkan kamera sedikit"
                message_color = (0, 0, 255)  # Merah untuk warning
            else:
                distance_message = "Jarak foto optimal (5-10cm)"
                message_color = (0, 255, 0)  # Hijau untuk OK
            
            # Gambar lingkaran terdeteksi untuk verifikasi visual
            cv2.circle(
                self.gambar_kerja, 
                (best_circle[0], best_circle[1]), 
                best_circle[2], (0,255,0), 2
            )
            
            # Tampilkan informasi kalibrasi
            cv2.putText(
                self.gambar_kerja, 
                f"Referensi: {diameter_referensi_cm} cm", 
                (best_circle[0] - best_circle[2], best_circle[1] - best_circle[2] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1
            )
            
            # Tampilkan pesan jarak
            cv2.putText(
                self.gambar_kerja,
                distance_message,
                (10, height - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, message_color, 2
            )
            
            # Hitung rasio pixel ke cm
            pixel_diameter = best_circle[2] * 2
            self.rasio_pixel_ke_cm = diameter_referensi_cm / pixel_diameter
            print(f"Referensi terdeteksi. Rasio: {self.rasio_pixel_ke_cm:.4f} cm/pixel")
            print(distance_message)
        else:
            # Fallback: gunakan nilai default atau manual input
            print("Peringatan: Referensi otomatis tidak terdeteksi. Menggunakan rasio default.")
            self.rasio_pixel_ke_cm = 0.01  # Nilai default
            
        return self.rasio_pixel_ke_cm
    
    def segmentasi_luka(self, threshold=0.5, refinement=True):
        """Segmentasi luka menggunakan model dengan post-processing yang ditingkatkan"""
        if not hasattr(self, 'input_model'):
            raise Exception("Lakukan praproses gambar terlebih dahulu")
        
        # Evaluasi model
        self.model.eval()
        with torch.no_grad():
            output = self.model(self.input_model)
            prediksi_mask = output.cpu().numpy()[0, 0]
        
        # Binerisasi mask dengan threshold yang dapat diatur
        prediksi_mask = (prediksi_mask > threshold).astype(np.uint8) * 255
        
        # Resize ke ukuran asli
        self.mask_luka_akhir = cv2.resize(prediksi_mask, (self.lebar_asli, self.tinggi_asli))
        
        if refinement:
            # Post-processing untuk hasil yang lebih baik
            kernel_open = np.ones((5, 5), np.uint8)
            kernel_close = np.ones((9, 9), np.uint8)
            
            self.mask_luka_akhir = cv2.morphologyEx(self.mask_luka_akhir, cv2.MORPH_OPEN, kernel_open)
            self.mask_luka_akhir = cv2.morphologyEx(self.mask_luka_akhir, cv2.MORPH_CLOSE, kernel_close)
            
            # Fill holes dalam mask
            contours, _ = cv2.findContours(self.mask_luka_akhir, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                # Ambil kontur terbesar
                max_contour = max(contours, key=cv2.contourArea)
                mask_filled = np.zeros_like(self.mask_luka_akhir)
                cv2.drawContours(mask_filled, [max_contour], 0, 255, -1)  # Fill kontur
                self.mask_luka_akhir = mask_filled
        
        return self.mask_luka_akhir
        
    def deteksi_area_tubuh(self, img):
        """Deteksi area tubuh dan memisahkan dari background/baju"""
        # Convert ke YCrCb color space untuk deteksi kulit yang lebih baik
        ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
        
        # Range warna kulit dalam YCrCb
        lower_skin = np.array([0, 135, 85])
        upper_skin = np.array([255, 180, 135])
        
        # Buat mask untuk area kulit
        skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
        
        # Perbaiki mask dengan morphological operations
        kernel = np.ones((5,5), np.uint8)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
        
        return skin_mask

    def improvisasi_deteksi_luka(self, gradasi_threshold=10):
        """Improvisasi deteksi luka menggunakan metode tambahan berbasis warna dengan gradasi threshold"""
        if not hasattr(self, 'gambar_kerja'):
            raise Exception("Gambar belum dimuat")
        
        # Deteksi area tubuh
        skin_mask = self.deteksi_area_tubuh(self.gambar_kerja)
        
        # Convert ke HSV untuk deteksi warna yang lebih baik
        hsv = cv2.cvtColor(self.gambar_kerja, cv2.COLOR_BGR2HSV)
        lab = cv2.cvtColor(self.gambar_kerja, cv2.COLOR_BGR2LAB)
          # Rentang warna untuk luka dengan gradasi threshold        # Warna merah tua untuk luka yang jelas
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        
        # Warna merah muda untuk area luka yang lebih terang
        lower_pink1 = np.array([0, 20, 150])
        upper_pink1 = np.array([10, 150, 255])
        lower_pink2 = np.array([160, 20, 150])
        upper_pink2 = np.array([180, 150, 255])
        
        # Warna pink sangat terang untuk area pinggiran luka
        lower_light_pink1 = np.array([0, 10, 180])
        upper_light_pink1 = np.array([10, 100, 255])
        lower_light_pink2 = np.array([160, 10, 180])
        upper_light_pink2 = np.array([180, 100, 255])
        
        # Warna kemerahan untuk area inflamasi
        lower_inflamed = np.array([0, 30, 150])
        upper_inflamed = np.array([20, 150, 255])        # Mask untuk berbagai tingkat warna luka
        mask_red1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask_red2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask_pink1 = cv2.inRange(hsv, lower_pink1, upper_pink1)
        mask_pink2 = cv2.inRange(hsv, lower_pink2, upper_pink2)
        mask_light_pink1 = cv2.inRange(hsv, lower_light_pink1, upper_light_pink1)
        mask_light_pink2 = cv2.inRange(hsv, lower_light_pink2, upper_light_pink2)
        mask_inflamed = cv2.inRange(hsv, lower_inflamed, upper_inflamed)
        
        # Gabungkan semua mask dengan prioritas
        mask_combined = cv2.bitwise_or(mask_red1, mask_red2)
        mask_combined = cv2.bitwise_or(mask_combined, mask_pink1)
        mask_combined = cv2.bitwise_or(mask_combined, mask_pink2)
        mask_combined = cv2.bitwise_or(mask_combined, mask_light_pink1)
        mask_combined = cv2.bitwise_or(mask_combined, mask_light_pink2)
        mask_combined = cv2.bitwise_or(mask_combined, mask_inflamed)
        
        # Tambahkan morphological operations untuk menghaluskan mask
        kernel_small = np.ones((3,3), np.uint8)
        kernel_medium = np.ones((5,5), np.uint8)
        
        # Tutup gap kecil
        mask_combined = cv2.morphologyEx(mask_combined, cv2.MORPH_CLOSE, kernel_medium)
        
        # Hilangkan noise
        mask_combined = cv2.morphologyEx(mask_combined, cv2.MORPH_OPEN, kernel_small)
        
        # Tambahkan adaptif thresholding untuk area dengan gradasi subtle
        gray = cv2.cvtColor(self.gambar_kerja, cv2.COLOR_BGR2GRAY)
        adaptive_thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                             cv2.THRESH_BINARY_INV, 11, 2)
        # Kombinasikan dengan mask warna
        mask_combined = cv2.bitwise_or(mask_combined, adaptive_thresh)
        
        # Analisis gradasi warna
        l_channel = lab[:,:,0]
        a_channel = lab[:,:,1]  # Merah-Hijau
        b_channel = lab[:,:,2]  # Biru-Kuning
        
        # Hitung gradien warna
        gradient_a = cv2.Sobel(a_channel, cv2.CV_64F, 1, 1, ksize=3)
        gradient_b = cv2.Sobel(b_channel, cv2.CV_64F, 1, 1, ksize=3)
        gradient_magnitude = np.sqrt(gradient_a**2 + gradient_b**2)
        
        # Buat mask gradasi
        gradasi_mask = (gradient_magnitude > gradasi_threshold).astype(np.uint8) * 255
        
        # Kombinasikan mask warna dengan mask gradasi
        mask_combined = cv2.bitwise_and(mask_combined, gradasi_mask)
        
        # Aplikasikan mask area tubuh
        mask_combined = cv2.bitwise_and(mask_combined, skin_mask)
        
        # Post-processing
        kernel = np.ones((5, 5), np.uint8)
        mask_combined = cv2.morphologyEx(mask_combined, cv2.MORPH_OPEN, kernel)
        mask_combined = cv2.morphologyEx(mask_combined, cv2.MORPH_CLOSE, kernel)
        
        if hasattr(self, 'mask_luka_akhir'):
            # Gabungkan dengan hasil segmentasi model
            self.mask_luka_akhir = cv2.bitwise_or(self.mask_luka_akhir, mask_combined)
            
            # Post-processing final
            kernel_final = np.ones((7, 7), np.uint8)
            self.mask_luka_akhir = cv2.morphologyEx(self.mask_luka_akhir, cv2.MORPH_CLOSE, kernel_final)
            
            # Fill holes dalam mask
            temp_mask = self.mask_luka_akhir.copy()
            h, w = temp_mask.shape[:2]
            mask = np.zeros((h+2, w+2), np.uint8)
            cv2.floodFill(temp_mask, mask, (0,0), 255)
            filled_mask = cv2.bitwise_not(temp_mask)
            self.mask_luka_akhir = cv2.bitwise_or(self.mask_luka_akhir, filled_mask)
        else:
            self.mask_luka_akhir = mask_combined
        
        return self.mask_luka_akhir
    
    def hitung_luas_luka(self):
        """Menghitung luas luka dengan metode yang lebih akurat"""
        if not hasattr(self, 'mask_luka_akhir'):
            raise Exception("Mask luka belum dibuat. Jalankan segmentasi_luka() dulu")
        
        if self.rasio_pixel_ke_cm is None:
            print("Peringatan: Menggunakan rasio pixel-ke-cm default")
            self.rasio_pixel_ke_cm = 0.01  # Default rasio
        
        # Hitung area dalam pixel
        pixel_luka = np.sum(self.mask_luka_akhir > 0)
        
        # Konversi ke cm²
        self.luas_luka_cm2 = pixel_luka * (self.rasio_pixel_ke_cm ** 2)
        
        # Hitung perimeter
        kontur, _ = cv2.findContours(self.mask_luka_akhir, 
                                   cv2.RETR_EXTERNAL, 
                                   cv2.CHAIN_APPROX_SIMPLE)
        if kontur:
            self.keliling_luka = cv2.arcLength(kontur[0], True) * self.rasio_pixel_ke_cm
        else:
            self.keliling_luka = 0
        
        return self.luas_luka_cm2

    def tampilkan_hasil(self):
        """Menampilkan hasil pengukuran dengan visualisasi yang lebih detail"""
        overlay = self.gambar_kerja.copy()
        kontur_luka, _ = cv2.findContours(self.mask_luka_akhir, 
                                        cv2.RETR_EXTERNAL, 
                                        cv2.CHAIN_APPROX_SIMPLE)
        
        cv2.drawContours(overlay, kontur_luka, -1, (0, 255, 0), 2)
        
        plt.figure(figsize=(14, 10))
        
        plt.subplot(2, 2, 1)
        plt.imshow(cv2.cvtColor(self.gambar_asli, cv2.COLOR_BGR2RGB))
        plt.title('Gambar Asli')
        plt.axis('off')
        
        plt.subplot(2, 2, 2)
        plt.imshow(self.mask_luka_akhir, cmap='gray')
        plt.title('Mask Segmentasi')
        plt.axis('off')
        
        plt.subplot(2, 2, 3)
        plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        plt.title(f'Deteksi Luka\nLuas: {self.luas_luka_cm2:.2f} cm²\nKeliling: {self.keliling_luka:.2f} cm')
        plt.axis('off')
        
        # Tambahan: Visualisasi peta perhatian atau overlay warna
        if hasattr(self, 'input_model'):
            # Buat visualisasi sederhana
            colored_mask = np.zeros_like(self.gambar_asli)
            colored_mask[self.mask_luka_akhir > 0] = [0, 255, 0]  # Area luka berwarna hijau
            alpha = 0.5
            blended = cv2.addWeighted(self.gambar_asli, 1-alpha, colored_mask, alpha, 0)
            
            plt.subplot(2, 2, 4)
            plt.imshow(cv2.cvtColor(blended, cv2.COLOR_BGR2RGB))
            plt.title('Overlay Segmentasi')
            plt.axis('off')
        
        plt.tight_layout()
        plt.show()
        
        # Simpan hasil pengukuran dan visualisasi
        cv2.imwrite('hasil_segmentasi.png', self.mask_luka_akhir)
        cv2.imwrite('hasil_deteksi.png', overlay)
        print(f"Hasil segmentasi dan deteksi berhasil disimpan.")


class CombinedLoss(nn.Module):
    """Kombinasi BCE dan Dice Loss untuk hasil segmentasi yang lebih baik"""
    def __init__(self, bce_weight=0.5):
        super(CombinedLoss, self).__init__()
        self.bce_weight = bce_weight
        self.bce_loss = nn.BCEWithLogitsLoss()
        
    def forward(self, inputs, targets):
        # Binary Cross Entropy Loss
        bce_loss = self.bce_loss(inputs, targets)
        
        # Dice Loss
        inputs_sigmoid = torch.sigmoid(inputs)
        smooth = 1.0
        
        intersection = (inputs_sigmoid * targets).sum(dim=(2,3))
        union = inputs_sigmoid.sum(dim=(2,3)) + targets.sum(dim=(2,3))
        
        dice_score = (2. * intersection + smooth) / (union + smooth)
        dice_loss = 1 - dice_score.mean()
        
        # Combined loss
        loss = self.bce_weight * bce_loss + (1 - self.bce_weight) * dice_loss
        
        return loss, dice_score.mean()