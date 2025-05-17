import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with explicit logging of API key status
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
console.log("API Key status:", API_KEY ? "API key is set" : "API key is missing");

// Initialize with direct API key for reliability
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Use the older model name that's more likely to be accessible with any API key
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest', 
  safetySettings
});

// For image analysis - use the older vision model
const visionModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  safetySettings
});

// Helper function to verify response
const verifyResponse = (text: string): string => {
  if (!text || text.trim() === '') {
    return 'The AI model did not provide a valid response. Please try again.';
  }
  return text;
};

// Helper function for timeout
const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: NodeJS.Timeout | undefined;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export async function analyzeSymptoms(symptoms: string) {
  try {
    console.log('Analyzing symptoms with API Key status:', !!API_KEY);
    const prompt = `As a medical AI assistant, analyze these symptoms and provide a preliminary assessment: ${symptoms}. 
    Include possible conditions, severity level, and whether immediate medical attention is needed. 
    Format the response in a clear, structured way.`;

    // Add additional logging
    console.log('Sending prompt to Gemini API:', { model: 'gemini-pro', promptLength: prompt.length });

    const resultPromise = model.generateContent(prompt);
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    
    console.log('Received response from Gemini API');
    const response = await result.response;
    return verifyResponse(response.text());
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.name, error.message, error.stack);
      return `Error analyzing symptoms: ${error.message}. Please check your API key configuration or try again later.`;
    }
    return 'An unexpected error occurred while analyzing the symptoms. Please check your network connection and API key.';
  }
}

export async function analyzeMedicalImage(imageData: string) {
  try {
    const prompt = `Analyze this medical image and provide observations about any visible conditions or abnormalities. 
    Include a description of what you see and any potential medical implications. 
    Note: This is for preliminary assessment only and should not replace professional medical diagnosis.`;

    // Convert base64 image to proper format for Gemini
    const mimeType = imageData.split(';')[0].split(':')[1];
    const imageBytes = atob(imageData.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(imageBytes.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < imageBytes.length; i++) {
      uint8Array[i] = imageBytes.charCodeAt(i);
    }

    const imageParts = [{
      inlineData: {
        data: Buffer.from(uint8Array).toString('base64'),
        mimeType
      }
    }];

    // Gemini 1.5 Flash handles multimodal content natively
    const resultPromise = visionModel.generateContent([prompt, ...imageParts]);
    const result = await withTimeout(resultPromise, 45000); // 45 second timeout for image analysis
    const response = await result.response;
    return verifyResponse(response.text());
  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
      return `Error analyzing image: ${error.message}`;
    }
    return 'An unexpected error occurred while analyzing the image.';
  }
}

export async function getChatResponse(userMessage: string) {
  try {
    const prompt = `As a medical AI assistant, provide helpful information about: ${userMessage}. 
    Remember to be clear, accurate, and always recommend consulting healthcare professionals for proper diagnosis and treatment.`;

    const resultPromise = model.generateContent(prompt);
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    const response = await result.response;
    return verifyResponse(response.text());
  } catch (error) {
    console.error('Error getting chat response:', error);
    if (error instanceof Error) {
      return `Error getting response: ${error.message}`;
    }
    return 'An unexpected error occurred while getting a response.';
  }
}

interface TriageData {
  name: string;
  age: number;
  symptoms: string;
}

export async function analyzeTriage(data: TriageData): Promise<{ priority: 'high' | 'medium' | 'low'; analysis: string; }> {
  try {
    const prompt = `As a medical triage system, analyze these patient details:
    Patient Name: ${data.name}
    Age: ${data.age}
    Symptoms: ${data.symptoms}
    
    Determine the priority level (high, medium, or low) based on symptom severity and potential urgency.
    Provide a brief explanation for the triage decision.`;

    const resultPromise = model.generateContent(prompt);
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    const response = await result.response;
    const analysisText = verifyResponse(response.text());

    // Extract priority from the analysis
    const priority = analysisText.toLowerCase().includes('high priority') ? 'high' :
                    analysisText.toLowerCase().includes('medium priority') ? 'medium' : 'low';

    return {
      priority,
      analysis: analysisText
    };
  } catch (error) {
    console.error('Error analyzing triage:', error);
    if (error instanceof Error) {
      return {
        priority: 'low',
        analysis: `Error analyzing triage: ${error.message}`
      };
    }
    return {
      priority: 'low',
      analysis: 'An unexpected error occurred while analyzing triage priority.'
    };
  }
} 