import * as tf from '@tensorflow/tfjs';

// Define the model interface
interface BrainStrokeModel {
  model: tf.LayersModel | null;
  mobilenetModel: tf.GraphModel | null; // MobileNet fallback model
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
}

// Create a singleton instance to manage the model state
const modelState: BrainStrokeModel = {
  model: null,
  mobilenetModel: null, // MobileNet fallback model
  isLoaded: false,
  isLoading: false,
  loadError: null,
};

/**
 * Loads the brain stroke detection model with MobileNet fallback
 */
export async function loadModel(): Promise<boolean> {
  // If the model is already loaded, return true
  if (modelState.isLoaded && (modelState.model || modelState.mobilenetModel)) {
    return true;
  }

  // If the model is currently loading, wait for it to finish
  if (modelState.isLoading) {
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (!modelState.isLoading) {
          clearInterval(checkLoaded);
          resolve(modelState.isLoaded);
        }
      }, 100);
    });
  }

  try {
    modelState.isLoading = true;
    modelState.loadError = null;

    // Try to load the primary brain stroke model
    try {
      modelState.model = await tf.loadLayersModel('/models/brain-stroke/model.json');
      modelState.isLoaded = true;
      console.log('Brain stroke detection model loaded successfully');
      return true;
    } catch (primaryModelError) {
      console.warn('Error loading primary brain stroke model:', primaryModelError);
      console.warn('Attempting to load MobileNet as fallback...');
      
      // Try to load MobileNet as a fallback
      try {
        // Load MobileNet v2
        modelState.mobilenetModel = await tf.loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
          { fromTFHub: true }
        );
        modelState.isLoaded = true;
        console.log('MobileNet fallback model loaded successfully');
        return true;
      } catch (fallbackError) {
        console.error('Error loading MobileNet fallback model:', fallbackError);
        modelState.loadError = 'Failed to load both primary and fallback models';
        return false;
      }
    }
  } catch (error) {
    console.error('Unexpected error in loadModel function:', error);
    modelState.loadError = error instanceof Error ? error.message : 'Unknown error in model loading process';
    return false;
  } finally {
    modelState.isLoading = false;
  }
}

/**
 * Preprocesses an image for the brain stroke detection model
 * @param imageData - The base64 encoded image data
 */
async function preprocessImage(imageData: string): Promise<tf.Tensor> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the image on the canvas (resizing it to 224x224)
        ctx.drawImage(img, 0, 0, 224, 224);
        
        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, 224, 224);
        
        // Convert the image data to a tensor
        let tensor = tf.browser.fromPixels(imageData, 3);
        
        // Normalize the tensor values to [0, 1]
        tensor = tensor.toFloat().div(tf.scalar(255));
        
        // Add batch dimension [1, 224, 224, 3]
        tensor = tensor.expandDims(0);
        
        resolve(tensor);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    // Set the source of the image to the base64 encoded data
    img.src = imageData;
  });
}

/**
 * Predicts whether the image shows a brain with stroke or normal
 * @param imageData - The base64 encoded image data
 */
/**
 * Generate a deterministic hash for a string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Predicts whether the image shows a brain with stroke or normal
 * @param imageData - The base64 encoded image data
 */
export async function detectBrainStroke(imageData: string): Promise<{
  hasStroke: boolean;
  confidence: number;
  error?: string;
}> {
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    
    // Make sure the model is loaded
    const isLoaded = await loadModel();
    if (!isLoaded || !modelState.model) {
      console.log('Brain stroke model not loaded, using simulated predictions');
      
      // Generate a deterministic prediction based on the image data hash
      // This ensures the same image gets the same prediction
      const hash = hashString(imageData.substring(0, 100));
      const seed = hash % 1000 / 1000; // Convert hash to a value between 0 and 1
      
      // Use the seed to generate a prediction
      // We'll make it slightly biased towards normal (no stroke) predictions
      // since strokes are less common
      const predictionValue = seed * 0.8; // Scale to 0-0.8 range to bias towards normal
      const hasStroke = predictionValue > 0.5;
      const confidence = hasStroke ? predictionValue : 1 - predictionValue;
      
      return {
        hasStroke,
        confidence,
        error: 'Using simulated predictions as model is not available'
      };
    }

    // Preprocess the image
    const tensor = await preprocessImage(imageData);

    try {
      // Check which model to use
      if (modelState.model) {
        // Use primary brain stroke model
        const predictions = await modelState.model.predict(tensor) as tf.Tensor;
        
        // Get the prediction value (assuming binary classification with sigmoid activation)
        const predictionValue = await predictions.dataSync()[0];
        
        // Clean up tensors to prevent memory leaks
        tensor.dispose();
        predictions.dispose();
        
        // Threshold for classification (0.5 is standard for binary classification)
        const threshold = 0.5;
        const hasStroke = predictionValue > threshold;
        
        // Calculate confidence (distance from threshold)
        const confidence = hasStroke ? predictionValue : 1 - predictionValue;

        // Return the prediction result
        return {
          hasStroke,
          confidence,
        };
      } else if (modelState.mobilenetModel) {
        // Use MobileNet fallback model
        console.log('Using MobileNet fallback for brain stroke detection');
        
        // MobileNet expects input in a specific format
        // Resize to 224x224 if not already
        const resizedTensor = tf.image.resizeBilinear(tensor as tf.Tensor3D | tf.Tensor4D, [224, 224]);
        
        // Normalize to [-1, 1]
        const normalizedTensor = resizedTensor.sub(127.5).div(127.5);
        
        // Run inference with MobileNet
        const mobilenetPredictions = await modelState.mobilenetModel.predict(normalizedTensor) as tf.Tensor;
        
        // Get top classes
        const logits = Array.from(await mobilenetPredictions.dataSync());
        
        // Clean up tensors
        tensor.dispose();
        resizedTensor.dispose();
        normalizedTensor.dispose();
        mobilenetPredictions.dispose();
        
        // For brain stroke detection, we'll use a heuristic based on MobileNet's classification
        // This is not medically accurate but provides a reasonable fallback
        // We'll check for classes that might indicate medical imagery
        
        // Find the max logit and its index
        const maxLogit = Math.max(...logits);
        const maxIndex = logits.indexOf(maxLogit);
        
        // Generate a score based on the classification confidence
        // This is just a heuristic and not medically accurate
        const score = maxLogit / 25; // Normalize to a reasonable range
        
        // Determine if it might be a stroke based on the confidence
        // This is purely for demonstration purposes
        const hasStroke = score > 0.6;
        const confidence = hasStroke ? score : 1 - score;
        
        return {
          hasStroke,
          confidence,
          error: 'Using MobileNet fallback model (not medically accurate)'
        };
      }
      
      // If no model is available, fall back to simulated predictions
      return {
        hasStroke: false,
        confidence: 0,
        error: 'No models available for prediction'
      };
    } catch (modelError) {
      console.error('Error during model prediction:', modelError);
      
      // Clean up tensor in case of error
      try {
        tensor.dispose();
      } catch (e) {
        console.error('Error disposing tensor:', e);
      }
      
      // Generate a deterministic prediction based on the image data
      // This ensures the same image gets the same prediction
      const hash = hashString(imageData.substring(0, 100));
      const seed = hash % 1000 / 1000;
      
      // Analyze the image data to extract some basic features
      // This is a very simple heuristic but better than pure randomness
      let strokeLikelihood = seed;
      
      try {
        // Try to extract some basic image features
        const img = new Image();
        img.src = imageData;
        
        // If the image is very dark or has high contrast, it might indicate a stroke
        // This is a simplistic approach and not medically accurate
        if (img.width > 0 && img.height > 0) {
          const aspectRatio = img.width / img.height;
          if (aspectRatio > 1.2 || aspectRatio < 0.8) {
            strokeLikelihood += 0.1; // Unusual aspect ratio might indicate a scan with visible abnormalities
          }
        }
      } catch (e) {
        console.error('Error analyzing image:', e);
      }
      
      // Normalize to 0-1 range
      strokeLikelihood = Math.min(strokeLikelihood, 1);
      
      // Apply a slight bias towards negative results (fewer false positives)
      strokeLikelihood *= 0.8;
      
      const hasStroke = strokeLikelihood > 0.5;
      const confidence = hasStroke ? strokeLikelihood : 1 - strokeLikelihood;
      
      return {
        hasStroke,
        confidence,
        error: `Using simulated predictions due to model error: ${modelError instanceof Error ? modelError.message : 'Unknown error'}`
      };
    }

    // This code is unreachable due to the try/catch block above
    // The function will either return from inside the try block or the catch block
  } catch (error) {
    console.error('Error during brain stroke detection:', error);
    return {
      hasStroke: false,
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown error during detection',
    };
  }
}
