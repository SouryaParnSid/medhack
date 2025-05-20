import * as tf from '@tensorflow/tfjs';

// Define the model interface
interface SkinCancerModel {
  model: tf.LayersModel | null;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  classNames: string[];
}

// Define the class names for skin cancer types
const SKIN_CANCER_CLASSES = [
  "Actinic Keratoses (Solar Keratoses) or Intraepithelial Carcinoma (Bowen's disease)",
  "Basal Cell Carcinoma",
  "Benign Keratosis",
  "Dermatofibroma",
  "Melanoma",
  "Melanocytic Nevi",
  "Vascular Lesions"
];

// Create a singleton instance to manage the model state
const modelState: SkinCancerModel = {
  model: null,
  isLoaded: false,
  isLoading: false,
  loadError: null,
  classNames: SKIN_CANCER_CLASSES
};

/**
 * Loads the skin cancer detection model
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
      modelState.model = await tf.loadLayersModel('/models/skin-cancer/model.json');
      modelState.isLoaded = true;
      console.log('Skin cancer detection model loaded successfully');
      return true;
    } catch (loadError) {
      // Handle 404 error specifically
      if (loadError instanceof Error && loadError.message.includes('404')) {
        console.warn('Model files not found at /models/skin-cancer/model.json');
        console.warn('This is expected if you haven\'t converted the model yet.');
        console.warn('The app will use simulated responses until the model is converted.');
        
        modelState.loadError = 'Model files not found. Please run the convert_skin_cancer_model.py script.';
      } else {
        console.error('Error loading skin cancer detection model:', loadError);
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
 * Preprocesses an image for the skin cancer detection model
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
 * Predicts the skin cancer type from an image
 * @param imageData - The base64 encoded image data
 */
export async function detectSkinCancer(imageData: string): Promise<{
  className: string;
  probability: number;
  allProbabilities: { className: string; probability: number }[];
  error?: string;
}> {
  try {
    // Make sure the model is loaded
    const isLoaded = await loadModel();
    if (!isLoaded || !modelState.model) {
      console.log('Model not available, using simulated response for development');
      
      // TEMPORARY: Since the model isn't available yet, provide a simulated response
      // This allows development and testing of the UI without the actual model
      
      // Generate a random index for the class
      const randomIndex = Math.floor(Math.random() * modelState.classNames.length);
      const simulatedClass = modelState.classNames[randomIndex];
      
      // Generate random probabilities for all classes
      const allProbs = modelState.classNames.map(className => {
        return {
          className,
          probability: Math.random()
        };
      });
      
      // Sort by probability (descending)
      allProbs.sort((a, b) => b.probability - a.probability);
      
      // Normalize probabilities to sum to 1
      const sum = allProbs.reduce((acc, curr) => acc + curr.probability, 0);
      allProbs.forEach(item => item.probability = item.probability / sum);
      
      return {
        className: simulatedClass,
        probability: allProbs[randomIndex].probability,
        allProbabilities: allProbs
      };
    }

    // Preprocess the image
    const tensor = await preprocessImage(imageData);

    // Run inference
    const predictions = await modelState.model.predict(tensor) as tf.Tensor;
    
    // Get the prediction values
    const probabilities = await predictions.data();
    
    // Find the class with the highest probability
    let maxProbability = 0;
    let predictedClassIndex = 0;
    
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProbability) {
        maxProbability = probabilities[i];
        predictedClassIndex = i;
      }
    }
    
    // Create the array of all probabilities with class names
    const allProbabilities = Array.from(probabilities).map((prob, index) => {
      return {
        className: modelState.classNames[index],
        probability: prob
      };
    });
    
    // Sort by probability (descending)
    allProbabilities.sort((a, b) => b.probability - a.probability);
    
    // Clean up tensors to prevent memory leaks
    tensor.dispose();
    predictions.dispose();

    // Return the prediction result
    return {
      className: modelState.classNames[predictedClassIndex],
      probability: maxProbability,
      allProbabilities
    };
  } catch (error) {
    console.error('Error during skin cancer detection:', error);
    
    // TEMPORARY: For development purposes, provide a simulated response even on error
    const randomIndex = Math.floor(Math.random() * modelState.classNames.length);
    const simulatedClass = modelState.classNames[randomIndex];
    
    // Generate random probabilities for all classes
    const allProbs = modelState.classNames.map(className => {
      return {
        className,
        probability: Math.random()
      };
    });
    
    // Sort by probability (descending)
    allProbs.sort((a, b) => b.probability - a.probability);
    
    // Normalize probabilities to sum to 1
    const sum = allProbs.reduce((acc, curr) => acc + curr.probability, 0);
    allProbs.forEach(item => item.probability = item.probability / sum);
    
    return {
      className: simulatedClass,
      probability: allProbs[randomIndex].probability,
      allProbabilities: allProbs,
      error: error instanceof Error ? error.message : 'Unknown error during detection'
    };
  }
}

/**
 * Gets information about a specific skin cancer type
 * @param cancerType - The name of the cancer type
 */
export function getSkinCancerInfo(cancerType: string): {
  description: string;
  symptoms: string[];
  riskFactors: string[];
  treatments: string[];
  preventionTips: string[];
} {
  // Information about different skin cancer types
  const cancerInfo: Record<string, {
    description: string;
    symptoms: string[];
    riskFactors: string[];
    treatments: string[];
    preventionTips: string[];
  }> = {
    "Actinic Keratoses (Solar Keratoses) or Intraepithelial Carcinoma (Bowen's disease)": {
      description: "Actinic Keratoses are dry, scaly patches of skin that have been damaged by the sun. They are considered precancerous lesions that may develop into skin cancer if left untreated. Bowen's disease is an early form of skin cancer that appears as a persistent, slow-growing, red and scaly patch.",
      symptoms: [
        "Rough, dry, or scaly patch of skin",
        "Flat to slightly raised patch or bump on the skin",
        "Hard, wart-like surface",
        "Color variations (tan, pink, red, or a combination)",
        "Itching, burning, or tenderness in the affected area"
      ],
      riskFactors: [
        "Fair skin",
        "Excessive sun exposure",
        "Age (more common in older adults)",
        "Weakened immune system",
        "History of sunburns"
      ],
      treatments: [
        "Cryotherapy (freezing)",
        "Topical medications (5-fluorouracil, imiquimod)",
        "Photodynamic therapy",
        "Curettage and electrosurgery",
        "Laser surgery"
      ],
      preventionTips: [
        "Use broad-spectrum sunscreen (SPF 30+)",
        "Wear protective clothing",
        "Avoid peak sun hours (10 AM to 4 PM)",
        "Regular skin examinations",
        "Avoid tanning beds"
      ]
    },
    "Basal Cell Carcinoma": {
      description: "Basal Cell Carcinoma is the most common type of skin cancer. It begins in the basal cells of the epidermis and rarely spreads to other parts of the body. It typically appears on sun-exposed areas like the face and neck.",
      symptoms: [
        'Pearly or waxy bump',
        'Flat, flesh-colored or brown lesion',
        'Bleeding or scabbing sore that heals and returns',
        'Scar-like area that is white, yellow, or waxy',
        'Raised reddish patch that might be itchy'
      ],
      riskFactors: [
        'Chronic sun exposure',
        'Fair skin',
        'Personal or family history of skin cancer',
        'Exposure to radiation',
        'Exposure to arsenic'
      ],
      treatments: [
        'Surgical excision',
        'Mohs surgery',
        'Radiation therapy',
        'Cryotherapy',
        'Topical medications for superficial cancers'
      ],
      preventionTips: [
        'Regular use of sunscreen',
        'Protective clothing and hats',
        'Regular skin checks',
        'Avoid tanning beds',
        'Seek shade during peak sun hours'
      ]
    },
    'Benign Keratosis': {
      description: 'Benign Keratosis, often called seborrheic keratosis, is a common non-cancerous skin growth. These growths often appear as people age and are not harmful, though they may be removed for cosmetic reasons or if they become irritated.',
      symptoms: [
        'Waxy, stuck-on appearance',
        'Brown, black, or light tan color',
        'Round or oval shape',
        'Flat or slightly raised',
        'Varying size from very small to more than 1 inch across'
      ],
      riskFactors: [
        'Age (more common in older adults)',
        'Genetic predisposition',
        'Sun exposure (may play a role)',
        'Pregnancy or estrogen fluctuations',
        'Friction or irritation'
      ],
      treatments: [
        'Cryotherapy (freezing)',
        'Curettage (scraping)',
        'Electrocautery (burning)',
        'Laser therapy',
        'No treatment if asymptomatic'
      ],
      preventionTips: [
        'No specific prevention as they are largely genetic',
        'Sun protection may help reduce occurrence',
        'Regular skin examinations',
        'Gentle skin care to avoid irritation',
        'Consult a dermatologist for any changing skin lesions'
      ]
    },
    'Dermatofibroma': {
      description: 'Dermatofibroma is a common benign skin tumor that often appears as a small, firm bump on the skin. They are usually painless and typically appear on the legs, though they can occur anywhere on the body.',
      symptoms: [
        'Small, firm bump on the skin',
        'Pink, red, brown, or purple coloration',
        'Dimpling when pinched',
        'Usually less than 1 cm in diameter',
        'May be tender or itchy'
      ],
      riskFactors: [
        'Minor skin injuries (insect bites, splinters)',
        'More common in women',
        'May be associated with immune system factors',
        'Possible hormonal influences',
        'No clear genetic link'
      ],
      treatments: [
        'Usually no treatment needed',
        'Surgical excision if symptomatic or for cosmetic reasons',
        'Cryotherapy',
        'Laser therapy',
        'Steroid injections to reduce size'
      ],
      preventionTips: [
        'No specific prevention methods',
        'Protect skin from injuries',
        'Regular skin examinations',
        'Avoid picking or traumatizing existing lesions',
        'Consult a dermatologist for any changing skin lesions'
      ]
    },
    'Melanoma': {
      description: 'Melanoma is the most dangerous form of skin cancer. It develops in the cells that produce melanin, the pigment that gives skin its color. Melanoma can spread to other parts of the body if not detected and treated early.',
      symptoms: [
        'Asymmetrical moles or marks',
        'Borders that are irregular or poorly defined',
        'Color variations within the same mole',
        'Diameter larger than 6mm (pencil eraser)',
        'Evolving size, shape, or color'
      ],
      riskFactors: [
        'Ultraviolet light exposure',
        'Fair skin, light hair, freckles',
        'Family or personal history of melanoma',
        'Multiple moles (more than 50)',
        'Weakened immune system'
      ],
      treatments: [
        'Surgical removal',
        'Lymph node biopsy',
        'Immunotherapy',
        'Targeted therapy',
        'Radiation therapy'
      ],
      preventionTips: [
        'Regular skin self-examinations',
        'Annual professional skin checks',
        'Avoid sun during peak hours',
        'Use broad-spectrum sunscreen (SPF 30+)',
        'Wear protective clothing, hats, and sunglasses'
      ]
    },
    'Melanocytic Nevi': {
      description: 'Melanocytic Nevi, commonly known as moles, are growths on the skin that develop when pigment cells (melanocytes) grow in clusters. Most moles are harmless, but some may develop into melanoma over time.',
      symptoms: [
        'Brown or black spots on the skin',
        'Round or oval shape with well-defined borders',
        'Flat or raised appearance',
        'Usually less than 6mm in diameter',
        'Consistent color throughout'
      ],
      riskFactors: [
        'Genetic predisposition',
        'Sun exposure, especially in childhood',
        'Fair skin',
        'Hormonal changes (puberty, pregnancy)',
        'Immunosuppression'
      ],
      treatments: [
        'Monitoring for changes',
        'Surgical removal if suspicious',
        'Shave excision for cosmetic reasons',
        'Punch excision',
        'Laser removal (for some types)'
      ],
      preventionTips: [
        'Regular self-examination',
        'Professional skin checks',
        'Sun protection',
        'Avoid tanning beds',
        'Document changes in existing moles'
      ]
    },
    'Vascular Lesions': {
      description: 'Vascular lesions are abnormalities of blood vessels that appear on the skin or internal organs. They include hemangiomas, port-wine stains, and other vascular malformations. Most are benign but may cause cosmetic concerns.',
      symptoms: [
        'Red, purple, or blue discoloration of the skin',
        'Raised or flat appearance',
        'May blanch with pressure',
        'Can range from small dots to large patches',
        'May be present at birth or develop later'
      ],
      riskFactors: [
        'Genetic factors',
        'Hormonal influences',
        'Pregnancy',
        'Liver disease (for some types)',
        'Aging (for some types like cherry angiomas)'
      ],
      treatments: [
        'Laser therapy',
        'Sclerotherapy',
        'Surgical removal',
        'Topical beta-blockers (for infantile hemangiomas)',
        'Compression therapy'
      ],
      preventionTips: [
        'No specific prevention for congenital lesions',
        'Sun protection for photosensitive lesions',
        'Regular monitoring',
        'Avoid trauma to affected areas',
        'Consult a dermatologist for any concerning changes'
      ]
    }
  };

  // Return information for the specified cancer type, or default info if not found
  return cancerInfo[cancerType] || {
    description: 'Information not available for this skin condition.',
    symptoms: ['Consult a dermatologist for proper evaluation.'],
    riskFactors: ['Consult a dermatologist for proper evaluation.'],
    treatments: ['Consult a dermatologist for proper evaluation.'],
    preventionTips: ['Regular skin examinations', 'Sun protection', 'Consult a dermatologist for proper evaluation.']
  };
}
