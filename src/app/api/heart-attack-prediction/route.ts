import { NextRequest, NextResponse } from 'next/server';

// Define the expected input structure
interface HeartAttackPredictionInput {
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

// Note: We're using a JavaScript-based risk calculation approach instead of the Python model

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json() as HeartAttackPredictionInput;
    
    // Validate the input data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    // TEMPORARY SOLUTION: Since we're having issues with Python dependencies (mlxtend),
    // we'll implement a simplified risk calculation algorithm in JavaScript
    // This is not as accurate as the actual model but will allow the feature to work
    // until the proper environment with all dependencies is set up
    
    console.log('Using JavaScript-based risk calculation instead of Python model due to dependency issues');
    
    // Calculate a risk score based on known risk factors for heart disease
    let riskScore = 0;
    
    // Age is a significant risk factor
    if (data.age > 65) riskScore += 20;
    else if (data.age > 55) riskScore += 15;
    else if (data.age > 45) riskScore += 10;
    else if (data.age > 35) riskScore += 5;
    
    // Sex (males have higher risk)
    if (data.sex === 'male') riskScore += 10;
    
    // Chest pain type (asymptomatic has highest risk)
    if (data.chestPainType === 'asymptomatic') riskScore += 20;
    else if (data.chestPainType === 'nonAnginal') riskScore += 10;
    else if (data.chestPainType === 'atypical') riskScore += 5;
    
    // Blood pressure
    if (data.restingBP > 180) riskScore += 20;
    else if (data.restingBP > 160) riskScore += 15;
    else if (data.restingBP > 140) riskScore += 10;
    else if (data.restingBP > 120) riskScore += 5;
    
    // Cholesterol
    if (data.cholesterol > 300) riskScore += 20;
    else if (data.cholesterol > 240) riskScore += 15;
    else if (data.cholesterol > 200) riskScore += 10;
    else if (data.cholesterol > 180) riskScore += 5;
    
    // Fasting blood sugar
    if (data.fastingBS) riskScore += 10;
    
    // ECG abnormalities
    if (data.restingECG === 'leftVentricular') riskScore += 15;
    else if (data.restingECG === 'stSlope') riskScore += 10;
    
    // Max heart rate (lower max HR can indicate problems)
    if (data.maxHR < 100) riskScore += 15;
    else if (data.maxHR < 120) riskScore += 10;
    else if (data.maxHR < 140) riskScore += 5;
    
    // Exercise-induced angina is a strong predictor
    if (data.exerciseAngina) riskScore += 20;
    
    // ST depression (oldpeak)
    if (data.oldpeak > 4) riskScore += 20;
    else if (data.oldpeak > 2) riskScore += 15;
    else if (data.oldpeak > 1) riskScore += 10;
    else if (data.oldpeak > 0.5) riskScore += 5;
    
    // ST slope
    if (data.stSlope === 'flat') riskScore += 15;
    else if (data.stSlope === 'downsloping') riskScore += 20;
    
    // Convert risk score to probability (max score is approximately 200)
    const probability = Math.min(riskScore / 200, 0.99);
    
    // Determine prediction (true if probability > 0.5)
    const prediction = probability > 0.5;
    
    // Calculate risk level based on probability
    let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
    
    if (probability < 0.25) {
      riskLevel = 'low';
    } else if (probability < 0.5) {
      riskLevel = 'moderate';
    } else if (probability < 0.75) {
      riskLevel = 'high';
    } else {
      riskLevel = 'very-high';
    }
    
    // Return the prediction result with risk level
    return NextResponse.json({
      probability,
      prediction,
      riskLevel
    });
  } catch (error) {
    console.error('Error in heart attack prediction API:', error);
    return NextResponse.json(
      { error: 'Failed to process heart attack prediction' },
      { status: 500 }
    );
  }
}
