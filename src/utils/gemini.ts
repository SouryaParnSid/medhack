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
    const prompt = `Analyze this medical image and provide a detailed structured assessment.

    Please provide your analysis in the following structured HTML format:

    <div class="image-analysis">
      <div class="analysis-header">
        <h4>Medical Image Analysis</h4>
      </div>
      
      <div class="visual-findings">
        <h4>Visual Findings:</h4>
        <p>[Detailed description of what you observe in the image]</p>
      </div>
      
      <div class="potential-conditions">
        <h4>Potential Conditions:</h4>
        <ul>
          <li>[Condition 1 with brief explanation]</li>
          <li>[Condition 2 with brief explanation]</li>
          <li>[Additional conditions if applicable]</li>
        </ul>
      </div>
      
      <div class="recommendations">
        <h4>Recommendations:</h4>
        <ul>
          <li>[Recommendation 1]</li>
          <li>[Recommendation 2]</li>
        </ul>
      </div>
      
      <div class="disclaimer">
        <p><strong>Note:</strong> This is an AI-assisted preliminary assessment only and should not replace professional medical diagnosis.</p>
      </div>
    </div>
    
    Important: Maintain the HTML structure exactly as provided, only replacing the content in brackets.`;

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
    let analysisText = verifyResponse(response.text());
    
    // Add custom styling to the HTML content
    analysisText = analysisText.replace('<div class="image-analysis">', 
      '<div class="image-analysis" style="animation: slideIn 0.6s ease-out;">');
    
    // Add icons and styling to section headers
    analysisText = analysisText.replace(/<h4>Medical Image Analysis<\/h4>/g, 
      '<h4 style="color: #4f46e5; font-size: 1.1em; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">🔍 Medical Image Analysis</h4>');
    
    analysisText = analysisText.replace(/<h4>Visual Findings:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Visual Findings:</h4>');
    
    analysisText = analysisText.replace(/<h4>Potential Conditions:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>Potential Conditions:</h4>');
    
    analysisText = analysisText.replace(/<h4>Recommendations:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Recommendations:</h4>');
    
    // Style list items and disclaimer
    analysisText = analysisText.replace(/<li>/g, '<li style="margin-bottom: 6px;">');
    analysisText = analysisText.replace(/<div class="disclaimer">/g, 
      '<div class="disclaimer" style="margin-top: 16px; padding: 8px; background-color: rgba(243, 244, 246, 0.6); border-radius: 6px; font-size: 0.9em;">');
    
    // Add animation styles
    analysisText = `<style>
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .image-analysis { padding: 16px; border-radius: 8px; background-color: rgba(249, 250, 251, 0.5); }
      .visual-findings, .potential-conditions, .recommendations, .disclaimer { 
        margin-bottom: 14px; 
        animation: fadeIn 0.5s ease-in-out; 
        animation-fill-mode: both; 
      }
      .visual-findings { animation-delay: 0.1s; }
      .potential-conditions { animation-delay: 0.3s; }
      .recommendations { animation-delay: 0.5s; }
      .disclaimer { animation-delay: 0.7s; }
    </style>` + analysisText;
    
    return analysisText;
  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
      return `<div class="error-message" style="color: #ef4444; padding: 12px; border: 1px solid #ef4444; border-radius: 8px; background-color: rgba(239, 68, 68, 0.1);">
        <h4 style="margin-top: 0;">Error Analyzing Image</h4>
        <p>${error.message}</p>
        <p>Please try again with a different image or contact support if the problem persists.</p>
      </div>`;
    }
    return `<div class="error-message" style="color: #ef4444; padding: 12px; border: 1px solid #ef4444; border-radius: 8px; background-color: rgba(239, 68, 68, 0.1);">
      <h4 style="margin-top: 0;">Error Analyzing Image</h4>
      <p>An unexpected error occurred while analyzing the image.</p>
      <p>Please try again with a different image or contact support if the problem persists.</p>
    </div>`;
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
    // Enhanced prompt for more structured output
    const prompt = `As an advanced medical triage AI, analyze these patient details and provide a structured assessment:

    Patient Name: ${data.name}
    Age: ${data.age}
    Symptoms: ${data.symptoms}
    
    Please provide your assessment in the following structured HTML format:

    <div class="triage-assessment">
      <div class="priority-section">
        <h4>Priority Level: <strong>[HIGH/MEDIUM/LOW]</strong></h4>
      </div>
      
      <div class="assessment-section">
        <h4>Initial Assessment:</h4>
        <p>[Your concise assessment of the patient's condition]</p>
      </div>
      
      <div class="recommendation-section">
        <h4>Recommended Actions:</h4>
        <ul>
          <li>[Action 1]</li>
          <li>[Action 2]</li>
          <li>[Action 3 if applicable]</li>
        </ul>
      </div>
      
      <div class="warning-section">
        <h4>Warning Signs to Monitor:</h4>
        <ul>
          <li>[Warning sign 1]</li>
          <li>[Warning sign 2 if applicable]</li>
        </ul>
      </div>
    </div>
    
    Base your priority level on the severity and urgency of the symptoms. Use HIGH for potentially life-threatening conditions requiring immediate attention, MEDIUM for conditions requiring prompt but not immediate care, and LOW for non-urgent conditions.
    
    Important: Maintain the HTML structure exactly as provided, only replacing the content in brackets.`;

    const resultPromise = model.generateContent(prompt);
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    const response = await result.response;
    let analysisText = verifyResponse(response.text());
    
    // Add custom styling to the HTML content
    analysisText = analysisText.replace('<div class="triage-assessment">', 
      '<div class="triage-assessment" style="animation: fadeIn 0.5s ease-in-out;">');
    
    // Add color to priority based on level
    analysisText = analysisText.replace(/Priority Level: <strong>(HIGH|MEDIUM|LOW)<\/strong>/gi, (match, priority) => {
      const color = priority.toLowerCase() === 'high' ? 'red' : 
                   priority.toLowerCase() === 'medium' ? 'orange' : 'green';
      return `Priority Level: <strong style="color: ${color}; font-size: 1.1em;">${priority}</strong>`;
    });
    
    // Add icons and styling to section headers
    analysisText = analysisText.replace(/<h4>Initial Assessment:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>Initial Assessment:</h4>');
    
    analysisText = analysisText.replace(/<h4>Recommended Actions:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Recommended Actions:</h4>');
    
    analysisText = analysisText.replace(/<h4>Warning Signs to Monitor:<\/h4>/g, 
      '<h4 style="color: #ef4444; display: flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Warning Signs to Monitor:</h4>');
    
    // Style list items
    analysisText = analysisText.replace(/<li>/g, '<li style="margin-bottom: 4px;">');
    
    // Add animation styles
    analysisText = `<style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .triage-assessment { padding: 12px; border-radius: 8px; }
      .priority-section { margin-bottom: 12px; }
      .assessment-section, .recommendation-section, .warning-section { 
        margin-bottom: 12px; 
        animation: fadeIn 0.5s ease-in-out; 
        animation-fill-mode: both; 
      }
      .assessment-section { animation-delay: 0.1s; }
      .recommendation-section { animation-delay: 0.2s; }
      .warning-section { animation-delay: 0.3s; }
    </style>` + analysisText;

    // Extract priority from the analysis
    const priorityMatch = analysisText.match(/Priority Level: <strong[^>]*>(HIGH|MEDIUM|LOW)<\/strong>/i);
    const priority = priorityMatch ? 
      priorityMatch[1].toLowerCase() as 'high' | 'medium' | 'low' : 'medium';

    return {
      priority,
      analysis: analysisText
    };
  } catch (error) {
    console.error('Error analyzing triage:', error);
    if (error instanceof Error) {
      return {
        priority: 'low',
        analysis: `<div class="error-message" style="color: #ef4444; padding: 12px; border: 1px solid #ef4444; border-radius: 8px; background-color: rgba(239, 68, 68, 0.1);">
          <h4 style="margin-top: 0;">Error Analyzing Triage</h4>
          <p>${error.message}</p>
          <p>Please try again or contact support if the problem persists.</p>
        </div>`
      };
    }
    return {
      priority: 'low',
      analysis: `<div class="error-message" style="color: #ef4444; padding: 12px; border: 1px solid #ef4444; border-radius: 8px; background-color: rgba(239, 68, 68, 0.1);">
        <h4 style="margin-top: 0;">Error Analyzing Triage</h4>
        <p>An unexpected error occurred while analyzing triage priority.</p>
        <p>Please try again or contact support if the problem persists.</p>
      </div>`
    };
  }
}