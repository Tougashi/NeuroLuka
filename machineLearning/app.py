from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import base64
import torch
import cv2
from woundAnalyzer import AnalisisLuka

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=False,  # Set to False since we don't need credentials for FastAPI
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Initialize the analyzer
analyzer = AnalisisLuka(path_model="model_segmentasi_luka2.pth")

# Define wound types and their specific recommendations
WOUND_TYPES = {
    "luka_goresan": {
        "name": "Luka Goresan",
        "recovery_factor": 1.0,
        "recommendations": [
            "Bersihkan luka dengan air bersih atau larutan saline steril",
            "Oleskan antiseptik ringan",
            "Tutup dengan plester atau perban steril",
            "Ganti perban setiap hari atau saat basah"
        ]
    },
    "luka_lecet": {
        "name": "Luka Lecet",
        "recovery_factor": 1.2,
        "recommendations": [
            "Bersihkan luka dengan air bersih",
            "Hindari menggosok area luka",
            "Gunakan salep antibiotik",
            "Tutup dengan perban non-stick"
        ]
    },
    "luka_bakar": {
        "name": "Luka Bakar",
        "recovery_factor": 1.5,
        "recommendations": [
            "Segera dinginkan luka dengan air mengalir",
            "Jangan pecahkan lepuhan",
            "Gunakan salep khusus luka bakar",
            "Tutup dengan perban steril",
            "Hindari paparan sinar matahari"
        ]
    },
    "luka_terpotong": {
        "name": "Luka Terpotong",
        "recovery_factor": 1.3,
        "recommendations": [
            "Tekan luka untuk menghentikan perdarahan",
            "Bersihkan dengan antiseptik",
            "Gunakan plester atau jahitan jika diperlukan",
            "Jaga luka tetap kering"
        ]
    },
    "luka_terbuka": {
        "name": "Luka Terbuka",
        "recovery_factor": 1.4,
        "recommendations": [
            "Bersihkan luka dengan larutan saline",
            "Gunakan salep antibiotik",
            "Tutup dengan perban steril",
            "Ganti perban secara teratur"
        ]
    }
}

@app.post("/predict")
async def predict_wound(file: UploadFile, wound_type: str = None):
    print(f"Received request for file: {file.filename}")
    try:
        # Validate file type
        print(f"File content type: {file.content_type}")
        allowed_types = ["image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/gif"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"Only JPEG, PNG and GIF files are allowed. Got: {file.content_type}")

        # Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL Image to numpy array for OpenCV
        image_np = np.array(image)
        print(f"Input image shape: {image_np.shape}")
        
        # Convert RGB to BGR (OpenCV format)
        if len(image_np.shape) == 3:  # Color image
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
            print("Converted image to BGR format")
        
        # Set the image in analyzer
        analyzer.gambar_asli = image_np
        analyzer.gambar_kerja = image_np.copy()
        
        # Run preprocessing
        print("Running preprocessing...")
        preprocessed = analyzer.praproses_gambar()
        print(f"Preprocessed tensor shape: {preprocessed.shape if preprocessed is not None else 'None'}")
        
        # Try calibration with reference object
        try:
            print("Attempting calibration...")
            ratio = analyzer.kalibrasi_dengan_referensi(diameter_referensi_cm=4)
            print(f"Calibration ratio: {ratio:.4f} cm/pixel")
        except Exception as e:
            print(f"Calibration failed: {str(e)}, using default ratio")
            analyzer.rasio_pixel_ke_cm = 0.01

        # Perform wound segmentation
        print("Performing wound segmentation...")
        mask = analyzer.segmentasi_luka(threshold=0.5, refinement=True)
        print(f"Initial segmentation mask shape: {mask.shape if mask is not None else 'None'}")
        print(f"Non-zero pixels in mask: {np.count_nonzero(mask) if mask is not None else 'None'}")
        
        print("Improving detection...")
        analyzer.improvisasi_deteksi_luka(gradasi_threshold=10)
        print(f"Final mask shape: {analyzer.mask_luka_akhir.shape if hasattr(analyzer, 'mask_luka_akhir') else 'None'}")
        print(f"Final non-zero pixels: {np.count_nonzero(analyzer.mask_luka_akhir) if hasattr(analyzer, 'mask_luka_akhir') else 'None'}")
        
        # Calculate area
        print("Calculating wound area...")
        area_cm2 = analyzer.hitung_luas_luka()
        print(f"Calculated area: {area_cm2:.2f} cm²")
        
        # Analyze wound color and tissue condition
        wound_region = cv2.bitwise_and(image_np, image_np, mask=analyzer.mask_luka_akhir.astype(np.uint8))
        wound_hsv = cv2.cvtColor(wound_region, cv2.COLOR_BGR2HSV)
        
        # Calculate average color in wound region
        wound_colors = wound_hsv[analyzer.mask_luka_akhir > 0]
        if len(wound_colors) > 0:
            avg_hue = np.mean(wound_colors[:, 0])
            avg_saturation = np.mean(wound_colors[:, 1])
            avg_value = np.mean(wound_colors[:, 2])
            
            # Analyze tissue condition based on color
            if avg_value < 60:  # Dark
                tissue_condition = "Jaringan nekrotik (perlu debridement)"
                condition_factor = 2.0
            elif avg_saturation > 150 and avg_value > 150:  # Bright red
                tissue_condition = "Jaringan granulasi (penyembuhan aktif)"
                condition_factor = 1.0
            else:  # Yellow/pale
                tissue_condition = "Jaringan fibrin (perlu perawatan khusus)"
                condition_factor = 1.5
            
            # Calculate recovery time estimation
            base_recovery_days = max(7, area_cm2 * 2)  # Minimal 1 minggu, tambah 2 hari per cm²
            
            # Apply wound type factor if available
            wound_type_factor = 1.0
            recommendations = []
            if wound_type and wound_type in WOUND_TYPES:
                wound_type_info = WOUND_TYPES[wound_type]
                wound_type_factor = wound_type_info["recovery_factor"]
                recommendations = wound_type_info["recommendations"]
            
            total_recovery_days = base_recovery_days * condition_factor * wound_type_factor
            
            area_recovery_time = f"{base_recovery_days:.0f} hari"
            total_recovery_time = f"{total_recovery_days:.0f} hari"
        else:
            tissue_condition = "Tidak dapat menentukan kondisi jaringan"
            area_recovery_time = "Tidak dapat ditentukan"
            total_recovery_time = "Tidak dapat ditentukan"
            recommendations = []
            
        # Create visualization
        h, w = image_np.shape[:2]
        
        # Create colored overlay
        colored_mask = np.zeros_like(image_np)
        if hasattr(analyzer, 'mask_luka_akhir'):
            colored_mask[analyzer.mask_luka_akhir > 0] = [0, 0, 255]  # Red in BGR
            print("Created colored overlay")
        
        # Draw contours for better visualization
        if hasattr(analyzer, 'mask_luka_akhir'):
            contours, _ = cv2.findContours(
                analyzer.mask_luka_akhir.astype(np.uint8), 
                cv2.RETR_EXTERNAL, 
                cv2.CHAIN_APPROX_SIMPLE
            )
            print(f"Found {len(contours)} contours")
        
        # Create result visualization
        result_image = image_np.copy()
        # Add semi-transparent overlay
        cv2.addWeighted(colored_mask, 0.3, result_image, 0.7, 0, result_image)
        if hasattr(analyzer, 'mask_luka_akhir'):
            # Draw contours
            cv2.drawContours(result_image, contours, -1, (0, 255, 0), 2)
        
        # Add text for measurements
        font = cv2.FONT_HERSHEY_SIMPLEX
        text = f"Area: {area_cm2:.2f} cm2"
        cv2.putText(result_image, text, (10, 30), font, 1, (0, 255, 0), 2)
        
        # Convert result image to base64
        result_image_rgb = cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB)
        result_pil = Image.fromarray(result_image_rgb)
        buffered = io.BytesIO()
        result_pil.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # Calculate confidence as mean probability in wound region
        if hasattr(analyzer, 'mask_luka_akhir') and np.any(analyzer.mask_luka_akhir > 0):
            confidence = float(np.mean(analyzer.mask_luka_akhir[analyzer.mask_luka_akhir > 0]))
        else:
            confidence = 0.0
            
        print(f"Analysis complete - Area: {area_cm2:.2f} cm2, Confidence: {confidence:.2%}")
        
        return {
            "area_cm2": float(area_cm2),
            "segmentation_image": img_str,
            "confidence": confidence,
            "tissue_condition": tissue_condition,
            "area_recovery_time": area_recovery_time,
            "total_recovery_time": total_recovery_time,
            "recommendations": recommendations
        }

    except Exception as e:
        print(f"Error during processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
