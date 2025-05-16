import requests
import base64
from pathlib import Path
import json
import os
import cv2
import numpy as np

def test_wound_analysis():
    # URL of your FastAPI endpoint
    url = "http://127.0.0.1:8080/predict"
    
    # Test image path - using a sample from the dataset
    test_image_path = Path(__file__).parent / "Wound_dataset" / "test.jpg"
    
    if not test_image_path.exists():
        print(f"Error: Test image not found at {test_image_path}")
        return False

    print(f"Using test image: {test_image_path}")

    # Prepare the image file
    files = {
        'file': ('test.jpg', open(test_image_path, 'rb'), 'image/jpeg')
    }

    try:
        # Make the request
        print("\nSending request to FastAPI endpoint...")
        response = requests.post(url, files=files)
        
        # Check if request was successful
        if response.status_code == 200:
            print("Request successful!")
            
            # Parse the response
            result = response.json()
            print("\nAPI Response received:")
            print(f"Area: {result.get('area_cm2', 'N/A')} cm²")
            print(f"Confidence: {result.get('confidence', 'N/A')}")
            
            # Save the segmentation result if available
            if 'segmentation_image' in result:
                try:
                    img_data = base64.b64decode(result['segmentation_image'])
                    output_path = 'test_result.png'
                    with open(output_path, 'wb') as f:
                        f.write(img_data)
                    print(f"\nSaved segmentation result to '{output_path}'")
                    
                    # Read and display some information about the saved image
                    img = cv2.imread(output_path)
                    if img is not None:
                        print(f"Result image size: {img.shape}")
                    else:
                        print("Warning: Could not read the saved image")
                except Exception as e:
                    print(f"Error saving segmentation result: {str(e)}")
            
            return True
        else:
            print(f"Error: Request failed with status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        return False
    finally:
        files['file'][1].close()

if __name__ == "__main__":
    print("Starting wound analysis API test...")
    print("Make sure the FastAPI server is running on http://127.0.0.1:8080")
    
    success = test_wound_analysis()
    print("\nAPI Test:", "PASSED ✅" if success else "FAILED ❌")
