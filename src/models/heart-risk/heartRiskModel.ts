import * as tf from '@tensorflow/tfjs';

// Define the model interface
interface HeartRiskModel {
  model: tf.LayersModel | null;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  featureNames: string[];
}

// Create a singleton instance to manage the model state
const modelState: HeartRiskModel = {
  model: null,
  isLoaded: false,
  isLoading: false,
  loadError: null,
  featureNames: []
};

/**
 * Loads the heart risk prediction model
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
      // Load the model
      modelState.model = await tf.loadLayersModel('/models/heart-risk/model.json');
      
      // Load feature names
      try {
        const featureResponse = await fetch('/models/heart-risk/feature_names.json');
        const featureData = await featureResponse.json();
        modelState.featureNames = Object.values(featureData);
      } catch (featureError) {
        console.warn('Could not load feature names:', featureError);
        // Default feature names if not available
        modelState.featureNames = [
          'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
          'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ];
      }
      
      modelState.isLoaded = true;
      console.log('Heart risk prediction model loaded successfully');
      return true;
    } catch (loadError) {
      // Handle 404 error specifically
      if (loadError instanceof Error && loadError.message.includes('404')) {
        console.warn('Model files not found at /models/heart-risk/model.json');
        console.warn('This is expected if you haven\'t converted the model yet.');
        console.warn('The app will use simulated responses until the model is converted.');
        
        modelState.loadError = 'Model files not found. Please run the convert_heart_risk_model.py script.';
      } else {
        console.error('Error loading heart risk prediction model:', loadError);
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
 * Predicts heart disease risk based on patient data
 * @param patientData - Object containing patient health metrics
 */
export async function predictHeartRisk(patientData: {
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical' | 'atypical' | 'nonAnginal' | 'asymptomatic';
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  restingECG: 'normal' | 'stWaveAbnormality' | 'leftVentricularHypertrophy';
  maxHR: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 'upsloping' | 'flat' | 'downsloping';
  majorVessels: number;
  thalassemia: 'normal' | 'fixedDefect' | 'reversibleDefect';
}): Promise<{
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  recommendations: string[];
  error?: string;
}> {
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    
    // Make sure the model is loaded
    const isLoaded = await loadModel();
    if (!isLoaded || !modelState.model) {
      console.error('Heart risk model not loaded');
      return {
        riskScore: 0,
        riskLevel: 'Low',
        recommendations: ['Please consult a healthcare professional for a proper assessment.'],
        error: 'Model not available. Please ensure the model is properly converted and available.'
      };
    }

    // Preprocess the input data
    const inputTensor = preprocessInput(patientData);
    
    // Run inference with the model
    const predictions = await modelState.model.predict(inputTensor) as tf.Tensor;
    
    // Get the prediction value (assuming binary classification with sigmoid activation)
    const riskScore = await predictions.dataSync()[0];
    
    // Clean up tensors to prevent memory leaks
    inputTensor.dispose();
    predictions.dispose();

    // Determine risk level based on the risk score
    const riskLevel = determineRiskLevel(riskScore);
    
    // Get recommendations based on risk level
    const recommendations = getRecommendations(riskLevel, patientData);

    // Return the prediction result
    return {
      riskScore,
      riskLevel,
      recommendations
    };
  } catch (error) {
    console.error('Error during heart risk prediction:', error);
    return {
      riskScore: 0,
      riskLevel: 'Low',
      recommendations: ['Please consult a healthcare professional for a proper assessment.'],
      error: error instanceof Error ? error.message : 'Unknown error during prediction'
    };
  }
}

/**
 * Preprocesses the input data for the model
 */
function preprocessInput(patientData: any): tf.Tensor {
  // Convert categorical variables to numerical
  const sex = patientData.sex === 'male' ? 1 : 0;
  
  // Map chest pain type to numerical value
  let chestPainType = 0;
  switch (patientData.chestPainType) {
    case 'typical': chestPainType = 0; break;
    case 'atypical': chestPainType = 1; break;
    case 'nonAnginal': chestPainType = 2; break;
    case 'asymptomatic': chestPainType = 3; break;
  }
  
  // Map resting ECG to numerical value
  let restingECG = 0;
  switch (patientData.restingECG) {
    case 'normal': restingECG = 0; break;
    case 'stWaveAbnormality': restingECG = 1; break;
    case 'leftVentricularHypertrophy': restingECG = 2; break;
  }
  
  // Convert exercise angina to numerical
  const exerciseAngina = patientData.exerciseAngina ? 1 : 0;
  
  // Map ST slope to numerical value
  let stSlope = 0;
  switch (patientData.stSlope) {
    case 'upsloping': stSlope = 0; break;
    case 'flat': stSlope = 1; break;
    case 'downsloping': stSlope = 2; break;
  }
  
  // Map thalassemia to numerical value
  let thalassemia = 0;
  switch (patientData.thalassemia) {
    case 'normal': thalassemia = 0; break;
    case 'fixedDefect': thalassemia = 1; break;
    case 'reversibleDefect': thalassemia = 2; break;
  }
  
  // Create input array in the order expected by the model
  const inputArray = [
    patientData.age,
    sex,
    chestPainType,
    patientData.restingBP,
    patientData.cholesterol,
    patientData.fastingBS,
    restingECG,
    patientData.maxHR,
    exerciseAngina,
    patientData.oldpeak,
    stSlope,
    patientData.majorVessels,
    thalassemia
  ];
  
  // Create tensor from array
  return tf.tensor2d([inputArray]);
}

/**
 * Determines the risk level based on the risk score
 */
function determineRiskLevel(riskScore: number): 'Low' | 'Moderate' | 'High' | 'Very High' {
  if (riskScore < 0.25) {
    return 'Low';
  } else if (riskScore < 0.5) {
    return 'Moderate';
  } else if (riskScore < 0.75) {
    return 'High';
  } else {
    return 'Very High';
  }
}

/**
 * Gets recommendations based on risk level and patient data
 */
function getRecommendations(riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High', patientData: any): string[] {
  const baseRecommendations = [
    'Maintain a healthy diet rich in fruits, vegetables, and whole grains.',
    'Engage in regular physical activity (at least 150 minutes of moderate exercise per week).',
    'Avoid smoking and limit alcohol consumption.',
    'Manage stress through relaxation techniques, meditation, or yoga.'
  ];
  
  const highRiskRecommendations = [
    'Schedule a follow-up appointment with a cardiologist.',
    'Consider a comprehensive cardiac evaluation including stress test and echocardiogram.',
    'Monitor blood pressure and cholesterol levels regularly.',
    'Discuss medication options with your healthcare provider.'
  ];
  
  const veryHighRiskRecommendations = [
    '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
    'Urgent consultation with a cardiologist is recommended.',
    'Follow a strict heart-healthy diet and exercise regimen as prescribed by your doctor.',
    'Adhere strictly to all prescribed medications.'
  ];
  
  // Add specific recommendations based on patient data
  const specificRecommendations: string[] = [];
  
  if (patientData.cholesterol > 200) {
    specificRecommendations.push('Your cholesterol level is elevated. Consider dietary changes and possibly medication to lower cholesterol.');
  }
  
  if (patientData.restingBP > 140) {
    specificRecommendations.push('Your blood pressure is elevated. Monitor regularly and consider lifestyle modifications or medication.');
  }
  
  if (patientData.fastingBS > 120) {
    specificRecommendations.push('Your blood sugar level is elevated. Monitor glucose levels and consider consulting with an endocrinologist.');
  }
  
  // Combine recommendations based on risk level
  if (riskLevel === 'Low') {
    return [...baseRecommendations, ...specificRecommendations];
  } else if (riskLevel === 'Moderate') {
    return [...baseRecommendations, ...specificRecommendations, 'Schedule a regular check-up with your primary care physician.'];
  } else if (riskLevel === 'High') {
    return [...baseRecommendations, ...highRiskRecommendations, ...specificRecommendations];
  } else {
    return [...veryHighRiskRecommendations, ...specificRecommendations];
  }
}

/**
 * Gets detailed information about heart disease risk factors
 */
export function getHeartRiskInfo(): {
  riskFactors: { name: string; description: string }[];
  preventionTips: string[];
  warningSignsOfHeartAttack: string[];
} {
  return {
    riskFactors: [
      {
        name: 'Age',
        description: 'Risk increases with age, particularly after 45 for men and 55 for women.'
      },
      {
        name: 'Sex',
        description: 'Men generally have a higher risk than women, though women\'s risk increases after menopause.'
      },
      {
        name: 'Family History',
        description: 'Risk is higher if a close relative had heart disease at an early age.'
      },
      {
        name: 'Smoking',
        description: 'Damages blood vessels, reduces oxygen in blood, and raises blood pressure.'
      },
      {
        name: 'High Blood Pressure',
        description: 'Forces the heart to work harder, causing it to enlarge and weaken over time.'
      },
      {
        name: 'High Cholesterol',
        description: 'Contributes to plaque buildup in arteries, restricting blood flow.'
      },
      {
        name: 'Diabetes',
        description: 'Increases risk of heart disease by affecting blood vessels and heart function.'
      },
      {
        name: 'Obesity',
        description: 'Increases strain on the heart and contributes to other risk factors.'
      },
      {
        name: 'Physical Inactivity',
        description: 'Contributes to obesity and other risk factors for heart disease.'
      },
      {
        name: 'Stress',
        description: 'May contribute to high blood pressure and other risk factors.'
      }
    ],
    preventionTips: [
      'Maintain a healthy diet rich in fruits, vegetables, whole grains, and lean proteins.',
      'Exercise regularly, aiming for at least 150 minutes of moderate activity per week.',
      'Avoid tobacco products and limit alcohol consumption.',
      'Manage stress through relaxation techniques, adequate sleep, and social connections.',
      'Monitor and control blood pressure, cholesterol, and blood sugar levels.',
      'Maintain a healthy weight through diet and exercise.',
      'Take medications as prescribed by your healthcare provider.',
      'Attend regular check-ups with your healthcare provider.',
      'Know your family history of heart disease.',
      'Learn the warning signs of heart attack and stroke.'
    ],
    warningSignsOfHeartAttack: [
      'Chest pain or discomfort that may feel like pressure, squeezing, fullness, or pain.',
      'Pain or discomfort in one or both arms, the back, neck, jaw, or stomach.',
      'Shortness of breath, which may occur with or without chest discomfort.',
      'Breaking out in a cold sweat, nausea, or lightheadedness.',
      'Women may experience less typical symptoms such as shortness of breath, nausea/vomiting, and back or jaw pain.',
      'If you experience these symptoms, call emergency services immediately.'
    ]
  };
}
