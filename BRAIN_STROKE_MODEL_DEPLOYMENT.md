# Brain Stroke Detection Model Deployment Guide

This guide explains how to deploy the brain stroke detection model from your Jupyter notebook to your SwasthyaAI website.

## Overview

We've created the following components for your brain stroke detection feature:

1. **TensorFlow.js Model Handler** (`src/models/brain-stroke/brainStrokeModel.ts`)
   - Handles loading the model in the browser
   - Provides functions for preprocessing images and making predictions

2. **Brain Stroke Detection Page** (`src/app/image-diagnosis/brain-stroke/page.tsx`)
   - Provides a user interface for uploading brain scan images
   - Displays the model's prediction results with confidence scores

3. **Model Export Script** (`export_model.py`)
   - Converts your TensorFlow model to TensorFlow.js format
   - Saves the model to the public directory for browser access

## Deployment Steps

### Step 1: Export Your Model

First, you need to export your trained model from the Jupyter notebook. There are two ways to do this:

#### Option 1: Save the model directly from your notebook

Add these lines to your notebook and run them:

```python
# Save the model to a directory
model.save('brain_stroke_model')

# Or save just the weights if you prefer
model.save_weights('brain_stroke_weights.h5')
```

#### Option 2: Use the export script

Run the provided export script:

```bash
pip install tensorflowjs
python export_model.py
```

This will:
1. Load your model (or recreate it if not found)
2. Convert it to TensorFlow.js format
3. Save it to `public/models/brain-stroke/`

### Step 2: Verify the Model Files

After exporting, check that these files exist in your `public/models/brain-stroke/` directory:
- `model.json` - The model architecture
- Several `.bin` files - The model weights

### Step 3: Start Your Next.js Application

Start your application to test the brain stroke detection feature:

```bash
npm run dev
```

### Step 4: Access the Brain Stroke Detection Feature

Navigate to the brain stroke detection page at:

```
http://localhost:3000/image-diagnosis/brain-stroke
```

Or access it through the main Image Diagnosis page.

## Troubleshooting

### Model Loading Issues

If the model fails to load in the browser:

1. Check the browser console for errors
2. Verify that the model files are in the correct location
3. Make sure the model architecture in `export_model.py` matches your notebook

### Image Processing Issues

If the model isn't processing images correctly:

1. Ensure the preprocessing in `brainStrokeModel.ts` matches your notebook
2. Check that images are being resized to 224x224 pixels
3. Verify that pixel values are normalized correctly

## Next Steps

- **Improve the model**: Continue training your model with more data
- **Add more features**: Consider adding more specialized diagnostic tools
- **User feedback**: Collect feedback to improve the interface and accuracy

## Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
