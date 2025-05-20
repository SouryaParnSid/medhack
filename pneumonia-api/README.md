# Pneumonia Detection API

This is a FastAPI-based API service that uses the original H5 pneumonia detection model for predictions. The API is designed to be deployed to Railway and integrated with the SwasthyaAI frontend application.

## Features

- Loads the original H5 model file directly for predictions
- Provides a REST API endpoint for pneumonia detection
- Processes base64-encoded images
- Returns detailed analysis including prediction confidence, severity, and recommendations
- Includes health check endpoint

## API Endpoints

- `POST /predict` - Submit an image for pneumonia detection
- `GET /health` - Check if the API is running and the model is loaded

## Local Development

1. Make sure you have Python 3.10+ installed
2. Copy the `pneumonia_detection_model.h5` file to this directory
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the server:
   ```
   uvicorn main:app --reload
   ```
5. The API will be available at http://localhost:8000

## Deployment to Railway

### Option 1: Manual Deployment

1. Create a Railway account at [railway.app](https://railway.app/)
2. Install the Railway CLI:
   ```
   npm install -g @railway/cli
   ```
3. Login to Railway:
   ```
   railway login
   ```
4. Initialize a new project:
   ```
   railway init
   ```
5. Deploy the API:
   ```
   railway up
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically deploy your API

## Environment Variables

- `PORT` - The port on which the API will run (default: 8000)

## Integration with SwasthyaAI Frontend

The SwasthyaAI frontend has been updated to call this API instead of using the client-side TensorFlow.js model. The API URL is configured in the frontend using the `NEXT_PUBLIC_PNEUMONIA_API_URL` environment variable.

## Notes

- Make sure the H5 model file is included in the deployment
- The API is designed to handle CORS requests from any origin
- The model is loaded at startup for faster predictions
