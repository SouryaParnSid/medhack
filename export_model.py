import tensorflow as tf
import os

# Path to save the model for TensorFlow.js
output_dir = os.path.join('public', 'models', 'brain-stroke')

# Make sure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Load the model from the notebook
# Note: This assumes you've saved your model in the notebook
# If not, you'll need to recreate the model architecture and load weights
try:
    # Try to load the saved model if it exists
    model = tf.keras.models.load_model('brain_stroke_model')
    print("Model loaded successfully from saved model directory")
except:
    # If the model doesn't exist, we'll need to recreate it from the notebook
    print("Could not load saved model, creating model from architecture...")
    
    # Recreate the model architecture (this should match your notebook)
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(100, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Load weights if they exist
    try:
        model.load_weights('brain_stroke_weights.h5')
        print("Weights loaded successfully")
    except:
        print("WARNING: Could not load weights. The model will not be accurate without training.")

# Save the model in TensorFlow.js format
tf.keras.models.save_model(
    model,
    output_dir,
    overwrite=True,
    include_optimizer=False,
    save_format=None,
    signatures=None,
    options=None
)

# Convert the model to TensorFlow.js format
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, output_dir)

print(f"Model saved to {output_dir} in TensorFlow.js format")
print("You can now use this model in your web application.")
