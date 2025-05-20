import axios from 'axios';

// Interface for heart attack prediction input parameters
export interface HeartAttackPredictionInput {
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical' | 'atypical' | 'nonAnginal' | 'asymptomatic';
  restingBP: number;
  cholesterol: number;
  fastingBS: boolean;
  restingECG: 'normal' | 'stSlope' | 'leftVentricular';
  maxHR: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 'upsloping' | 'flat' | 'downsloping';
}

// Interface for prediction result
export interface PredictionResult {
  probability: number;
  prediction: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
}

/**
 * Predicts heart attack risk using the ensemble model
 * @param data - Patient data for prediction
 * @returns Prediction result with probability and risk level
 */
export async function predictHeartAttack(data: HeartAttackPredictionInput): Promise<PredictionResult> {
  try {
    // Call the API endpoint that will use the ensemble_model.pkl
    const response = await axios.post('/api/heart-attack-prediction', data);
    return response.data;
  } catch (error) {
    console.error('Error predicting heart attack risk:', error);
    throw new Error('Failed to predict heart attack risk. Please try again.');
  }
}

/**
 * Converts the risk probability to a risk level category
 * @param probability - Probability of heart attack (0-1)
 * @returns Risk level category
 */
export function getRiskLevel(probability: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (probability < 0.25) {
    return 'low';
  } else if (probability < 0.5) {
    return 'moderate';
  } else if (probability < 0.75) {
    return 'high';
  } else {
    return 'very-high';
  }
}

/**
 * Gets recommendations based on risk level
 * @param riskLevel - The calculated risk level
 * @returns Array of recommendation strings
 */
export function getRecommendations(riskLevel: 'low' | 'moderate' | 'high' | 'very-high'): string[] {
  const commonRecommendations = [
    'Maintain a heart-healthy diet rich in fruits, vegetables, whole grains, and lean proteins.',
    'Exercise regularly, aiming for at least 150 minutes of moderate activity per week.',
    'Avoid smoking and limit alcohol consumption.',
    'Manage stress through relaxation techniques, adequate sleep, and social connections.'
  ];

  switch (riskLevel) {
    case 'low':
      return [
        ...commonRecommendations,
        'Continue regular check-ups with your healthcare provider.',
        'Monitor your blood pressure and cholesterol levels periodically.'
      ];
    case 'moderate':
      return [
        ...commonRecommendations,
        'Schedule a follow-up with your healthcare provider within the next 3-6 months.',
        'Consider discussing preventive medications with your doctor.',
        'Monitor your blood pressure and cholesterol more frequently.'
      ];
    case 'high':
      return [
        ...commonRecommendations,
        'Consult with a cardiologist as soon as possible.',
        'Discuss medication options with your healthcare provider.',
        'Consider a more detailed cardiac evaluation.',
        'Monitor your blood pressure, blood sugar, and cholesterol levels regularly.'
      ];
    case 'very-high':
      return [
        ...commonRecommendations,
        'Seek immediate medical attention.',
        'Follow up with a cardiologist urgently.',
        'Adhere strictly to prescribed medications and lifestyle modifications.',
        'Consider a comprehensive cardiac evaluation including stress tests and imaging.'
      ];
  }
}
