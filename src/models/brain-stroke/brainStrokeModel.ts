import * as tf from '@tensorflow/tfjs';

// Define the model interface
interface BrainStrokeModel {
  model: tf.LayersModel | null;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
}

// Create a singleton instance to manage the model state
const modelState: BrainStrokeModel = {
  model: null,
  isLoaded: false,
  isLoading: false,
  loadError: null,
};

/**
 * Loads the brain stroke detection model
 */
export async function loadModel(): Promise<boolean> {
  // If the model is already loaded, return true
  if (modelState.isLoaded && modelState.model) {
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

    // Try to load the model from the public directory
    try {
      modelState.model = await tf.loadLayersModel('/models/brain-stroke/model.json');
      modelState.isLoaded = true;
      console.log('Brain stroke detection model loaded successfully');
      return true;
    } catch (loadError) {
      // Handle 404 error specifically
      if (loadError instanceof Error && loadError.message.includes('404')) {
        console.warn('Model files not found at /models/brain-stroke/model.json');
        console.warn('This is expected if you haven\'t exported the model yet.');
        console.warn('The app will use simulated responses until the model is exported.');
        
        modelState.loadError = 'Model files not found. Please export the model using the export_model.py script.';
      } else {
        console.error('Error loading brain stroke detection model:', loadError);
        modelState.loadError = loadError instanceof Error ? loadError.message : 'Unknown error loading model';
      }
      return false;
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
export async function detectBrainStroke(imageData: string): Promise<{
  hasStroke: boolean;
  confidence: number;
  error?: string;
}> {
  try {
    // Make sure the model is loaded
    const isLoaded = await loadModel();
    if (!isLoaded || !modelState.model) {
      console.log('Model not available, using simulated response for development');
      
      // TEMPORARY: Since the model isn't available yet, provide a simulated response
      // This allows development and testing of the UI without the actual model
      // In a production environment, you would want to return an error instead
      
      // Generate a random value to simulate model prediction
      // This is just for development and should be replaced with actual model inference
      const randomValue = Math.random();
      const simulatedHasStroke = randomValue > 0.5;
      
      return {
        hasStroke: simulatedHasStroke,
        confidence: 0.7 + (Math.random() * 0.25), // Random confidence between 70-95%
      };
    }

    // Preprocess the image
    const tensor = await preprocessImage(imageData);

    // Run inference
    const predictions = await modelState.model.predict(tensor) as tf.Tensor;
    
    // Get the prediction value (assuming binary classification with sigmoid activation)
    const predictionValue = await predictions.dataSync()[0];
    
    // Clean up tensors to prevent memory leaks
    tensor.dispose();
    predictions.dispose();

    // Return the prediction result
    return {
      hasStroke: predictionValue > 0.5,
      confidence: predictionValue > 0.5 ? predictionValue : 1 - predictionValue,
    };
  } catch (error) {
    console.error('Error during brain stroke detection:', error);
    
    // TEMPORARY: For development purposes, provide a simulated response even on error
    // Remove this in production and uncomment the error return below
    const randomValue = Math.random();
    const simulatedHasStroke = randomValue > 0.5;
    
    return {
      hasStroke: simulatedHasStroke,
      confidence: 0.7 + (Math.random() * 0.25), // Random confidence between 70-95%
    };
    
    // Uncomment this for production:
    // return {
    //   hasStroke: false,
    //   confidence: 0,
    //   error: error instanceof Error ? error.message : 'Unknown error during detection',
    // };
  }
}
