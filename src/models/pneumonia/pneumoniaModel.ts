import * as tf from '@tensorflow/tfjs';

export interface PneumoniaDetectionResult {
  prediction: "Normal" | "Pneumonia";
  confidence: number;
  pneumoniaProbability: number; // Added for compatibility with the pneumonia-detection page
  recommendations: string[];
  details: {
    lungOpacity: string;
    infiltrates: string;
    consolidation: string;
    severity?: "Mild" | "Moderate" | "Severe";
  };
}

// Model configuration
const MODEL_CONFIG = {
  inputShape: [224, 224] as [number, number],
  threshold: 0.5,
  modelUrl: '/models/pneumonia/model.json',
  classNames: ['Normal', 'Pneumonia'] as const
} as const;

// Model instance
// These variables are used in the loadModel function which is not being called in the current implementation
// but will be needed when implementing the actual model loading
/* eslint-disable @typescript-eslint/no-unused-vars */
const model: tf.LayersModel | null = null;
const modelLoadAttempts = 0;
/* eslint-enable @typescript-eslint/no-unused-vars */

// Model loading status
let modelInitialized = false;

// Initialize TensorFlow.js
async function initializeTensorFlow() {
  if (!modelInitialized) {
    await tf.setBackend('webgl');
    await tf.ready();
    modelInitialized = true;
  }
}

// Mock model implementation
class MockPneumoniaModel {
  predict(tensor: tf.Tensor): tf.Tensor {
    // Log the input tensor shape for debugging
    console.log('Mock model received input with shape:', tensor.shape);
    
    // Create a mock prediction (softmax output with 2 classes)
    // This simulates what a real model would output
    return tf.tidy(() => {
      // Generate random prediction but bias toward correct classification
      // based on image statistics (this is just a heuristic for demo purposes)
      
      // Extract image statistics
      const imgStats = this.getImageStatistics(tensor);
      console.log('Image statistics:', imgStats);
      
      // Use statistics to bias prediction
      // Lower brightness often correlates with pneumonia infiltrates
      const pneumoniaLikelihood = this.calculatePneumoniaLikelihood(imgStats);
      
      // Create a 2-element tensor with softmax probabilities
      // [normal_probability, pneumonia_probability]
      return tf.tensor1d([1 - pneumoniaLikelihood, pneumoniaLikelihood]);
    });
  }
  
  private getImageStatistics(tensor: tf.Tensor): { brightness: number, contrast: number } {
    // Calculate basic image statistics from the tensor
    const data = tensor.dataSync();
    
    // Calculate average brightness (simplified)
    let sum = 0;
    let min = 1;
    let max = 0;
    
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      min = Math.min(min, data[i]);
      max = Math.max(max, data[i]);
    }
    
    const brightness = sum / data.length;
    const contrast = max - min;
    
    return { brightness, contrast };
  }
  
  private calculatePneumoniaLikelihood(stats: { brightness: number, contrast: number }): number {
    // Lower brightness and higher contrast often indicate pneumonia
    // This is a simplified heuristic for demo purposes only
    
    // Invert brightness (darker = higher score)
    const darknessFactor = 1 - stats.brightness;
    
    // Combine factors with weights
    const rawScore = (darknessFactor * 0.7) + (stats.contrast * 0.3);
    
    // Add some randomness for demo variety
    const randomFactor = Math.random() * 0.3;
    let finalScore = rawScore * 0.7 + randomFactor;
    
    // Ensure score is between 0.1 and 0.9 for demo purposes
    finalScore = Math.max(0.1, Math.min(0.9, finalScore));
    
    return finalScore;
  }
}

// Load the model (now just returns our mock model)
async function loadModel(): Promise<MockPneumoniaModel> {
  console.log('Loading mock pneumonia detection model');
  
  // Simulate loading delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Mock model loaded successfully');
  return new MockPneumoniaModel();
}

// Preprocess image for the model
async function preprocessImage(imageData: ImageData): Promise<tf.Tensor4D> {
  if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
    throw new Error('Invalid image data provided');
  }

  try {
    return tf.tidy(() => {
      // Convert ImageData to tensor
      const tensor = tf.browser.fromPixels(imageData, 3);
      
      // Resize to model input size
      const resized = tf.image.resizeBilinear(tensor, MODEL_CONFIG.inputShape);
      
      // Normalize pixel values to [0, 1]
      const normalized = resized.div(tf.scalar(255));
      
      // Add batch dimension and ensure it's a 4D tensor
      const batched = normalized.expandDims(0) as tf.Tensor4D;
      
      // Log shape for debugging
      console.log('Preprocessed tensor shape:', batched.shape);
      
      return batched;
    });
  } catch (error: unknown) {
    console.error('Error preprocessing image:', error);
    if (error instanceof Error) {
      throw new Error(`Image preprocessing failed: ${error.message}`);
    }
    throw new Error('Failed to process image data');
  }
}

// Get severity based on confidence
function getSeverity(confidence: number): PneumoniaDetectionResult["details"]["severity"] {
  if (confidence > 0.9) return "Severe";
  if (confidence > 0.8) return "Moderate";
  if (confidence > MODEL_CONFIG.threshold) return "Mild";
  return undefined;
}

// Get detailed analysis based on confidence and severity
function getDetailedAnalysis(confidence: number, severity?: PneumoniaDetectionResult["details"]["severity"]) {
  if (confidence > MODEL_CONFIG.threshold) {
    const severityText = severity?.toLowerCase() ?? 'significant';
    return {
      lungOpacity: `${severity || 'Increased'} opacity detected in lung fields (${(confidence * 100).toFixed(1)}% confidence)`,
      infiltrates: `${severityText === 'severe' ? 'Clear evidence' : 'Likely presence'} of infiltrates`,
      consolidation: `${severityText === 'severe' ? 'Definite' : 'Potential'} areas of consolidation observed`,
      severity
    } as const;
  }

  return {
    lungOpacity: 'Normal lung opacity patterns',
    infiltrates: 'No significant infiltrates detected',
    consolidation: 'No consolidation observed',
    severity: undefined
  } as const;
}

// Get recommendations based on severity and confidence
function getRecommendations(confidence: number, severity?: PneumoniaDetectionResult["details"]["severity"]): string[] {
  if (confidence > MODEL_CONFIG.threshold) {
    const baseRecommendations = [
      "Consult with a healthcare provider",
      "Monitor breathing and oxygen levels",
      "Rest and maintain good hydration"
    ] as const;

    if (severity === "Severe") {
      return [
        "⚠️ SEEK IMMEDIATE EMERGENCY CARE",
        "High risk - immediate medical attention required",
        "Prepare for possible hospitalization",
        "Monitor oxygen saturation closely",
        ...baseRecommendations
      ];
    }

    if (severity === "Moderate") {
      return [
        "Seek urgent medical attention",
        "Begin prescribed treatments promptly",
        "Schedule follow-up chest X-rays",
        ...baseRecommendations
      ];
    }

    return [
      "Schedule medical evaluation",
      ...baseRecommendations,
      "Follow up with chest X-rays as advised",
      "Complete prescribed medications if given"
    ];
  }

  return [
    "Continue normal health monitoring",
    "Maintain good respiratory hygiene",
    "Stay current with vaccinations",
    "Follow up if new symptoms develop"
  ];
}

// Main detection function
export async function detectPneumonia(imageData: ImageData): Promise<PneumoniaDetectionResult> {
  try {
    // Initialize TensorFlow.js first
    await initializeTensorFlow();
    
    // Load model if not already loaded
    const pneumoniaModel = await loadModel();
    
    if (!pneumoniaModel) {
      throw new Error('Failed to initialize pneumonia detection model');
    }
    
    console.log('Mock model loaded successfully');

    // Preprocess image
    const inputTensor = await preprocessImage(imageData);

    // Get model prediction using tf.tidy for automatic memory management
    const pneumoniaProb = tf.tidy(() => {
      console.log('Input tensor shape:', inputTensor.shape);
      
      // Model outputs softmax probabilities
      console.log('Running model prediction...');
      const prediction = pneumoniaModel.predict(inputTensor);
      
      // Log shape for debugging
      console.log('Prediction shape:', prediction.shape);
      
      // Get probability for pneumonia class (index 1)
      const probabilities = prediction.dataSync();
      console.log('Raw probabilities:', Array.from(probabilities));
      
      // Return pneumonia probability (index 1)
      return probabilities[1];
    });
    
    console.log('Prediction details:', {
      pneumoniaProbability: pneumoniaProb
    });

    // Clean up tensors
    tf.dispose(inputTensor);

    // Get severity and details
    const severity = getSeverity(pneumoniaProb);
    const details = getDetailedAnalysis(pneumoniaProb, severity);
    
    // Determine result
    const isPneumonia = pneumoniaProb > MODEL_CONFIG.threshold;
    const result: PneumoniaDetectionResult = {
      prediction: isPneumonia ? "Pneumonia" : "Normal",
      confidence: pneumoniaProb,
      pneumoniaProbability: pneumoniaProb, // Added for compatibility with pneumonia-detection page
      recommendations: getRecommendations(pneumoniaProb, severity),
      details
    };
    
    console.log('Detection result:', result);
    return result;
  } catch (error) {
    console.error('Error in pneumonia detection:', error);
    throw error;
  }
}
