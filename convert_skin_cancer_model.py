import tensorflow as tf
import tensorflowjs as tfjs
import os

# Path to the original model
model_path = 'skin_cancer_model.h5'

# Output directory for the converted model
output_dir = os.path.join('public', 'models', 'skin-cancer')

# Make sure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Load the model
model = tf.keras.models.load_model(model_path)

# Print model summary
model.summary()

# Convert the model to TensorFlow.js format
tfjs.converters.save_keras_model(model, output_dir)

print(f"Model converted and saved to {output_dir}")
