import requests
import base64
from pathlib import Path
import json
import os

def test_wound_analysis_integration():
    # URL of your FastAPI endpoint
    url = "http://127.0.0.1:8000/predict"
    
    # Test image path
    test_image_path = Path(__file__).parent / "Wound_dataset/test.jpg"
    
    if not test_image_path.exists():
        print(f"Error: Test image not found at {test_image_path}")
        return False

    # Prepare the image file
    files = {
        'file': ('test.jpg', open(test_image_path, 'rb'), 'image/jpeg')
    }

    try:
        # Make the request
        print("Sending request to FastAPI endpoint...")
        response = requests.post(url, files=files)
        
        # Check if request was successful
        if response.status_code == 200:
            print("Request successful!")
            
            # Parse the response
            result = response.json()
            
            # Check required fields
            required_fields = ['area_cm2', 'segmentation_image', 'confidence']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                print(f"Error: Missing required fields in response: {missing_fields}")
                return False
            
            # Validate field types
            if not isinstance(result['area_cm2'], (int, float)):
                print("Error: area_cm2 is not a number")
                return False
            
            if not isinstance(result['segmentation_image'], str):
                print("Error: segmentation_image is not a string")
                return False
            
            if not isinstance(result['confidence'], (int, float)):
                print("Error: confidence is not a number")
                return False
            
            # Try to decode base64 image
            try:
                base64.b64decode(result['segmentation_image'])
                print("Successfully decoded segmentation image")
            except:
                print("Error: Invalid base64 image data")
                return False
            
            # Print results
            print("\nTest Results:")
            print(f"Area: {result['area_cm2']:.2f} cm²")
            print(f"Confidence: {result['confidence']:.2%}")
            print("Segmentation image received successfully")
            
            # Save the segmentation result
            img_data = base64.b64decode(result['segmentation_image'])
            with open('test_segmentation_result.png', 'wb') as f:
                f.write(img_data)
            print("Saved segmentation result to 'test_segmentation_result.png'")
            
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
    print("Starting integration test...")    print("Make sure the FastAPI server is running on http://127.0.0.1:8000")
    
    success = test_wound_analysis_integration()
    print("\nIntegration test", "PASSED ✅" if success else "FAILED ❌")
