import requests
import base64
from pathlib import Path
import json
import os

def test_wound_analysis_integration():    # URL of your FastAPI endpoint
    url = "http://localhost:8080/predict"
    
    # Test image path - using absolute path
    test_image_path = Path("d:/Farid2/Tugas/kalkulus2/UAS/NeuroLuka/machineLearning/Wound_dataset/test.jpg")
    
    print(f"Testing with image: {test_image_path}")
    print(f"Image exists: {test_image_path.exists()}")
    
    if not test_image_path.exists():
        print(f"Error: Test image not found at {test_image_path}")
        return False

    try:
        # Open and prepare the image file
        with open(test_image_path, 'rb') as img_file:
            # Prepare the files parameter for the request
            files = {
                'file': ('test.jpg', img_file, 'image/jpeg')
            }
            
            # Print request details
            print("\nSending request to FastAPI endpoint...")
            print(f"URL: {url}")
            print("Request headers:")
            headers = {
                'accept': 'application/json',
            }
            print(json.dumps(headers, indent=2))
            
            # Make the request
            response = requests.post(url, files=files, headers=headers)
            
            # Print response details
            print("\nResponse received:")
            print(f"Status code: {response.status_code}")
            print("Response headers:")
            print(json.dumps(dict(response.headers), indent=2))
            print("\nResponse content:")
            print(response.text[:1000])  # Print first 1000 chars to avoid overwhelming output
            
            # Check if request was successful
            if response.status_code == 200:
                print("\nRequest successful!")
                
                # Parse the response
                result = response.json()
                
                # Check required fields
                required_fields = ['area_cm2', 'segmentation_image', 'confidence']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    print(f"Error: Missing required fields in response: {missing_fields}")
                    return False
                
                # Print results
                print("\nTest Results:")
                print(f"Area: {result['area_cm2']:.2f} cm²")
                print(f"Confidence: {result['confidence']:.2%}")
                print("Segmentation image received successfully")
                
                # Save the segmentation result
                img_data = base64.b64decode(result['segmentation_image'])
                output_path = Path("debug_segmentation_result.png")
                with open(output_path, 'wb') as f:
                    f.write(img_data)
                print(f"\nSaved segmentation result to '{output_path}'")
                
                return True
                
            else:
                print(f"\nError: Request failed with status code {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"\nError during testing: {str(e)}")
        return False

if __name__ == "__main__":
    print("Starting integration test...")
    print("Make sure the FastAPI server is running on http://localhost:8000")
    
    success = test_wound_analysis_integration()
    print("\nIntegration test", "PASSED ✅" if success else "FAILED ❌")
