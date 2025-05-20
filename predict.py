
import pickle
import json
import numpy as np
import sys

try:
    # Load the model
    with open('ensemble_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Load the input data
    with open('temp_input.json', 'r') as f:
        input_data = json.load(f)
    
    # Convert to numpy array and reshape for prediction
    input_array = np.array(input_data).reshape(1, -1)
    
    # Make prediction
    probability = model.predict_proba(input_array)[0][1]  # Probability of class 1
    prediction = int(probability > 0.5)
    
    # Return the result
    result = {
        'probability': float(probability),
        'prediction': bool(prediction)
    }
    
    print(json.dumps(result))
    sys.exit(0)
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)
