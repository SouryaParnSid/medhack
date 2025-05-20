from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os
import uvicorn

app = FastAPI(title="Pneumonia Detection API", description="API for pneumonia detection using H5 model")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Model loading
model = None

def load_model():
    global model
    model_path = "pneumonia_detection_model.h5"
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")

# Load model at startup
@app.on_event("startup")
async def startup_event():
    try:
        load_model()
    except Exception as e:
        print(f"Error loading model: {e}")

class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

def preprocess_image(image_data: str):
    # Remove data URL prefix if present
    if 'base64,' in image_data:
        image_data = image_data.split('base64,')[1]
    
    # Decode base64 image
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to expected input size (224x224)
    image = image.resize((224, 224))
    
    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def get_severity(confidence: float):
    if confidence > 0.9:
        return "Severe"
    if confidence > 0.8:
        return "Moderate"
    if confidence > 0.5:
        return "Mild"
    return None

def get_recommendations(confidence: float, severity=None):
    if confidence > 0.5:
        base_recommendations = [
            "Consult with a healthcare provider",
            "Monitor breathing and oxygen levels",
            "Rest and maintain good hydration"
        ]
        
        if severity == "Severe":
            return [
                "⚠️ SEEK IMMEDIATE EMERGENCY CARE",
                "High risk - immediate medical attention required",
                "Prepare for possible hospitalization",
                "Monitor oxygen saturation closely",
                *base_recommendations
            ]
        
        if severity == "Moderate":
            return [
                "Seek urgent medical attention",
                "Begin prescribed treatments promptly",
                "Schedule follow-up chest X-rays",
                *base_recommendations
            ]
        
        return [
            "Schedule medical evaluation",
            *base_recommendations,
            "Follow up with chest X-rays as advised",
            "Complete prescribed medications if given"
        ]
    
    return [
        "Continue normal health monitoring",
        "Maintain good respiratory hygiene",
        "Stay current with vaccinations",
        "Follow up if new symptoms develop"
    ]

@app.post("/predict")
async def predict(request: ImageRequest):
    if not model:
        try:
            load_model()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model not loaded: {str(e)}")
    
    try:
        # Preprocess the image
        processed_image = preprocess_image(request.image)
        
        # Make prediction
        prediction = model.predict(processed_image)
        
        # Get probability for pneumonia (assuming binary classification)
        # Adjust this based on your model's output format
        pneumonia_probability = float(prediction[0][0])
        
        # Determine result
        is_pneumonia = pneumonia_probability > 0.5
        
        # Get severity
        severity = get_severity(pneumonia_probability)
        
        # Generate response
        result = {
            "prediction": "Pneumonia" if is_pneumonia else "Normal",
            "confidence": pneumonia_probability,
            "pneumoniaProbability": pneumonia_probability,
            "details": {
                "lungOpacity": f"{'Increased' if is_pneumonia else 'Normal'} opacity detected in lung fields ({(pneumonia_probability * 100):.1f}% confidence)",
                "infiltrates": "Likely presence of infiltrates" if is_pneumonia else "No significant infiltrates detected",
                "consolidation": "Potential areas of consolidation observed" if is_pneumonia else "No consolidation observed",
                "severity": severity
            },
            "recommendations": get_recommendations(pneumonia_probability, severity)
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
