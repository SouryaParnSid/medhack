import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with explicit logging of API key status
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Log API key status (without revealing the key itself)
console.log("API Key status:", API_KEY ? "API key is set" : "API key is missing");

if (!API_KEY) {
  console.error("CRITICAL ERROR: Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
}

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
    // Check if API key is available before proceeding
    if (!API_KEY) {
      console.error('Cannot analyze symptoms: Gemini API key is missing');
      return `<div class="error-message">
        <h3>API Configuration Error</h3>
        <p>The Gemini API key is missing or invalid. This feature requires a valid Google Gemini API key to function.</p>
        <p><strong>For users:</strong> Please contact the administrator to set up the API key.</p>
        <p><strong>For administrators:</strong> Please add your Gemini API key to the environment variables:</p>
        <ol>
          <li>Get an API key from <a href="https://ai.google.dev/" target="_blank">Google AI Studio</a></li>
          <li>Add it as NEXT_PUBLIC_GEMINI_API_KEY in your deployment environment</li>
        </ol>
      </div>`;
    }

    console.log('Analyzing symptoms with API Key status:', !!API_KEY);
    const prompt = `As a highly specialized medical AI assistant, analyze these symptoms in detail and provide a comprehensive preliminary assessment: ${symptoms}.

    Please provide your analysis in the following structured format:
    
    1. Preliminary Assessment: Provide a detailed overview of the symptoms and their potential implications.
    
    2. Possible Conditions: List at least 3-5 specific potential conditions that match these symptoms, ordered from most to least likely. For each condition, provide:
       - Brief description of the condition
       - Why it matches the reported symptoms
       - Key distinguishing features
    
    3. Severity Assessment: Classify the severity as mild, moderate, or severe with clear justification.
    
    4. Urgency Level: Clearly state whether immediate medical attention is needed and why. Use one of these categories:
       - Immediate medical attention required (emergency)
       - Urgent care needed (within 24 hours)
       - Non-urgent medical consultation recommended
       - Self-care appropriate with monitoring
    
    5. Recommended Actions: Provide specific, actionable next steps including:
       - When to seek medical care
       - Specific tests or examinations that might be needed
       - Self-care measures if appropriate
       - Warning signs that would indicate worsening condition
    
    Be specific, detailed, and comprehensive in your analysis. Avoid vague or general statements.`;

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
      
      // Check for specific API key related errors
      if (error.message.includes('API key') || error.message.includes('403') || error.message.includes('identity')) {
        return `<div class="error-message">
          <h3>API Authentication Error</h3>
          <p>There was a problem authenticating with the Google Gemini API. The API key may be invalid or has reached its quota limit.</p>
          <p><strong>For administrators:</strong> Please check your Gemini API key configuration and ensure it has the proper permissions.</p>
        </div>`;
      }
      
      return `<div class="error-message">
        <h3>Analysis Error</h3>
        <p>Error analyzing symptoms: ${error.message}</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>`;
    }
    return `<div class="error-message">
      <h3>Unexpected Error</h3>
      <p>An unexpected error occurred while analyzing the symptoms.</p>
      <p>Please check your network connection and try again.</p>
    </div>`;
  }
}

export async function analyzeMedicalImage(imageData: string) {
  try {
    // Check if API key is available before proceeding
    if (!API_KEY) {
      console.error('Cannot analyze medical image: Gemini API key is missing');
      return `<div class="error-message" style="padding: 16px; background-color: rgba(254, 202, 202, 0.2); border-left: 4px solid #ef4444; border-radius: 4px;">
        <h4 style="color: #ef4444; margin-top: 0;">API Configuration Error</h4>
        <p>The Gemini API key is missing or invalid. This feature requires a valid Google Gemini API key to function.</p>
        <p><strong>For users:</strong> Please contact the administrator to set up the API key.</p>
        <p><strong>For administrators:</strong> Please add your Gemini API key to the environment variables:</p>
        <ol>
          <li>Get an API key from <a href="https://ai.google.dev/" target="_blank" style="color: #4f46e5;">Google AI Studio</a></li>
          <li>Add it as NEXT_PUBLIC_GEMINI_API_KEY in your deployment environment</li>
        </ol>
      </div>`;
    }

    const prompt = `As a specialized medical imaging AI, analyze this medical image and provide a comprehensive, detailed structured assessment with specific observations and findings.

    Please provide your analysis in the following structured HTML format:

    <div class="image-analysis">
      <div class="analysis-header">
        <h4>Medical Image Analysis</h4>
      </div>
      
      <div class="image-type">
        <h4>Image Type Assessment:</h4>
        <p>[Identify the type of medical image (X-ray, MRI, CT scan, ultrasound, etc.) and the body region shown]</p>
      </div>
      
      <div class="visual-findings">
        <h4>Visual Findings:</h4>
        <p>[Provide SPECIFIC and DETAILED observations about the image, including anatomical structures, abnormalities, densities, opacities, or other relevant features. Be precise about locations, sizes, and characteristics.]</p>
        <ul>
          <li>[Specific finding 1 with precise description]</li>
          <li>[Specific finding 2 with precise description]</li>
          <li>[Additional specific findings with precise descriptions]</li>
        </ul>
      </div>
      
      <div class="potential-conditions">
        <h4>Potential Conditions:</h4>
        <ul>
          <li>[Specific condition 1 with detailed explanation of why it matches the imaging findings]</li>
          <li>[Specific condition 2 with detailed explanation of why it matches the imaging findings]</li>
          <li>[Additional specific conditions with detailed explanations]</li>
        </ul>
      </div>
      
      <div class="differential-diagnosis">
        <h4>Differential Diagnosis:</h4>
        <p>[Discuss how to differentiate between the potential conditions, what additional tests might help, and key distinguishing features]</p>
      </div>
      
      <div class="recommendations">
        <h4>Recommendations:</h4>
        <ul>
          <li>[Specific recommendation 1 with clear rationale]</li>
          <li>[Specific recommendation 2 with clear rationale]</li>
          <li>[Additional specific recommendations with clear rationales]</li>
        </ul>
      </div>
      
      <div class="disclaimer">
        <p><strong>Note:</strong> This is an AI-assisted preliminary assessment only and should not replace professional medical diagnosis. All findings should be confirmed by a qualified healthcare provider.</p>
      </div>
    </div>
    
    Important instructions:
    1. Be SPECIFIC and DETAILED in all your observations and assessments - avoid vague or general statements
    2. Use precise medical terminology where appropriate
    3. Provide concrete measurements, locations, and characteristics when possible
    4. Maintain the HTML structure exactly as provided, only replacing the content in brackets
    5. If you cannot determine something with confidence, acknowledge the limitation rather than making vague statements`;

    // Convert base64 image to proper format for Gemini
    const mimeType = imageData.split(';')[0].split(':')[1];
    const base64Data = imageData.split(',')[1];

    // Create a file part for the image
    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      },
      prompt
    ];

    // Use the vision model for image analysis
    const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Add logging for debugging
    console.log('Sending image to Gemini API for analysis');
    
    // Generate content with the image
    const resultPromise = visionModel.generateContent(imageParts);
    const result = await withTimeout(resultPromise, 60000); // 60 second timeout for image processing
    
    console.log('Received response from Gemini API');
    const response = await result.response;
    let analysisText = verifyResponse(response.text());
    
    // Process markdown-style formatting if present in the response
    // Convert markdown headings (# Heading) to HTML headings
    analysisText = analysisText.replace(/#{1,6}\s(.+)/g, '<h3 style="color: #4f46e5; font-size: 1.1em; margin: 16px 0 8px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">$1</h3>');
    
    // Convert markdown bold (**text**) to HTML strong
    analysisText = analysisText.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #f3f4f6;">$1</strong>');
    
    // Convert markdown italic (*text*) to HTML em
    analysisText = analysisText.replace(/\*([^*]+)\*/g, '<em style="color: #d1d5db;">$1</em>');
    
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
      // Check for API key related errors
      if (error.message.includes('API key') || error.message.includes('403') || error.message.includes('unregistered callers') || error.message.includes('identity')) {
        return `<div class="error-message" style="color: #ef4444; padding: 12px; border: 1px solid #ef4444; border-radius: 8px; background-color: rgba(239, 68, 68, 0.1);">
          <h4 style="margin-top: 0;">API Configuration Error</h4>
          <p>There was a problem authenticating with the Google Gemini API.</p>
          <p><strong>For users:</strong> Please contact the administrator to verify the API key configuration.</p>
          <p><strong>For administrators:</strong> Please check that your Gemini API key is valid and has the proper permissions.</p>
          <p>Error details: ${error.message}</p>
        </div>`;
      }
      
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
    // Check if API key is available before proceeding
    if (!API_KEY) {
      console.error('Cannot get chat response: Gemini API key is missing');
      return `<div class="error-message">
        <h3>API Configuration Error</h3>
        <p>The Gemini API key is missing or invalid. This feature requires a valid Google Gemini API key to function.</p>
        <p><strong>For users:</strong> Please contact the administrator to set up the API key.</p>
        <p><strong>For administrators:</strong> Please add your Gemini API key to the environment variables.</p>
      </div>`;
    }

    const prompt = `As a medical AI assistant, provide helpful information about: ${userMessage}. 
    Remember to be clear, accurate, and always recommend consulting healthcare professionals for proper diagnosis and treatment.`;

    const resultPromise = model.generateContent(prompt);
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    const response = await result.response;
    return verifyResponse(response.text());
  } catch (error) {
    console.error('Error getting chat response:', error);
    if (error instanceof Error) {
      // Check for API key related errors
      if (error.message.includes('API key') || error.message.includes('403') || error.message.includes('unregistered callers') || error.message.includes('identity')) {
        return `<div class="error-message">
          <h3>API Authentication Error</h3>
          <p>There was a problem authenticating with the Google Gemini API.</p>
          <p><strong>For administrators:</strong> Please check that your Gemini API key is valid and has the proper permissions.</p>
          <p>Error details: ${error.message}</p>
        </div>`;
      }
      
      return `<div class="error-message">
        <h3>Chat Error</h3>
        <p>Error getting response: ${error.message}</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>`;
    }
    return `<div class="error-message">
      <h3>Unexpected Error</h3>
      <p>An unexpected error occurred while getting a response.</p>
      <p>Please try again later.</p>
    </div>`;
  }
}

interface TriageData {
  name: string;
  age: number;
  symptoms: string;
}

/**
 * Converts speech audio to text using Gemini API
 * @param audioData - Base64 encoded audio data
 */
export async function convertSpeechToText(audioData: string): Promise<string> {
  try {
    // Check if API key is available before proceeding
    if (!API_KEY) {
      console.error('Cannot convert speech to text: Gemini API key is missing');
      throw new Error('Gemini API key is missing');
    }

    console.log('Converting speech to text with Gemini API');
    const prompt = `Transcribe the following audio recording of a person describing their medical symptoms. 
    Focus on capturing all symptom details accurately, including:
    - Specific symptoms mentioned
    - Duration and severity of symptoms
    - Any relevant medical history mentioned
    - Factors that worsen or improve the symptoms
    
    Provide only the transcription without any additional commentary or analysis.`;

    // Create parts for the multimodal content
    const parts = [
      {text: prompt},
      {
        inlineData: {
          mimeType: 'audio/mp3', // or appropriate mime type
          data: audioData.split('base64,')[1] // Remove the data URL prefix if present
        }
      }
    ];

    // Generate content with the audio
    const resultPromise = visionModel.generateContent({contents: [{role: 'user', parts}]});
    const result = await withTimeout(resultPromise, 30000); // 30 second timeout
    
    console.log('Received speech-to-text response from Gemini API');
    const response = await result.response;
    return verifyResponse(response.text());
  } catch (error) {
    console.error('Error converting speech to text:', error);
    if (error instanceof Error) {
      throw new Error(`Speech-to-text conversion failed: ${error.message}`);
    }
    throw new Error('Speech-to-text conversion failed');
  }
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
    
    // Add color to priority based on level with better styling
    analysisText = analysisText.replace(/Priority Level: <strong>(HIGH|MEDIUM|LOW)<\/strong>/gi, (match, priority) => {
      const bgColor = priority.toLowerCase() === 'high' ? '#fef2f2' : 
                     priority.toLowerCase() === 'medium' ? '#fffbeb' : '#f0fdf4';
      const textColor = priority.toLowerCase() === 'high' ? '#ef4444' : 
                       priority.toLowerCase() === 'medium' ? '#f59e0b' : '#22c55e';
      const borderColor = priority.toLowerCase() === 'high' ? '#fecaca' : 
                         priority.toLowerCase() === 'medium' ? '#fef3c7' : '#dcfce7';
      
      return `Priority Level: <span style="display: inline-block; background: ${bgColor}; color: ${textColor}; padding: 2px 8px; border-radius: 4px; font-weight: 600; border: 1px solid ${borderColor};">${priority}</span>`;
    });
    
    // Add icons and styling to section headers with minimal spacing
    analysisText = analysisText.replace(/<h4>Initial Assessment:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 4px; margin: 4px 0 2px; padding-bottom: 2px; border-bottom: 1px solid rgba(229, 231, 235, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>Initial Assessment</h4>');
    
    analysisText = analysisText.replace(/<h4>Recommended Actions:<\/h4>/g, 
      '<h4 style="color: #4f46e5; display: flex; align-items: center; gap: 4px; margin: 4px 0 2px; padding-bottom: 2px; border-bottom: 1px solid rgba(229, 231, 235, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Recommended Actions</h4>');
    
    analysisText = analysisText.replace(/<h4>Warning Signs to Monitor:<\/h4>/g, 
      '<h4 style="color: #ef4444; display: flex; align-items: center; gap: 4px; margin: 4px 0 2px; padding-bottom: 2px; border-bottom: 1px solid rgba(229, 231, 235, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Warning Signs to Monitor</h4>');
    
    // Style paragraphs and list items with minimal spacing
    analysisText = analysisText.replace(/<p>/g, '<p style="margin: 2px 0; line-height: 1.3;">');
    analysisText = analysisText.replace(/<li>/g, '<li style="margin-bottom: 1px; position: relative; padding-left: 4px;">');
    
    // Replace standard ul/li with custom styled ones
    analysisText = analysisText.replace(/<ul>/g, '<ul style="list-style-type: none; padding-left: 0; margin: 2px 0;">');
    
    // Add checkmarks to recommended actions with minimal spacing
    analysisText = analysisText.replace(/<div class="recommendation-section">([\s\S]*?)<\/div>/g, (match, content) => {
      return match.replace(/<li style="[^"]*">/g, 
        '<li style="margin-bottom: 1px; position: relative; padding-left: 16px;"><span style="position: absolute; left: 0; color: #4f46e5;">✓</span>');
    });
    
    // Add warning icons to warning signs with minimal spacing
    analysisText = analysisText.replace(/<div class="warning-section">([\s\S]*?)<\/div>/g, (match, content) => {
      return match.replace(/<li style="[^"]*">/g, 
        '<li style="margin-bottom: 1px; position: relative; padding-left: 16px;"><span style="position: absolute; left: 0; color: #ef4444;">⚠</span>');
    });
    
    // Add animation styles with minimal spacing
    analysisText = `<style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(3px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .triage-assessment { 
        padding: 4px; 
        border-radius: 6px; 
        font-family: system-ui, -apple-system, sans-serif;
      }
      .priority-section { 
        margin-bottom: 4px; 
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(229, 231, 235, 0.3);
      }
      .assessment-section, .recommendation-section, .warning-section { 
        margin-bottom: 4px; 
        animation: fadeIn 0.4s ease-in-out; 
        animation-fill-mode: both; 
        background: rgba(255, 255, 255, 0.02);
        padding: 3px 5px;
        border-radius: 4px;
      }
      .assessment-section { animation-delay: 0.1s; }
      .recommendation-section { animation-delay: 0.15s; }
      .warning-section { animation-delay: 0.2s; }
      p { line-height: 1.25; margin: 2px 0; }
      ul { margin: 2px 0; padding: 0; }
      h4 { margin: 4px 0 2px; }
    </style>` + analysisText;
    
    // Remove any extra blank lines or excessive whitespace
    analysisText = analysisText.replace(/\s*<br\s*\/>\s*<br\s*\/>/g, '<br />');
    analysisText = analysisText.replace(/\n\s*\n/g, '\n');
    
    // Make sure HTML is properly formatted and not escaped
    analysisText = analysisText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
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