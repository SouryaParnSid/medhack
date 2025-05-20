'use client';

import { useState, useEffect } from 'react';
import { HeartAttackPredictionInput, PredictionResult, predictHeartAttack, getRecommendations } from '@/utils/heartAttackPrediction';

export default function HeartAttackPrediction() {
  const [formData, setFormData] = useState<HeartAttackPredictionInput>({
    age: 45,
    sex: 'male',
    chestPainType: 'typical',
    restingBP: 120,
    cholesterol: 200,
    fastingBS: false,
    restingECG: 'normal',
    maxHR: 150,
    exerciseAngina: false,
    oldpeak: 0,
    stSlope: 'upsloping'
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModePreference);
      
      // Add listener for changes in color scheme preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await predictHeartAttack(formData);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPredictionResult = () => {
    if (!prediction) return null;

    const recommendations = getRecommendations(prediction.riskLevel);
    const riskColors = {
      'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'moderate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'very-high': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };

    return (
      <div className={`mt-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-lg animate-fadeIn`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Prediction Result</h2>
        
        <div className={`p-4 rounded-lg ${riskColors[prediction.riskLevel]} mb-6`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white/80'} mr-3`}>
              {prediction.prediction ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {prediction.prediction ? 'Elevated Risk of Heart Attack' : 'Lower Risk of Heart Attack'}
              </h3>
              <p className="text-sm mt-1">
                Risk Level: <span className="font-medium capitalize">{prediction.riskLevel}</span> 
                ({Math.round(prediction.probability * 100)}% probability)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Note
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
            This AI analysis is intended as a screening tool only and is not a substitute for professional medical diagnosis. 
            Always consult with a healthcare provider for proper evaluation and diagnosis.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-4xl`}>
            Heart Attack Risk Assessment
          </h1>
          <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Fill in your health information to assess your risk of heart attack using our AI-powered prediction model.
          </p>

          <form onSubmit={handleSubmit} className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Age */}
              <div>
                <label htmlFor="age" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>

              {/* Sex */}
              <div>
                <label htmlFor="sex" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sex
                </label>
                <select
                  name="sex"
                  id="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Chest Pain Type */}
              <div>
                <label htmlFor="chestPainType" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Chest Pain Type
                </label>
                <select
                  name="chestPainType"
                  id="chestPainType"
                  value={formData.chestPainType}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                >
                  <option value="typical">Typical Angina</option>
                  <option value="atypical">Atypical Angina</option>
                  <option value="nonAnginal">Non-Anginal Pain</option>
                  <option value="asymptomatic">Asymptomatic</option>
                </select>
              </div>

              {/* Resting Blood Pressure */}
              <div>
                <label htmlFor="restingBP" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Resting Blood Pressure (mm Hg)
                </label>
                <input
                  type="number"
                  name="restingBP"
                  id="restingBP"
                  min="80"
                  max="200"
                  value={formData.restingBP}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>

              {/* Cholesterol */}
              <div>
                <label htmlFor="cholesterol" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cholesterol (mg/dl)
                </label>
                <input
                  type="number"
                  name="cholesterol"
                  id="cholesterol"
                  min="100"
                  max="600"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>

              {/* Fasting Blood Sugar */}
              <div className="flex items-center h-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="fastingBS"
                    id="fastingBS"
                    checked={formData.fastingBS}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="fastingBS" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fasting Blood Sugar &gt; 120 mg/dl
                  </label>
                </div>
              </div>

              {/* Resting ECG */}
              <div>
                <label htmlFor="restingECG" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Resting ECG
                </label>
                <select
                  name="restingECG"
                  id="restingECG"
                  value={formData.restingECG}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                >
                  <option value="normal">Normal</option>
                  <option value="stSlope">ST-T Wave Abnormality</option>
                  <option value="leftVentricular">Left Ventricular Hypertrophy</option>
                </select>
              </div>

              {/* Max Heart Rate */}
              <div>
                <label htmlFor="maxHR" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Maximum Heart Rate
                </label>
                <input
                  type="number"
                  name="maxHR"
                  id="maxHR"
                  min="60"
                  max="220"
                  value={formData.maxHR}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>

              {/* Exercise Angina */}
              <div className="flex items-center h-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="exerciseAngina"
                    id="exerciseAngina"
                    checked={formData.exerciseAngina}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="exerciseAngina" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Exercise-Induced Angina
                  </label>
                </div>
              </div>

              {/* Oldpeak */}
              <div>
                <label htmlFor="oldpeak" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ST Depression (Oldpeak)
                </label>
                <input
                  type="number"
                  name="oldpeak"
                  id="oldpeak"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                />
              </div>

              {/* ST Slope */}
              <div>
                <label htmlFor="stSlope" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ST Slope
                </label>
                <select
                  name="stSlope"
                  id="stSlope"
                  value={formData.stSlope}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  required
                >
                  <option value="upsloping">Upsloping</option>
                  <option value="flat">Flat</option>
                  <option value="downsloping">Downsloping</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Assess Risk'}
              </button>
            </div>
          </form>

          {renderPredictionResult()}
        </div>
      </div>
    </div>
  );
}
